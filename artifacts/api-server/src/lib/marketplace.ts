import {
  db,
  countriesTable,
  citiesTable,
  communitiesTable,
  serviceCategoriesTable,
  providersTable,
  providerCategoriesTable,
  reviewsTable,
  favoritesTable,
  jobsTable,
  jobInterestsTable,
  type Provider,
  type Review,
  type Job,
} from "@workspace/db";

export interface Context {
  countries: Map<number, typeof countriesTable.$inferSelect>;
  cities: Map<number, typeof citiesTable.$inferSelect>;
  communities: Map<number, typeof communitiesTable.$inferSelect>;
  categories: Map<number, typeof serviceCategoriesTable.$inferSelect>;
}

export async function loadContext(): Promise<Context> {
  const [countries, cities, communities, categories] = await Promise.all([
    db.select().from(countriesTable),
    db.select().from(citiesTable),
    db.select().from(communitiesTable),
    db.select().from(serviceCategoriesTable),
  ]);
  return {
    countries: new Map(countries.map((c) => [c.id, c])),
    cities: new Map(cities.map((c) => [c.id, c])),
    communities: new Map(communities.map((c) => [c.id, c])),
    categories: new Map(categories.map((c) => [c.id, c])),
  };
}

export function locationOf(ctx: Context, communityId: number) {
  const community = ctx.communities.get(communityId);
  const city = community ? ctx.cities.get(community.cityId) : undefined;
  const country = city ? ctx.countries.get(city.countryId) : undefined;
  return {
    communityName: community?.name ?? "Unknown",
    cityName: city?.name ?? "Unknown",
    countryId: country?.id ?? 0,
    currencySymbol: country?.currencySymbol ?? "",
  };
}

