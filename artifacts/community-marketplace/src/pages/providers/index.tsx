import { useListProviders, useGetMeta, ListProvidersSort } from '@workspace/api-client-react';
import { useLocationContext } from '@/context/LocationContext';
import { useState } from 'react';
import { Link, useSearch } from 'wouter';
import { Search, Star, ShieldCheck, MapPin, BadgeCheck, Filter, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ProvidersList() {
  const { countryId, cityId, communityId } = useLocationContext();
  const { data: meta } = useGetMeta();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(
    params.get('categoryId') ? Number(params.get('categoryId')) : undefined
  );
  const [verifiedOnly, setVerifiedOnly] = useState(params.get('verifiedOnly') === 'true');
  const [sort, setSort] = useState<ListProvidersSort>(
    (params.get('sort') as ListProvidersSort) || 'value'
  );

  const { data: providers, isLoading } = useListProviders({
    countryId: countryId || undefined,
    cityId: cityId || undefined,
    communityId: communityId || undefined,
    search: search || undefined,
    categoryId,
    verifiedOnly,
    sort
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">Find a Provider</h1>
          <p className="text-muted-foreground mt-1 text-lg">Trusted locals ready to help.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 font-bold font-display text-lg mb-4">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </div>
              
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Plumber, electrician..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId?.toString() || 'all'} onValueChange={(val) => setCategoryId(val === 'all' ? undefined : Number(val))}>
                  <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Categories</SelectItem>
                    {meta?.categories.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sort} onValueChange={(val) => setSort(val as ListProvidersSort)}>
                  <SelectTrigger className="flex items-center"><ArrowDownUp className="w-4 h-4 mr-2" /> <SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="value">Best Value</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                <Label htmlFor="verified" className="flex items-center gap-1 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified only
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIST */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : providers?.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold font-display">No providers found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search area.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); setCategoryId(undefined); setVerifiedOnly(false); }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {providers?.map(provider => (
                <Link key={provider.id} href={`/providers/${provider.id}`}>
                  <Card className="hover-elevate cursor-pointer transition-colors border-border hover:border-primary/30 group">
                    <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold shrink-0">
                        {provider.businessName.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold font-display truncate group-hover:text-primary transition-colors">
                            {provider.businessName}
                          </h2>
                          {provider.verificationStatus === 'verified' && (
                            <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 gap-1 px-1.5 py-0">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{provider.tagline || provider.categories.join(', ')}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {provider.avgRating.toFixed(1)} <span className="text-amber-700/60 font-normal">({provider.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {provider.communityName}, {provider.cityName}
                          </div>
                          <div className="flex items-center gap-1 text-primary font-medium">
                            <BadgeCheck className="w-4 h-4" /> Value Score: {provider.valueScore}/100
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto rounded-full">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
