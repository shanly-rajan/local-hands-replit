import { useListAds, useGetMeta } from '@workspace/api-client-react';
import { useLocationContext } from '@/context/LocationContext';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdsPage() {
  const { countryId } = useLocationContext();
  const { data: meta } = useGetMeta();
  const { data: ads, isLoading } = useListAds({ countryId: countryId || undefined });

  const activeCountry = meta?.countries.find(c => c.id === countryId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12 mt-8">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 text-secondary rounded-full mb-4">
          <Megaphone className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">Community Sponsors</h1>
        <p className="text-xl text-muted-foreground">
          Discover local businesses supporting the {activeCountry?.name || 'community'} marketplace.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[1,2,3,4].map(i => <div key={i} className="h-72 bg-muted rounded-3xl animate-pulse"></div>)}
        </div>
      ) : ads?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No sponsored advertisements available for this region.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {ads?.map(ad => {
            const card = (
              <div key={ad.id} className="group relative rounded-3xl overflow-hidden shadow-lg hover-elevate cursor-pointer aspect-[4/3]">
                {/* Background image */}
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <Badge className="bg-black/50 text-white backdrop-blur border-white/20 text-xs">
                      Sponsored
                    </Badge>
                  </div>
                  <div className="text-white">
                    <p className="text-white/70 text-sm font-medium mb-1">{ad.businessName}</p>
                    <h2 className="font-display font-black text-2xl md:text-3xl leading-tight mb-2">
                      {ad.title}
                    </h2>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center text-white/60 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" /> {ad.targetArea}
                      </div>
                      {ad.linkUrl && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur rounded-full px-4 py-1.5 transition-colors">
                          Visit <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            return ad.linkUrl
              ? <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer">{card}</a>
              : <div key={ad.id}>{card}</div>;
          })}
        </div>
      )}
    </div>
  );
}