export interface RatingBreakdown {
  quality: number;
  price: number;
  reliability: number;
  professionalism: number;
  overall: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeRatings(reviews: Review[]): {
  avgRating: number;
  reviewCount: number;
  breakdown: RatingBreakdown;
  valueScore: number;
  explanation: string;
} {
  const n = reviews.length;
  if (n === 0) {
    return {
      avgRating: 0,
      reviewCount: 0,
      breakdown: { quality: 0, price: 0, reliability: 0, professionalism: 0, overall: 0 },
      valueScore: 50,
      explanation: "New provider — no reviews yet. Score starts at a neutral baseline.",
    };
  }
  const avg = (f: (r: Review) => number) => reviews.reduce((s, r) => s + f(r), 0) / n;
  const breakdown: RatingBreakdown = {
    quality: round1(avg((r) => r.quality)),
    price: round1(avg((r) => r.price)),
    reliability: round1(avg((r) => r.reliability)),
    professionalism: round1(avg((r) => r.professionalism)),
    overall: round1(avg((r) => r.overall)),
  };
  // Weighted composite: quality 30%, overall 25%, price fairness 20%,
  // reliability 15%, professionalism 10%
  const weighted =
    breakdown.quality * 0.3 +
    breakdown.overall * 0.25 +
    breakdown.price * 0.2 +
    breakdown.reliability * 0.15 +
    breakdown.professionalism * 0.1;
  // Review confidence: shrink toward a neutral 3.5 when few reviews exist,
  // so a single 5-star review cannot dominate the rankings.
  const confidence = n / (n + 4);
  const adjusted = weighted * confidence + 3.5 * (1 - confidence);
  const valueScore = Math.round((adjusted / 5) * 100);

  const parts: string[] = [];
  if (breakdown.quality >= 4.5) parts.push("excellent work quality");
  else if (breakdown.quality >= 4) parts.push("strong work quality");
  else if (breakdown.quality >= 3) parts.push("decent work quality");
  else parts.push("mixed work quality");
  if (breakdown.price >= 4.5) parts.push("very fair pricing");
  else if (breakdown.price >= 4) parts.push("fair pricing");
  else if (breakdown.price >= 3) parts.push("reasonable pricing");
  else parts.push("pricing concerns raised by some customers");
  if (n >= 50) parts.push(`consistently strong feedback across ${n} reviews`);
  else if (n >= 10) parts.push(`backed by ${n} community reviews`);
  else parts.push(`based on ${n} review${n === 1 ? "" : "s"} so far`);
  const explanation = parts.join(", ").replace(/^./, (c) => c.toUpperCase()) + ".";

  return { avgRating: breakdown.overall, reviewCount: n, breakdown, valueScore, explanation };
}

export interface ProviderBundle {
  provider: Provider;
  categoryNames: string[];
  categoryIds: number[];
  reviews: Review[];
  isFavorite: boolean;
}

export async function loadProviderBundles(ctx: Context): Promise<ProviderBundle[]> {
  const [providers, provCats, reviews, favorites] = await Promise.all([
    db.select().from(providersTable),
    db.select().from(providerCategoriesTable),
    db.select().from(reviewsTable),
    db.select().from(favoritesTable),
  ]);
  const favSet = new Set(favorites.map((f) => f.providerId));
  const reviewsByProvider = new Map<number, Review[]>();
  for (const r of reviews) {
    const list = reviewsByProvider.get(r.providerId) ?? [];
    list.push(r);
    reviewsByProvider.set(r.providerId, list);
  }
  return providers.map((p) => {
    const cats = provCats.filter((pc) => pc.providerId === p.id);
    return {
      provider: p,
      categoryIds: cats.map((c) => c.categoryId),
      categoryNames: cats
        .map((c) => ctx.categories.get(c.categoryId)?.name)
        .filter((x): x is string => Boolean(x)),
      reviews: (reviewsByProvider.get(p.id) ?? []).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
      isFavorite: favSet.has(p.id),
    };
  });
}

export function providerSummary(ctx: Context, b: ProviderBundle) {
  const loc = locationOf(ctx, b.provider.communityId);
  const ratings = computeRatings(b.reviews);
  return {
    id: b.provider.id,
    businessName: b.provider.businessName,
    providerType: b.provider.providerType,
    tagline: b.provider.tagline,
    categories: b.categoryNames,
    ...loc,
    verificationStatus: b.provider.verificationStatus,
    avgRating: ratings.avgRating,
    reviewCount: ratings.reviewCount,
    valueScore: ratings.valueScore,
    valueScoreExplanation: ratings.explanation,
    priceIndicator: b.provider.priceIndicator,
    yearsActive: b.provider.yearsActive,
    isFavorite: b.isFavorite,
  };
}

export function reviewJson(r: Review) {
  return {
    id: r.id,
    providerId: r.providerId,
    reviewerName: r.reviewerName,
    comment: r.comment,
    verifiedJob: r.verifiedJob,
    createdAt: r.createdAt.toISOString(),
    quality: r.quality,
    price: r.price,
    reliability: r.reliability,
    professionalism: r.professionalism,
    overall: r.overall,
    providerResponse: r.providerResponse,
  };
}

export async function jobInterestCounts(): Promise<Map<number, number>> {
  const interests = await db.select().from(jobInterestsTable);
  const counts = new Map<number, number>();
  for (const i of interests) counts.set(i.jobId, (counts.get(i.jobId) ?? 0) + 1);
  return counts;
}

export function jobSummary(ctx: Context, job: Job, interestCount: number) {
  const loc = locationOf(ctx, job.communityId);
  const cat = ctx.categories.get(job.categoryId);
  return {
    id: job.id,
    title: job.title,
    categoryName: cat?.name ?? "Unknown",
    categoryIcon: cat?.icon ?? "wrench",
    ...loc,
    budgetType: job.budgetType,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    status: job.status,
    urgency: job.urgency,
    postedAt: job.createdAt.toISOString(),
    preferredDate: job.preferredDate,
    interestCount,
    isMine: job.isMine,
  };
}

export async function jobDetail(ctx: Context, job: Job) {
  const interests = await db.select().from(jobInterestsTable);
  const jobInterests = interests
    .filter((i) => i.jobId === job.id)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const bundles = await loadProviderBundles(ctx);
  const byId = new Map(bundles.map((b) => [b.provider.id, b]));
  const loc = locationOf(ctx, job.communityId);
  return {
    ...jobSummary(ctx, job, jobInterests.length),
    description: job.description,
    selectedInterestId: job.selectedInterestId,
    interests: jobInterests.map((i) => {
      const b = byId.get(i.providerId);
      const ratings = b ? computeRatings(b.reviews) : computeRatings([]);
      return {
        id: i.id,
        jobId: i.jobId,
        providerId: i.providerId,
        providerName: b?.provider.businessName ?? "Unknown provider",
        verificationStatus: b?.provider.verificationStatus ?? "not_verified",
        avgRating: ratings.avgRating,
        reviewCount: ratings.reviewCount,
        valueScore: ratings.valueScore,
        message: i.message,
        canMeetBudget: i.canMeetBudget,
        estimateMin: i.estimateMin,
        estimateMax: i.estimateMax,
        availability: i.availability,
        createdAt: i.createdAt.toISOString(),
        currencySymbol: loc.currencySymbol,
      };
    }),
  };
}
