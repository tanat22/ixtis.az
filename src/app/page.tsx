'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, University, BookOpen } from 'lucide-react';
import { recommendSpecialty } from '@/ai/flows/recommend-specialty-flow';
import type { SpecialtyRecommendation } from '@/ai/flows/recommend-specialty-flow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  group1: z.coerce.number().min(0).max(700).optional(),
  group2: z.coerce.number().min(0).max(700).optional(),
  group3: z.coerce.number().min(0).max(700).optional(),
  group4: z.coerce.number().min(0).max(700).optional(),
  group5: z.coerce.number().min(0).max(700).optional(),
  interests: z.string().min(10, {
    message: 'Maraqlarınız haqqında ən az 10 hərf yazın.',
  }),
});

export default function AdmissionsHelperPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<SpecialtyRecommendation[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);

    const scores = [
        { group: 'I Qrup (Texniki və Təbiət)', score: values.group1 },
        { group: 'II Qrup (İqtisadiyyat)', score: values.group2 },
        { group: 'III Qrup (Humanitar)', score: values.group3 },
        { group: 'IV Qrup (Tibb və Biologiya)', score: values.group4 },
        { group: 'V Qrup (İdman və İncəsənət)', score: values.group5 },
    ].filter(s => s.score !== undefined && s.score > 0);

    if (scores.length === 0) {
        toast({
            variant: "destructive",
            title: "Xəta",
            description: "Zəhmət olmasa ən az bir qrup üzrə balınızı daxil edin.",
        });
        setIsLoading(false);
        return;
    }


    try {
      const response = await recommendSpecialty({
        examScores: scores as { group: string; score: number; }[],
        studentInterests: values.interests,
      });
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Xəta Baş Verdi',
        description:
          'Tövsiyələr alınarkən bir problem yarandı. Zəhmət olmasa bir az sonra yenidən cəhd edin.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Təhsil Bələdçisi
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Ballarınıza və maraqlarınıza uyğun ixtisasları kəşf edin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-medium text-center">İmtahan Nəticələriniz (DİM)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField control={form.control} name="group1" render={({ field }) => (<FormItem><FormLabel>I Qrup</FormLabel><FormControl><Input type="number" placeholder="0-700" {...field} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="group2" render={({ field }) => (<FormItem><FormLabel>II Qrup</FormLabel><FormControl><Input type="number" placeholder="0-700" {...field} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="group3" render={({ field }) => (<FormItem><FormLabel>III Qrup</FormLabel><FormControl><Input type="number" placeholder="0-700" {...field} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="group4" render={({ field }) => (<FormItem><FormLabel>IV Qrup</FormLabel><FormControl><Input type="number" placeholder="0-700" {...field} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="group5" render={({ field }) => (<FormItem><FormLabel>V Qrup</FormLabel><FormControl><Input type="number" placeholder="0-700" {...field} /></FormControl></FormItem>)} />
                </div>
              </div>

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maraqlarınız və Bacarıqlarınız</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hansı fənləri sevirsiniz? Gələcəkdə hansı sahədə işləmək istərdiniz? Kompüterlə işləməyi xoşlayırsınız, yoxsa insanlarla ünsiyyəti?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bu məlumatlar sizə daha uyğun tövsiyələr verməyimizə kömək edəcək.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analiz edilir...
                  </>
                ) : (
                    <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tövsiyə al
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {recommendations && (
             <CardFooter className="flex-col items-start gap-4">
                <Separator />
                <h3 className="text-2xl font-semibold w-full text-center mt-4">Sizin üçün Tövsiyələr</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {recommendations.map((rec, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <Badge variant="secondary" className="w-fit mb-2">{rec.score_range}</Badge>
                                <CardTitle className="flex items-center gap-2">
                                   <BookOpen className="h-5 w-5 text-primary"/>
                                   {rec.specialty_name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <University className="h-4 w-4"/>
                                    {rec.university_name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{rec.justification}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
