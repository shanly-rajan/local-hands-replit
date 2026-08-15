import { CategoryIcon } from "@/components/CategoryIcon";
import { useListJobs, useGetMeta } from '@workspace/api-client-react';
import { useLocationContext } from '@/context/LocationContext';
import { useState } from 'react';
import { Link } from 'wouter';
import { Search, MapPin, Briefcase, PlusCircle, Filter, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function JobsList() {
  const { countryId, cityId, currencySymbol } = useLocationContext();
  const { data: meta } = useGetMeta();
  
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [status, setStatus] = useState<string>('open');

  const { data: jobs, isLoading } = useListJobs({
    countryId: countryId || undefined,
    cityId: cityId || undefined,
    search: search || undefined,
    categoryId,
    status: status === 'all' ? undefined : status
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">Community Jobs</h1>
          <p className="text-muted-foreground mt-1 text-lg">Help your neighbours or find help.</p>
        </div>
        <Link href="/jobs/new">
          <Button size="lg" className="rounded-full shadow-md">
            <PlusCircle className="w-5 h-5 mr-2" /> Post a Job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24 border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 font-bold font-display text-lg mb-4">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </div>
              
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Leaking tap, painting..." 
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
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {meta?.categories.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open (Seeking Providers)</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIST */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse"></div>)}
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold font-display">No jobs found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or post a new job.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs?.map(job => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="hover-elevate cursor-pointer transition-colors border-border/50 hover:border-primary/40 group">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <CategoryIcon name={job.categoryIcon} className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h2 className="text-xl font-bold font-display truncate pr-4 text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </h2>
                          <Badge variant="outline" className={`whitespace-nowrap font-bold text-sm ${
                            job.status === 'open' ? 'border-primary/50 text-primary bg-primary/5' : 
                            job.status === 'completed' ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50' : 
                            'border-muted-foreground/30 text-muted-foreground bg-muted/50'
                          }`}>
                            {job.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                          <div className="flex items-center gap-1 font-medium bg-background border px-2 py-0.5 rounded text-foreground">
                            {job.budgetType === 'fixed' ? `${job.currencySymbol}${job.budgetMin}` : 
                             job.budgetType === 'range' ? `${job.currencySymbol}${job.budgetMin} - ${job.currencySymbol}${job.budgetMax}` : 
                             'Open Budget'}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" /> {job.communityName}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground capitalize">
                            <Clock className="w-4 h-4" /> {job.urgency}
                          </div>
                          {job.status === 'open' && (
                            <div className="flex items-center gap-1 text-secondary font-medium">
                              <Users className="w-4 h-4" /> {job.interestCount} interested
                            </div>
                          )}
                        </div>
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
