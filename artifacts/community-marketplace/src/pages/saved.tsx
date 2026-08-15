import { useListFavorites } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Heart, Star, MapPin, BadgeCheck, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SavedProviders() {
  const { data: favorites, isLoading } = useListFavorites();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Saved Providers
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your trusted shortlist of local experts.</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse"></div>)}
        </div>
      ) : favorites?.length === 0 ? (
        <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-2xl font-bold font-display">No saved providers yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            When you find a provider you like, click the heart icon on their profile to save them here for easy access later.
          </p>
          <Link href="/providers">
            <Button className="mt-8 rounded-full" size="lg">Browse Providers</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites?.map(provider => (
            <Link key={provider.id} href={`/providers/${provider.id}`}>
              <Card className="hover-elevate cursor-pointer transition-colors border-border hover:border-rose-300 group h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-bold shrink-0">
                        {provider.businessName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-display line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {provider.businessName}
                        </h2>
                        <p className="text-sm text-muted-foreground">{provider.tagline || provider.categories.join(', ')}</p>
                      </div>
                    </div>
                    {provider.verificationStatus === 'verified' && (
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-none px-1.5 py-0">
                        <ShieldCheck className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 text-sm font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {provider.avgRating.toFixed(1)} <span className="font-normal text-amber-700/70">({provider.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">
                        <BadgeCheck className="w-3.5 h-3.5" /> Val: {provider.valueScore}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{provider.communityName}, {provider.cityName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
