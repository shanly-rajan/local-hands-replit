import { Router, type IRouter } from "express";
import { db, reviewsTable, favoritesTable, providersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListProvidersQueryParams,
  ListProvidersResponse,
  GetProviderParams,
  GetProviderResponse,
  ListProviderReviewsParams,
  ListProviderReviewsResponse,
  CreateProviderReviewParams,
  CreateProviderReviewBody,
  CreateProviderReviewResponse,
  AddFavoriteBody,
  ListFavoritesResponse,
} from "@workspace/api-zod";
import {
  loadContext,
  loadProviderBundles,
  providerSummary,
  computeRatings,
  reviewJson,
} from "../lib/marketplace";

const router: IRouter = Router();

router.get("/providers", async (req, res): Promise<void> => {
  const parsed = ListProvidersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const q = parsed.data;
  const ctx = await loadContext();
  const bundles = await loadProviderBundles(ctx);

  let results = bundles;
  if (q.categoryId != null)
    results = results.filter((b) => b.categoryIds.includes(q.categoryId!));
  if (q.communityId != null)
    results = results.filter((b) => b.provider.communityId === q.communityId);
  if (q.cityId != null)
    results = results.filter(
      (b) => ctx.communities.get(b.provider.communityId)?.cityId === q.cityId,
    );
  if (q.countryId != null)
    results = results.filter((b) => {
      const city = ctx.cities.get(
        ctx.communities.get(b.provider.communityId)?.cityId ?? -1,
      );
      return city?.countryId === q.countryId;
    });
  if (q.verifiedOnly)
    results = results.filter((b) => b.provider.verificationStatus === "verified");
  if (q.search) {
    const s = q.search.toLowerCase();
    results = results.filter(
      (b) =>
        b.provider.businessName.toLowerCase().includes(s) ||
        b.provider.tagline.toLowerCase().includes(s) ||
        b.provider.description.toLowerCase().includes(s) ||
        b.categoryNames.some((c) => c.toLowerCase().includes(s)),
    );
  }

  let summaries = results.map((b) => providerSummary(ctx, b));
  switch (q.sort) {
    case "rating":
      summaries.sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount);
      break;
    case "reviews":
      summaries.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
      summaries.sort((a, b) => b.id - a.id);
      break;
    case "value":
    default:
      summaries.sort((a, b) => b.valueScore - a.valueScore);
      break;
  }
  res.json(ListProvidersResponse.parse(summaries));
});

router.get("/providers/:id", async (req, res): Promise<void> => {
  const params = GetProviderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const ctx = await loadContext();
  const bundles = await loadProviderBundles(ctx);
  const bundle = bundles.find((b) => b.provider.id === params.data.id);
  if (!bundle) {
    res.status(404).json({ message: "Provider not found" });
    return;
  }
  const ratings = computeRatings(bundle.reviews);
  const isVerified = bundle.provider.verificationStatus === "verified";
  const payload = {
    ...providerSummary(ctx, bundle),
    description: bundle.provider.description,
    serviceAreas: bundle.provider.serviceAreas,
    ratingBreakdown: ratings.breakdown,
    reviews: bundle.reviews.map(reviewJson),
    completedJobCount: bundle.reviews.filter((r) => r.verifiedJob).length,
    contactPhone: isVerified ? bundle.provider.contactPhone : null,
    contactEmail: isVerified ? bundle.provider.contactEmail : null,
  };
  res.json(payload);
});

router.get("/providers/:id/reviews", async (req, res): Promise<void> => {
  const params = ListProviderReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.providerId, params.data.id));
  reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  res.json(ListProviderReviewsResponse.parse(reviews.map(reviewJson)));
});

router.post("/providers/:id/reviews", async (req, res): Promise<void> => {
  const params = CreateProviderReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: params.error.message });
    return;
  }
  const body = CreateProviderReviewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const [provider] = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.id, params.data.id));
  if (!provider) {
    res.status(404).json({ message: "Provider not found" });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values({ providerId: params.data.id, ...body.data })
    .returning();
  res.status(201).json(CreateProviderReviewResponse.parse(reviewJson(review!)));
});

router.get("/favorites", async (_req, res): Promise<void> => {
  const ctx = await loadContext();
  const bundles = await loadProviderBundles(ctx);
  const favs = bundles
    .filter((b) => b.isFavorite)
    .map((b) => providerSummary(ctx, b));
  res.json(ListFavoritesResponse.parse(favs));
});

router.post("/favorites", async (req, res): Promise<void> => {
  const body = AddFavoriteBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ message: body.error.message });
    return;
  }
  const existing = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.providerId, body.data.providerId));
  if (existing.length === 0) {
    await db.insert(favoritesTable).values({ providerId: body.data.providerId });
  }
  res.status(201).json({ message: "Saved" });
});

router.delete("/favorites/:providerId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.providerId)
    ? req.params.providerId[0]
    : req.params.providerId;
  const providerId = parseInt(raw ?? "", 10);
  if (Number.isNaN(providerId)) {
    res.status(400).json({ message: "Invalid provider id" });
    return;
  }
  await db.delete(favoritesTable).where(eq(favoritesTable.providerId, providerId));
  res.json({ message: "Removed" });
});

export default router;
