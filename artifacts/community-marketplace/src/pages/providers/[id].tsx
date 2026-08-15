import { useParams, Link } from 'wouter';
import { useGetProvider, useListProviderReviews, useCreateProviderReview, useAddFavorite, useRemoveFavorite } from '@workspace/api-client-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetProviderQueryKey, getListProviderReviewsQueryKey } from '@workspace/api-client-react';
import { Star, ShieldCheck, MapPin, BadgeCheck, Heart, MessageSquare, Clock, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ProviderProfile() {
  const params = useParams();
  const id = Number(params.id);
  const { data: provider, isLoading } = useGetProvider(id, { query: { enabled: !!id, queryKey: getGetProviderQueryKey(id) } });
  const { data: reviews } = useListProviderReviews(id, { query: { enabled: !!id, queryKey: getListProviderReviewsQueryKey(id) } });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();

  const toggleFavorite = () => {
    if (!provider) return;
    if (provider.isFavorite) {
      removeFav.mutate({ providerId: provider.id }, {
        onSuccess: () => {
          queryClient.setQueryData(getGetProviderQueryKey(id), (old: any) => old ? { ...old, isFavorite: false } : old);
          toast({ title: "Removed from saved" });
        }
      });
    } else {
      addFav.mutate({ data: { providerId: provider.id } }, {
        onSuccess: () => {
          queryClient.setQueryData(getGetProviderQueryKey(id), (old: any) => old ? { ...old, isFavorite: true } : old);
          toast({ title: "Saved to favorites" });
        }
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading provider...</div>;
  }

  if (!provider) {
    return <div className="p-8 text-center text-destructive">Provider not found</div>;
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      {/* HEADER */}
      <div className="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/providers" className="inline-flex items-center text-primary-foreground/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to search
          </Link>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white text-primary flex items-center justify-center text-4xl font-bold shadow-xl">
                {provider.businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">{provider.businessName}</h1>
                  {provider.verificationStatus === 'verified' && (
                    <Badge className="bg-emerald-400 text-emerald-950 border-none px-2 py-1">
                      <ShieldCheck className="w-4 h-4 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-primary-foreground/90 font-medium">{provider.tagline}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-primary-foreground/80 text-sm">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {provider.communityName}, {provider.cityName}</span>
                  <span className="flex items-center"><Star className="w-4 h-4 mr-1 fill-amber-400 text-amber-400" /> {provider.avgRating.toFixed(1)} ({provider.reviewCount} reviews)</span>
                  {provider.yearsActive && <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {provider.yearsActive} years active</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link href={`/jobs/new?communityId=${provider.communityId}`}>
                <Button size="lg" variant="secondary" className="rounded-full shadow-lg gap-2 flex-1 md:flex-none">
                  <MessageSquare className="w-5 h-5" /> Post a Job
                </Button>
              </Link>
              <Button size="lg" variant="outline" className={`rounded-full bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 ${provider.isFavorite ? 'text-rose-300' : 'text-primary-foreground'}`} onClick={toggleFavorite}>
                <Heart className={`w-5 h-5 ${provider.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 md:-mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COL: INFO */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-md border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-2xl">About</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-muted-foreground">
                <p>{provider.description}</p>
                
                <h4 className="font-display text-foreground mt-6 mb-2">Services offered</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.categories.map(cat => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>

                <h4 className="font-display text-foreground mt-6 mb-2">Service Areas</h4>
                <ul className="grid grid-cols-2 gap-2 list-disc list-inside m-0 p-0">
                  {provider.serviceAreas.map(area => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-2xl">Community Reviews</CardTitle>
                  <CardDescription>What your neighbours say</CardDescription>
                </div>
                <ReviewDialog providerId={id} />
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews?.length === 0 ? (
                  <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews?.map(review => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {review.reviewerName}
                            {review.verifiedJob && (
                              <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Job
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded text-sm font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {review.overall.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-2">{review.comment}</p>
                      {review.providerResponse && (
                        <div className="mt-4 bg-accent/50 p-4 rounded-xl text-sm border-l-2 border-primary">
                          <strong className="font-display block mb-1">Response from {provider.businessName}:</strong>
                          <span className="text-muted-foreground">{review.providerResponse}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COL: STATS */}
          <div className="space-y-6">
            <Card className="bg-secondary text-secondary-foreground border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl flex items-center gap-2">
                    <BadgeCheck className="text-primary w-6 h-6" /> Value Score
                  </h3>
                  <div className="text-3xl font-black text-primary">{provider.valueScore}</div>
                </div>
                <p className="text-sm text-secondary-foreground/80 mb-6">
                  {provider.valueScoreExplanation || "Based on community feedback, price fairness, and reliability."}
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-secondary-foreground/50">Rating Breakdown</h4>
                  <RatingBar label="Quality" value={provider.ratingBreakdown.quality} />
                  <RatingBar label="Price Fairness" value={provider.ratingBreakdown.price} />
                  <RatingBar label="Reliability" value={provider.ratingBreakdown.reliability} />
                  <RatingBar label="Professionalism" value={provider.ratingBreakdown.professionalism} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Jobs Completed</span>
                  <span className="font-bold">{provider.completedJobCount || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Price Indicator</span>
                  <span className="font-bold text-primary">{provider.priceIndicator || '$$'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Provider Type</span>
                  <span className="font-bold capitalize">{provider.providerType.replace('_', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingBar({ label, value }: { label: string, value: number }) {
  const percentage = (value / 5) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-secondary-foreground/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function ReviewDialog({ providerId }: { providerId: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState({ quality: 5, price: 5, reliability: 5, professionalism: 5, overall: 5 });
  
  const createReview = useCreateProviderReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !comment) {
      toast({ title: "Please fill out name and comment", variant: "destructive" });
      return;
    }
    createReview.mutate({ id: providerId, data: { reviewerName: name, comment, ...ratings } }, {
      onSuccess: () => {
        toast({ title: "Review submitted successfully!" });
        queryClient.invalidateQueries({ queryKey: getListProviderReviewsQueryKey(providerId) });
        queryClient.invalidateQueries({ queryKey: getGetProviderQueryKey(providerId) });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full"><Star className="w-4 h-4 mr-2" /> Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-4 pt-2">
            <Label className="font-bold">Ratings (1-5)</Label>
            {Object.entries(ratings).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span className="font-bold">{val}</span>
                </div>
                <Slider 
                  min={1} max={5} step={1} value={[val]} 
                  onValueChange={([v]) => setRatings(prev => ({...prev, [key]: v}))}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-2">
            <Label>Review</Label>
            <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="How was the service?" rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createReview.isPending} className="w-full sm:w-auto rounded-full">
            <Send className="w-4 h-4 mr-2" /> Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
