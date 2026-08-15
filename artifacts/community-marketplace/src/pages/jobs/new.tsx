import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGetMeta, useCreateJob, JobInputBudgetType, JobInputUrgency } from '@workspace/api-client-react';
import { useLocationContext } from '@/context/LocationContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Briefcase, DollarSign, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details"),
  categoryId: z.coerce.number().min(1, "Please select a category"),
  communityId: z.coerce.number().min(1, "Please select your location"),
  budgetType: z.enum(['fixed', 'range', 'open']),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  urgency: z.enum(['flexible', 'soon', 'urgent', 'emergency']),
  preferredDate: z.string().optional()
}).refine(data => {
  if (data.budgetType === 'fixed' && !data.budgetMin) return false;
  if (data.budgetType === 'range' && (!data.budgetMin || !data.budgetMax)) return false;
  return true;
}, {
  message: "Please provide valid budget amounts",
  path: ["budgetMin"]
});

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { data: meta } = useGetMeta();
  const { countryId, cityId, communityId, currencySymbol } = useLocationContext();
  const createJob = useCreateJob();
  const { toast } = useToast();

  const activeCountry = meta?.countries.find(c => c.id === countryId);
  const activeCity = activeCountry?.cities.find(c => c.id === cityId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: undefined,
      communityId: communityId || undefined,
      budgetType: "open",
      urgency: "flexible",
      preferredDate: ""
    }
  });

  const budgetType = form.watch("budgetType");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createJob.mutate({ data: values as any }, {
      onSuccess: (data) => {
        toast({ title: "Job posted successfully!" });
        setLocation(`/jobs/${data.id}`);
      },
      onError: () => {
        toast({ title: "Failed to post job", variant: "destructive" });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-black tracking-tight">Post a Job</h1>
        <p className="text-lg text-muted-foreground mt-2">Describe what you need, and local providers will reach out.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-md border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl"><Briefcase className="w-5 h-5 text-primary" /> The Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">What do you need done?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fix leaking kitchen sink" className="text-lg py-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select service category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {meta?.categories.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="communityId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select community" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeCity?.communities.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        )) || <SelectItem value="0" disabled>Select a city first in nav</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide details: what exactly is broken, dimensions, materials needed..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card className="shadow-md border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl"><DollarSign className="w-5 h-5 text-primary" /> Budget & Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <Alert className="bg-accent/50 text-accent-foreground border-primary/20">
                <Info className="w-4 h-4 text-primary" />
                <AlertDescription>
                  Budgets are indicative. Providers will understand the scope and may quote differently.
                </AlertDescription>
              </Alert>

              <FormField control={form.control} name="budgetType" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Budget Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                      <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-xl flex-1 cursor-pointer hover-elevate">
                        <FormControl><RadioGroupItem value="open" /></FormControl>
                        <FormLabel className="font-normal cursor-pointer w-full">Open to quotes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-xl flex-1 cursor-pointer hover-elevate">
                        <FormControl><RadioGroupItem value="fixed" /></FormControl>
                        <FormLabel className="font-normal cursor-pointer w-full">Fixed budget</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-xl flex-1 cursor-pointer hover-elevate">
                        <FormControl><RadioGroupItem value="range" /></FormControl>
                        <FormLabel className="font-normal cursor-pointer w-full">Budget range</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {budgetType !== 'open' && (
                <div className="flex gap-4 items-center">
                  <FormField control={form.control} name="budgetMin" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{budgetType === 'fixed' ? 'Amount' : 'Minimum'}</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-muted-foreground">{currencySymbol}</span>
                        <FormControl><Input type="number" className="pl-8" {...field} /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {budgetType === 'range' && (
                    <>
                      <span className="mt-8">-</span>
                      <FormField control={form.control} name="budgetMax" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Maximum</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-muted-foreground">{currencySymbol}</span>
                            <FormControl><Input type="number" className="pl-8" {...field} /></FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                <FormField control={form.control} name="urgency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="soon">Within a week</SelectItem>
                        <SelectItem value="urgent">As soon as possible</SelectItem>
                        <SelectItem value="emergency">Emergency (Today!)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="preferredDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => window.history.back()} className="rounded-full">Cancel</Button>
            <Button type="submit" size="lg" className="rounded-full px-8 text-lg" disabled={createJob.isPending}>
              {createJob.isPending ? "Posting..." : "Post Job to Community"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
