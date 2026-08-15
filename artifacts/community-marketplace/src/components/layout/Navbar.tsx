import { ReactNode } from 'react';
import { Link } from 'wouter';
import { useLocationContext } from '@/context/LocationContext';
import { useGetMeta } from '@workspace/api-client-react';
import { MapPin, Search, PlusCircle, Heart, Briefcase, ChevronDown, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Navbar() {
  const { countryId, cityId, communityId, setCountryId, setCityId, setCommunityId } = useLocationContext();
  const { data: meta } = useGetMeta();

  const activeCountry = meta?.countries.find(c => c.id === countryId);
  const activeCity = activeCountry?.cities.find(c => c.id === cityId);
  const activeCommunity = activeCity?.communities.find(c => c.id === communityId);

  const locationDisplay = activeCommunity?.name || activeCity?.name || activeCountry?.name || 'Select Location';
  const flagEmoji = activeCountry?.flagEmoji || '🌍';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
            Neighbourly
          </span>
        </Link>

        <div className="flex-1 max-w-md flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-full border-dashed w-full justify-start text-muted-foreground hover:text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="truncate">{flagEmoji} {locationDisplay}</span>
                <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Where do you need a service?</h4>
                <div className="space-y-2">
                  <Select value={countryId?.toString() || ''} onValueChange={(val) => { setCountryId(Number(val)); setCityId(null); setCommunityId(null); }}>
                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent>
                      {meta?.countries.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.flagEmoji} {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select disabled={!countryId} value={cityId?.toString() || ''} onValueChange={(val) => { setCityId(Number(val)); setCommunityId(null); }}>
                    <SelectTrigger><SelectValue placeholder="Select City/Region" /></SelectTrigger>
                    <SelectContent>
                      {activeCountry?.cities.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select disabled={!cityId} value={communityId?.toString() || ''} onValueChange={(val) => setCommunityId(Number(val))}>
                    <SelectTrigger><SelectValue placeholder="Select Community" /></SelectTrigger>
                    <SelectContent>
                      {activeCity?.communities.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/providers">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
              <Search className="w-4 h-4 mr-2" />
              Find Provider
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs Board
            </Button>
          </Link>
          <Link href="/saved">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/jobs/new">
            <Button className="rounded-full shadow-sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Post a Job</span>
              <span className="sm:hidden">Post</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
