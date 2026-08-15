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
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse"></div>)}
        </div>
      ) : ads?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No sponsored advertisements available for this region.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ads?.map(ad => (
            <div key={ad.id} className="group relative rounded-3xl overflow-hidden shadow-lg border hover:border-primary transition-colors bg-card hover-elevate flex flex-col">
              <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                />
                <Badge className="absolute top-4 right-4 bg-black/50 text-white backdrop-blur border-white/20">Sponsored</Badge>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold font-display line-clamp-2">{ad.title}</h2>
                </div>
                <div className="font-medium text-primary mb-3">{ad.businessName}</div>
                <p className="text-muted-foreground mb-6 line-clamp-3">{ad.description}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground font-medium">
                    <MapPin className="w-4 h-4 mr-1" /> {ad.targetArea}
                  </div>
                  {ad.linkUrl && (
                    <a href={ad.linkUrl} target="_blank" rel="noreferrer">
                      <Button variant="secondary" size="sm" className="rounded-full">
                        Visit <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
