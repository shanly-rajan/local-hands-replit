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

router.get("/home", async (req, res): Promise<void> => {
  const ctx = await loadContext();
  const [allBundles, jobs, ads, provCats, reviews] = await Promise.all([
    loadProviderBundles(ctx),
    db.select().from(jobsTable),
    db.select().from(adsTable),
    db.select().from(providerCategoriesTable),
    db.select().from(reviewsTable),
  ]);
  const interestCounts = await jobInterestCounts();

  // Parse optional location filters
  const countryId = req.query.countryId ? Number(req.query.countryId) : null;
  const cityId = req.query.cityId ? Number(req.query.cityId) : null;
  const communityId = req.query.communityId ? Number(req.query.communityId) : null;

  // Build the set of matching communityIds for the selected location scope
  function matchingCommunityIds(): Set<number> | null {
    if (communityId) return new Set([communityId]);
    if (cityId) {
      const ids = [...ctx.communities.values()]
        .filter((c) => c.cityId === cityId)
        .map((c) => c.id);
      return new Set(ids);
    }
    if (countryId) {
      const citiesInCountry = new Set(
        [...ctx.cities.values()].filter((c) => c.countryId === countryId).map((c) => c.id),
      );
      const ids = [...ctx.communities.values()]
        .filter((c) => citiesInCountry.has(c.cityId))
        .map((c) => c.id);
      return new Set(ids);
    }
    return null; // no filter — return all
  }

  const scope = matchingCommunityIds();
  const bundles = scope ? allBundles.filter((b) => scope.has(b.provider.communityId)) : allBundles;
  const scopedJobs = scope ? jobs.filter((j) => scope.has(j.communityId)) : jobs;

  const summaries = bundles.map((b) => providerSummary(ctx, b));
  const topProviders = [...summaries]
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, 6);
  const bestValueProviders = [...summaries]
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 6);

  // Category counts scoped to filtered providers
  const scopedProviderIds = new Set(bundles.map((b) => b.provider.id));
  const catCounts = new Map<number, number>();
  for (const pc of provCats) {
    if (scopedProviderIds.has(pc.providerId)) {
      catCounts.set(pc.categoryId, (catCounts.get(pc.categoryId) ?? 0) + 1);
    }
  }
  const popularCategories = [...ctx.categories.values()]
    .map((c) => ({ ...c, providerCount: catCounts.get(c.id) ?? 0 }))
    .sort((a, b) => b.providerCount - a.providerCount)
    .slice(0, 8);

  const openJobs = scopedJobs.filter((j) =>
    ["open", "providers_interested"].includes(j.status),
  );
  const recentJobs = [...openJobs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6)
    .map((j) => jobSummary(ctx, j, interestCounts.get(j.id) ?? 0));

  // Ads filtered by countryId (if set)
  const scopedAds = countryId
    ? ads.filter((a) => a.active && a.countryId === countryId)
    : ads.filter((a) => a.active);

  // Reviews scoped to filtered providers
  const scopedReviews = scope
    ? reviews.filter((r) => scopedProviderIds.has(r.providerId))
    : reviews;

  const payload = {
    popularCategories,
    topProviders,
    bestValueProviders,
    recentJobs,
    ads: scopedAds.slice(0, 4),
    stats: {
      providerCount: bundles.length,
      verifiedProviderCount: bundles.filter(
        (b) => b.provider.verificationStatus === "verified",
      ).length,
      openJobCount: openJobs.length,
      reviewCount: scopedReviews.length,
      communityCount: scope ? scope.size : ctx.communities.size,
    },
  };
  res.json(GetHomeSummaryResponse.parse(payload));
});

export default router;
