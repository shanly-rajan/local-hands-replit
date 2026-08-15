import { CategoryIcon } from "@/components/CategoryIcon";
import { useLocationContext } from '@/context/LocationContext';
import { useGetHomeSummary } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Search, PlusCircle, Star, ShieldCheck, MapPin, Briefcase, BadgeCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { countryId, cityId, communityId, currencySymbol } = useLocationContext();
  const { data: summary, isLoading, isError } = useGetHomeSummary({
    countryId: countryId ?? undefined,
    cityId: cityId ?? undefined,
    communityId: communityId ?? undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl px-4">
          <div className="h-64 bg-muted rounded-3xl w-full"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl w-full"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return <div className="text-center py-20 text-destructive">Error loading marketplace data.</div>;
  }

  return (
    <div className="pb-20">
      {/* HERO */}
      <section className="bg-gradient-to-b from-accent/50 to-background pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="secondary" className="px-4 py-1 text-sm bg-background border-primary/20 text-primary mb-4 rounded-full">
            <MapPin className="w-4 h-4 mr-2" />
            Connecting local communities
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-black text-foreground tracking-tight text-balance">
            Trusted local services. <br/>
            <span className="text-primary">Recommended by your community.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Find verified professionals your neighbours vouch for, or post what you need done and let interested providers come to you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/providers">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-lg hover-elevate">
                <Search className="w-5 h-5 mr-2" />
                Find a Service
              </Button>
            </Link>
            <Link href="/jobs/new">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-2 hover:border-primary hover:text-primary transition-colors bg-background">
                <PlusCircle className="w-5 h-5 mr-2" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-24 mt-12">
        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-24">
          <Card className="bg-background/80 backdrop-blur border-border/50 shadow-sm text-center py-6">
            <div className="text-3xl font-black font-display text-primary">{summary.stats.providerCount}</div>
            <div className="text-sm text-muted-foreground font-medium mt-1">Local Providers</div>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-border/50 shadow-sm text-center py-6">
            <div className="text-3xl font-black font-display text-secondary">{summary.stats.verifiedProviderCount}</div>
            <div className="text-sm text-muted-foreground font-medium mt-1">Verified</div>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-border/50 shadow-sm text-center py-6">
            <div className="text-3xl font-black font-display text-primary">{summary.stats.openJobCount}</div>
            <div className="text-sm text-muted-foreground font-medium mt-1">Open Jobs</div>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-border/50 shadow-sm text-center py-6">
            <div className="text-3xl font-black font-display text-secondary">{summary.stats.reviewCount}</div>
            <div className="text-sm text-muted-foreground font-medium mt-1">Community Reviews</div>
          </Card>
        </section>

        {/* POPULAR CATEGORIES */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-display">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {summary.popularCategories.map((cat, i) => (
              <Link key={cat.id} href={`/providers?categoryId=${cat.id}`}>
                <Card className="text-center hover:border-primary/50 transition-colors cursor-pointer hover-elevate h-full group bg-accent/20 border-accent">
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <CategoryIcon name={cat.icon} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.providerCount} providers</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* TOP PROVIDERS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-display">Top-Rated Providers</h2>
              <p className="text-muted-foreground mt-1">Highest community ratings in your area</p>
            </div>
            <Link href="/providers?sort=rating" className="text-primary font-medium hover:underline hidden sm:block">View all</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {summary.topProviders.slice(0, 3).map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </section>

        {/* RECENT JOBS */}
        <section className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12 -mx-4 md:mx-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-display flex items-center gap-3">
                <Zap className="text-primary" /> Community Jobs
              </h2>
              <p className="text-secondary-foreground/70 mt-2">Help your neighbours. Recent requests in the area.</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="rounded-full bg-transparent border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                Browse Jobs
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {summary.recentJobs.slice(0, 4).map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 hover:bg-secondary-foreground/10 transition-colors cursor-pointer shadow-none">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <div className="p-3 bg-secondary rounded-xl"><CategoryIcon name={job.categoryIcon} className="w-7 h-7 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold truncate text-lg text-secondary-foreground">{job.title}</h3>
                        <Badge variant="outline" className="ml-2 whitespace-nowrap bg-primary/20 text-primary-foreground border-transparent">
                          {job.budgetType === 'fixed' ? `${job.currencySymbol}${job.budgetMin}` : job.budgetType === 'range' ? `${job.currencySymbol}${job.budgetMin} - ${job.currencySymbol}${job.budgetMax}` : 'Open Budget'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-secondary-foreground/60 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.communityName}</span>
                        <span>•</span>
                        <span className="capitalize">{job.urgency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-secondary-foreground/10 text-secondary-foreground/80 border-none font-normal">
                          {job.interestCount} interested
                        </Badge>
                        <span className="text-xs text-secondary-foreground/50">{new Date(job.postedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* BEST VALUE */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-display">Best Value Providers</h2>
              <p className="text-muted-foreground mt-1">Excellent service at fair prices, based on Community Value Scores</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {summary.bestValueProviders.slice(0, 3).map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </section>

        {/* ADS */}
        {summary.ads.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Community Sponsors</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {summary.ads.map(ad => {
                const inner = (
                  <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-muted group">
                    <img src={ad.imageUrl} alt={ad.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <Badge className="absolute top-4 right-4 bg-black/50 hover:bg-black/50 text-white backdrop-blur border-none">Sponsored</Badge>
                      <h4 className="font-bold text-xl">{ad.title}</h4>
                      <p className="text-white/80 text-sm mt-1">{ad.businessName} • {ad.targetArea}</p>
                    </div>
                  </div>
                );
                return ad.linkUrl
                  ? <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer" className="block">{inner}</a>
                  : <Link key={ad.id} href="/ads" className="block">{inner}</Link>;
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Separate component for Provider Card
function ProviderCard({ provider }: { provider: any }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <Card className="h-full hover-elevate cursor-pointer transition-colors border-border/50 hover:border-primary/30 flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4 gap-2">
            <div>
              <h3 className="font-bold font-display text-lg line-clamp-1">{provider.businessName}</h3>
              <p className="text-sm text-muted-foreground">{provider.tagline || provider.categories.join(', ')}</p>
            </div>
            {provider.verificationStatus === 'verified' && (
              <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 gap-1 whitespace-nowrap">
                <ShieldCheck className="w-3 h-3" /> <span className="hidden xs:inline">Verified</span>
              </Badge>
            )}
          </div>
          
          <div className="mt-auto space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold">{provider.avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded text-xs font-semibold">
                <BadgeCheck className="w-3 h-3 text-primary" />
                Value: {provider.valueScore}/100
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{provider.communityName}, {provider.cityName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
