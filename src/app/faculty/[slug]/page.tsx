import * as React from 'react';
import { getFacultyBySlug, getAllSpecialties } from '@/lib/data';
import type { FacultyDetails, Specialty } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, TrendingUp, Lightbulb, Target, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { universities } from '@/lib/data/universities';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// This is the new Client Component that will render the UI
function FacultyDetailsClient({ faculty, relatedSpecialties }: { faculty: FacultyDetails; relatedSpecialties: Specialty[] }) {
    
  const getUniversityName = (id: number) => {
    const university = universities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum Universitet';
  };
  
  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) {
        return `${spec.cost} AZN`;
    }
    return '-';
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 sm:px-8 py-8">
      <Card>
        <CardHeader>
          <Link href="/" className="text-sm text-primary hover:underline flex items-center mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Bütün ixtisaslara qayıt
          </Link>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
             <GraduationCap className="h-8 w-8 text-primary" /> {faculty.name}
          </CardTitle>
          <CardDescription className="pt-2">
            {faculty.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary"/> Gələcəyi və Perspektivləri
            </h3>
            <p className="text-muted-foreground">{faculty.future}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary"/> İş İmkanları
            </h3>
            <p className="text-muted-foreground">{faculty.job_opportunities}</p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary"/> Mümkün Vəzifələr
            </h3>
            <div className="flex flex-wrap gap-2">
                {faculty.possible_positions.map((pos, index) => (
                    <Badge key={index} variant="secondary">{pos}</Badge>
                ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary"/> Tövsiyələr
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">{faculty.recommendations}</p>
          </section>

          {relatedSpecialties.length > 0 && (
            <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary"/> Bu İxtisası Təklif edən Universitetlər
                </h3>
                <div className="space-y-2">
                    {relatedSpecialties.map(spec => (
                        <div key={spec.id} className="p-3 border rounded-md">
                           <p className="font-medium">{getUniversityName(spec.universityId)}</p>
                           <div className="text-sm text-muted-foreground">
                                Keçid balı: <Badge variant="outline">{spec.score || '-'}</Badge> | 
                                Plan yeri: <Badge variant="outline">{spec.planCount || '-'}</Badge> | 
                                Təhsil haqqı: <Badge variant="outline">{renderCost(spec)}</Badge>
                           </div>
                        </div>
                    ))}
                </div>
            </section>
          )}
        </CardContent>
      </Card>
    </main>
  );
}


// This is the main page component, now a Server Component.
export default async function FacultyDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [facultyData, allSpecialties] = await Promise.all([
    getFacultyBySlug(slug),
    getAllSpecialties()
  ]);

  if (!facultyData) {
    notFound();
  }
  
  const relatedSpecialties = allSpecialties.filter(s => s.slug === slug);

  return <FacultyDetailsClient faculty={facultyData} relatedSpecialties={relatedSpecialties} />;
}

// generateStaticParams is required for static site generation
export async function generateStaticParams() {
  const specialties = await getAllSpecialties();
  // Use a Set to get unique slugs
  const uniqueSlugs = [...new Set(specialties.map(s => s.slug).filter(Boolean))];

  return uniqueSlugs.map((slug) => ({
    slug: slug,
  }));
}

// Add a loading component for better user experience
export function Loading() {
    return (
        <main className="container mx-auto max-w-4xl px-4 sm:px-8 py-8">
            <Card>
                <CardHeader>
                     <Skeleton className="h-5 w-48 mb-4" />
                     <Skeleton className="h-8 w-1/2" />
                     <Skeleton className="h-5 w-full mt-2" />
                     <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                     <div className="space-y-3">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-2/3" />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
