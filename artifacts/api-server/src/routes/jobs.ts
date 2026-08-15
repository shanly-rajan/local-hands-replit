import { Router, type IRouter } from "express";
import { db, jobsTable, jobInterestsTable, providersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListJobsQueryParams,
  ListJobsResponse,
  CreateJobBody,
  CreateJobResponse,
  GetJobParams,
  GetJobResponse,
  CreateJobInterestParams,
  CreateJobInterestBody,
  CreateJobInterestResponse,
  SelectJobProviderParams,
  SelectJobProviderBody,
  SelectJobProviderResponse,
  UpdateJobStatusParams,
  UpdateJobStatusBody,
  UpdateJobStatusResponse,
} from "@workspace/api-zod";
import {
  loadContext,
  jobSummary,
  jobDetail,
  jobInterestCounts,
} from "../lib/marketplace";

const router: IRouter = Router();

router.get("/jobs", async (req, res): Promise<void> => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const q = parsed.data;
  const ctx = await loadContext();
  const [jobs, counts] = await Promise.all([
    db.select().from(jobsTable),
    jobInterestCounts(),
  ]);

  let results = jobs.filter((j) => j.status !== "draft");
  if (q.categoryId != null) results = results.filter((j) => j.categoryId === q.categoryId);
  if (q.cityId != null)
    results = results.filter(
      (j) => ctx.communities.get(j.communityId)?.cityId === q.cityId,
    );
  if (q.countryId != null)
    results = results.filter((j) => {
      const city = ctx.cities.get(ctx.communities.get(j.communityId)?.cityId ?? -1);
      return city?.countryId === q.countryId;
    });
  if (q.status) results = results.filter((j) => j.status === q.status);
  if (q.mine) results = results.filter((j) => j.isMine);
  if (q.search) {
    const s = q.search.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(s) || j.description.toLowerCase().includes(s),
    );
  }
  results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  res.json(
    ListJobsResponse.parse(
      results.map((j) => jobSummary(ctx, j, counts.get(j.id) ?? 0)),
    ),
  );
});

router.post("/jobs", async (req, res): Promise<void> => {
  const body = CreateJobBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const d = body.data;
  if (d.budgetType === "fixed" && d.budgetMin == null) {
    res.status(400).json({ message: "A fixed budget requires an amount" });
    return;
  }
  if (d.budgetType === "range" && (d.budgetMin == null || d.budgetMax == null)) {
    res.status(400).json({ message: "A budget range requires a minimum and maximum" });
    return;
  }
  const ctx = await loadContext();
  if (!ctx.communities.has(d.communityId)) {
    res.status(400).json({ message: "Unknown community" });
    return;
  }
  if (!ctx.categories.has(d.categoryId)) {
    res.status(400).json({ message: "Unknown category" });
    return;
  }
  const [job] = await db
    .insert(jobsTable)
    .values({
      title: d.title,
      description: d.description,
      categoryId: d.categoryId,
      communityId: d.communityId,
      budgetType: d.budgetType,
      budgetMin: d.budgetMin ?? null,
      budgetMax: d.budgetType === "fixed" ? d.budgetMin ?? null : d.budgetMax ?? null,
      urgency: d.urgency,
      preferredDate: d.preferredDate ?? null,
      status: "open",
      isMine: true,
    })
    .returning();
  res.status(201).json(CreateJobResponse.parse(await jobDetail(ctx, job!)));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  const ctx = await loadContext();
  res.json(GetJobResponse.parse(await jobDetail(ctx, job)));
});

router.post("/jobs/:id/interests", async (req, res): Promise<void> => {
  const params = CreateJobInterestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const body = CreateJobInterestBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (!["open", "providers_interested"].includes(job.status)) {
    res.status(400).json({ message: "This job is no longer accepting interest" });
    return;
  }
  const [provider] = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.id, body.data.providerId));
  if (!provider) {
    res.status(400).json({ message: "Unknown provider" });
    return;
  }
  const existing = await db
    .select()
    .from(jobInterestsTable)
    .where(eq(jobInterestsTable.jobId, job.id));
  if (existing.some((i) => i.providerId === body.data.providerId)) {
    res.status(400).json({ message: "This provider has already expressed interest" });
    return;
  }
  const [interest] = await db
    .insert(jobInterestsTable)
    .values({
      jobId: job.id,
      providerId: body.data.providerId,
      message: body.data.message,
      canMeetBudget: body.data.canMeetBudget,
      estimateMin: body.data.estimateMin ?? null,
      estimateMax: body.data.estimateMax ?? null,
      availability: body.data.availability ?? null,
    })
    .returning();
  if (job.status === "open") {
    await db
      .update(jobsTable)
      .set({ status: "providers_interested" })
      .where(eq(jobsTable.id, job.id));
  }
  const ctx = await loadContext();
  const detail = await jobDetail(ctx, { ...job, status: "providers_interested" });
  const created = detail.interests.find((i: { id: number }) => i.id === interest!.id);
  res.status(201).json(CreateJobInterestResponse.parse(created));
});

router.post("/jobs/:id/select", async (req, res): Promise<void> => {
  const params = SelectJobProviderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const body = SelectJobProviderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  const interests = await db
    .select()
    .from(jobInterestsTable)
    .where(eq(jobInterestsTable.jobId, job.id));
  if (!interests.some((i) => i.id === body.data.interestId)) {
    res.status(400).json({ message: "That expression of interest does not belong to this job" });
    return;
  }
  if (!["open", "providers_interested"].includes(job.status)) {
    res.status(400).json({ message: "A provider has already been selected for this job" });
    return;
  }
  const [updated] = await db
    .update(jobsTable)
    .set({ status: "provider_selected", selectedInterestId: body.data.interestId })
    .where(eq(jobsTable.id, job.id))
    .returning();
  const ctx = await loadContext();
  res.json(SelectJobProviderResponse.parse(await jobDetail(ctx, updated!)));
});

const allowedTransitions: Record<string, string[]> = {
  open: ["cancelled"],
  providers_interested: ["cancelled"],
  provider_selected: ["in_progress", "cancelled", "disputed"],
  in_progress: ["completed", "cancelled", "disputed"],
  completed: ["reviewed", "disputed"],
  reviewed: [],
  cancelled: ["open"],
  expired: ["open"],
  disputed: [],
};

router.patch("/jobs/:id/status", async (req, res): Promise<void> => {
  const params = UpdateJobStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const body = UpdateJobStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id));
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  const allowed = allowedTransitions[job.status] ?? [];
  if (!allowed.includes(body.data.status)) {
    res.status(400).json({
      message: `Cannot move a job from "${job.status}" to "${body.data.status}"`,
    });
    return;
  }
  const [updated] = await db
    .update(jobsTable)
    .set({ status: body.data.status })
    .where(eq(jobsTable.id, job.id))
    .returning();
  const ctx = await loadContext();
  res.json(UpdateJobStatusResponse.parse(await jobDetail(ctx, updated!)));
});

export default router;
