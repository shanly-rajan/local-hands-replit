import { CategoryIcon } from "@/components/CategoryIcon";
import { useParams, Link } from 'wouter';
import { useGetJob, useUpdateJobStatus, useCreateJobInterest, useSelectJobProvider, useListProviders, getGetJobQueryKey } from '@workspace/api-client-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocationContext } from '@/context/LocationContext';
import { MapPin, Briefcase, DollarSign, Calendar, Clock, ArrowLeft, ShieldCheck, CheckCircle2, User, Star, BadgeCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function JobDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { communityId } = useLocationContext();
  const { data: job, isLoading } = useGetJob(id, { query: { enabled: !!id, queryKey: getGetJobQueryKey(id) } });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateStatus = useUpdateJobStatus();
  const selectProvider = useSelectJobProvider();

  if (isLoading) return <div className="p-8 text-center">Loading job...</div>;
  if (!job) return <div className="p-8 text-center text-destructive">Job not found</div>;

  const handleStatusUpdate = (newStatus: any) => {
    updateStatus.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        toast({ title: `Job marked as ${newStatus.replace('_', ' ')}` });
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(id) });
      }
    });
  };

  const handleSelectWinner = (interestId: number) => {
    selectProvider.mutate({ id, data: { interestId } }, {
      onSuccess: () => {
        toast({ title: "Provider selected!" });
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(id) });
      }
    });
  };

  const isClosed = ['completed', 'cancelled', 'reviewed', 'disputed'].includes(job.status);
  const hasWinner = job.status !== 'open' && job.status !== 'draft';

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link href="/jobs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to jobs
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COL: JOB DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border-border/50 overflow-hidden">
              <div className="bg-secondary/10 px-6 py-4 flex justify-between items-center border-b">
                <Badge variant="outline" className={`font-bold text-sm ${
                    job.status === 'open' ? 'border-primary text-primary bg-primary/10' : 
                    job.status === 'completed' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 
                    'border-muted-foreground text-muted-foreground bg-muted'
                  }`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground">Posted {new Date(job.postedAt).toLocaleDateString()}</div>
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="flex gap-4 items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                    <CategoryIcon name={job.categoryIcon} className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-display font-black tracking-tight mb-2">{job.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center text-foreground bg-accent px-2 py-1 rounded">
                        <MapPin className="w-4 h-4 mr-1 text-primary" /> {job.communityName}, {job.cityName}
                      </span>
                      <span className="flex items-center text-foreground bg-accent px-2 py-1 rounded">
                        <DollarSign className="w-4 h-4 mr-1 text-primary" />
                        {job.budgetType === 'fixed' ? `${job.currencySymbol}${job.budgetMin}` : 
                         job.budgetType === 'range' ? `${job.currencySymbol}${job.budgetMin} - ${job.currencySymbol}${job.budgetMax}` : 
                         'Open to quotes'}
                      </span>
                      <span className="flex items-center text-foreground bg-accent px-2 py-1 rounded capitalize">
                        <Clock className="w-4 h-4 mr-1 text-primary" /> {job.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none text-foreground mt-8">
                  <h3 className="font-display">Description</h3>
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
                
                {job.preferredDate && (
                  <div className="mt-6 flex items-center gap-2 text-muted-foreground bg-muted/50 p-4 rounded-xl border border-dashed">
                    <Calendar className="w-5 h-5 text-primary" />
                    <strong>Preferred Date:</strong> {job.preferredDate}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CUSTOMER CONTROLS (Demo purposes) */}
            <Card className="shadow-md border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-primary">
                  <User className="w-5 h-5" /> Customer Controls
                </CardTitle>
                <CardDescription>Simulate the customer managing their job</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {job.status === 'provider_selected' && (
                  <Button onClick={() => handleStatusUpdate('in_progress')} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Mark "In Progress"
                  </Button>
                )}
                {job.status === 'in_progress' && (
                  <Button onClick={() => handleStatusUpdate('completed')} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark "Completed"
                  </Button>
                )}
                {!isClosed && (
                  <Button onClick={() => handleStatusUpdate('cancelled')} variant="destructive" className="rounded-full">
                    Cancel Job
                  </Button>
                )}
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COL: INTERESTS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Interested Providers</h2>
              <Badge variant="secondary" className="text-sm">{job.interestCount}</Badge>
            </div>

            {job.status === 'open' && (
              <ProviderInterestDialog jobId={id} communityId={communityId || undefined} />
            )}

            <div className="space-y-4">
              {job.interests.length === 0 ? (
                <Card className="border-dashed bg-transparent shadow-none">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p>No providers have expressed interest yet.</p>
                  </CardContent>
                </Card>
              ) : (
                job.interests.map(interest => (
                  <Card key={interest.id} className={`overflow-hidden transition-all ${job.selectedInterestId === interest.id ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border/50 hover:border-primary/30'}`}>
                    {job.selectedInterestId === interest.id && (
                      <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> HIRED PROVIDER
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/providers/${interest.providerId}`} className="font-bold font-display hover:text-primary transition-colors line-clamp-1">
                          {interest.providerName}
                        </Link>
                        {interest.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs mb-4">
                        <span className="flex items-center text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-current mr-0.5" /> {interest.avgRating.toFixed(1)} <span className="font-normal text-amber-700 ml-1">({interest.reviewCount})</span>
                        </span>
                        <span className="flex items-center text-primary font-bold">
                          <BadgeCheck className="w-3 h-3 mr-0.5" /> Val: {interest.valueScore}
                        </span>
                      </div>

                      <Accordion type="single" collapsible className="mb-4">
                        <AccordionItem value="message" className="border-none">
                          <AccordionTrigger className="bg-muted/50 px-3 py-2 rounded-lg text-sm hover:bg-muted hover:no-underline">
                            <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground" /> View message</span>
                          </AccordionTrigger>
                          <AccordionContent className="p-3 text-sm text-muted-foreground bg-muted/20 border-x border-b rounded-b-lg -mt-1 border-t-0">
                            {interest.message}
                            
                            {interest.availability && (
                              <div className="mt-3 pt-3 border-t">
                                <strong className="text-foreground">Availability:</strong> {interest.availability}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="bg-background border rounded-lg p-3 text-sm mb-4">
                        {interest.canMeetBudget ? (
                          <div className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Can meet budget
                          </div>
                        ) : (
                          <div>
                            <span className="text-muted-foreground block mb-1">Alternative Estimate:</span>
                            <span className="font-bold">
                              {interest.estimateMax ? 
                                `${interest.currencySymbol}${interest.estimateMin} - ${interest.currencySymbol}${interest.estimateMax}` : 
                                `${interest.currencySymbol}${interest.estimateMin}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {job.status === 'open' && (
                        <Button 
                          onClick={() => handleSelectWinner(interest.id)} 
                          className="w-full rounded-full"
                          variant="default"
                        >
                          Hire Provider
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderInterestDialog({ jobId, communityId }: { jobId: number, communityId?: number }) {
  const [open, setOpen] = useState(false);
  const [providerId, setProviderId] = useState<number | undefined>();
  const [message, setMessage] = useState('');
  const [canMeetBudget, setCanMeetBudget] = useState(true);
  const [estimateMin, setEstimateMin] = useState('');
  const [estimateMax, setEstimateMax] = useState('');
  const [availability, setAvailability] = useState('');

  // Fetch local providers to simulate a provider logging in to express interest
  const { data: providers } = useListProviders({ communityId });
  const createInterest = useCreateJobInterest();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!providerId || !message) {
      toast({ title: "Select provider and write message", variant: "destructive" });
      return;
    }
    createInterest.mutate({
      id: jobId,
      data: {
        providerId,
        message,
        canMeetBudget,
        estimateMin: estimateMin ? Number(estimateMin) : undefined,
        estimateMax: estimateMax ? Number(estimateMax) : undefined,
        availability
      }
    }, {
      onSuccess: () => {
        toast({ title: "Interest submitted successfully!" });
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(jobId) });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-6 border-dashed border-2 rounded-xl h-14 bg-background hover:bg-accent/50 text-foreground hover:text-primary" variant="outline">
          <Briefcase className="w-5 h-5 mr-2" /> Respond as Provider (Demo)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Express Interest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Simulate Provider</Label>
            <Select value={providerId?.toString()} onValueChange={(val) => setProviderId(Number(val))}>
              <SelectTrigger><SelectValue placeholder="Select a local provider" /></SelectTrigger>
              <SelectContent>
                {providers?.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.businessName} ({p.avgRating.toFixed(1)}★)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Message to customer</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Hi! I can help with this. I've done similar work..." rows={3} />
          </div>

          <div className="flex items-center space-x-2 pt-2 pb-2">
            <Switch id="budget" checked={canMeetBudget} onCheckedChange={setCanMeetBudget} />
            <Label htmlFor="budget" className="cursor-pointer">I can meet the proposed budget</Label>
          </div>

          {!canMeetBudget && (
            <div className="flex gap-4 p-4 bg-muted rounded-xl">
              <div className="space-y-2 flex-1">
                <Label>Min Estimate</Label>
                <Input type="number" value={estimateMin} onChange={e => setEstimateMin(e.target.value)} />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Max Estimate</Label>
                <Input type="number" value={estimateMax} onChange={e => setEstimateMax(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Availability</Label>
            <Input value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Can start tomorrow morning" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createInterest.isPending} className="w-full sm:w-auto rounded-full">
            Submit Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
