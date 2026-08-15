import { Router, type IRouter } from "express";
import {
  db,
  countriesTable,
  citiesTable,
  communitiesTable,
  serviceCategoriesTable,
  providerCategoriesTable,
  providersTable,
  reviewsTable,
  jobsTable,
  adsTable,
} from "@workspace/db";
import { GetMetaResponse, GetHomeSummaryResponse } from "@workspace/api-zod";
import {
  loadContext,
  loadProviderBundles,
  providerSummary,
  jobSummary,
  jobInterestCounts,
} from "../lib/marketplace";

const router: IRouter = Router();

router.get("/meta", async (_req, res): Promise<void> => {
  const [countries, cities, communities, categories, provCats] = await Promise.all([
    db.select().from(countriesTable),
    db.select().from(citiesTable),
    db.select().from(communitiesTable),
    db.select().from(serviceCategoriesTable),
    db.select().from(providerCategoriesTable),
  ]);
  const catCounts = new Map<number, number>();
  for (const pc of provCats)
    catCounts.set(pc.categoryId, (catCounts.get(pc.categoryId) ?? 0) + 1);

  const payload = {
    countries: countries.map((country) => ({
      ...country,
      cities: cities
        .filter((c) => c.countryId === country.id)
        .map((city) => ({
          id: city.id,
          name: city.name,
          region: city.region,
          communities: communities
            .filter((cm) => cm.cityId === city.id)
            .map((cm) => ({ id: cm.id, name: cm.name })),
        })),
    })),
    categories: categories.map((c) => ({
      ...c,
      providerCount: catCounts.get(c.id) ?? 0,
    })),
  };
  res.json(GetMetaResponse.parse(payload));
});

router.get("/home", async (_req, res): Promise<void> => {
  const ctx = await loadContext();
  const [bundles, jobs, ads, provCats, reviews] = await Promise.all([
    loadProviderBundles(ctx),
    db.select().from(jobsTable),
    db.select().from(adsTable),
    db.select().from(providerCategoriesTable),
    db.select().from(reviewsTable),
  ]);
  const interestCounts = await jobInterestCounts();

  const summaries = bundles.map((b) => providerSummary(ctx, b));
  const topProviders = [...summaries]
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, 6);
  const bestValueProviders = [...summaries]
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 6);

  const catCounts = new Map<number, number>();
  for (const pc of provCats)
    catCounts.set(pc.categoryId, (catCounts.get(pc.categoryId) ?? 0) + 1);
  const popularCategories = [...ctx.categories.values()]
    .map((c) => ({ ...c, providerCount: catCounts.get(c.id) ?? 0 }))
    .sort((a, b) => b.providerCount - a.providerCount)
    .slice(0, 8);

  const openJobs = jobs.filter((j) =>
    ["open", "providers_interested"].includes(j.status),
  );
  const recentJobs = [...openJobs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6)
    .map((j) => jobSummary(ctx, j, interestCounts.get(j.id) ?? 0));

  const payload = {
    popularCategories,
    topProviders,
    bestValueProviders,
    recentJobs,
    ads: ads.filter((a) => a.active).slice(0, 4),
    stats: {
      providerCount: bundles.length,
      verifiedProviderCount: bundles.filter(
        (b) => b.provider.verificationStatus === "verified",
      ).length,
      openJobCount: openJobs.length,
      reviewCount: reviews.length,
      communityCount: ctx.communities.size,
    },
  };
  res.json(GetHomeSummaryResponse.parse(payload));
});

export default router;
