import * as React from 'react';
import { getFacultyBySlug, getAllSpecialties } from '@/lib/data';
import type { FacultyDetails, Specialty } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, TrendingUp, BookOpen, GraduationCap, Building, BarChart, FileText, Wallet, Info, Code } from 'lucide-react';
import Link from 'next/link';
import { universities } from '@/lib/data/universities';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import * as fs from 'fs/promises';
import * as path from 'path';

const SKILLS_KEYWORDS = ['R', 'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'SPSS', 'Stata', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Git'];

function extractSkills(text: string | undefined): string[] {
    if (!text) return [];
    const lowerText = text.toLowerCase();
    const foundSkills = new Set<string>();
    SKILLS_KEYWORDS.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.add(skill);
        }
    });
    return Array.from(foundSkills);
}

function FacultyDetailsClient({ faculty, relatedSpecialties }: { faculty: FacultyDetails; relatedSpecialties: Specialty[] }) {
    
  const skills = React.useMemo(() => extractSkills(faculty.recommendations), [faculty.recommendations]);

  const getUniversityName = (id: number) => {
    const university = universities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum Universitet';
  };
  
  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) {
        return `${spec.cost} AZN`;
    }
    return spec.cost || '-';
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bütün ixtisaslara qayıt
            </Link>
            
            <div className="space-y-10">
                 <Card className="overflow-hidden">
                    <CardHeader className="bg-gray-100 dark:bg-gray-900/50 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                             <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg mb-4 sm:mb-0">
                                <GraduationCap className="h-10 w-10" />
                            </div>
                            <div className="flex-grow">
                                <CardTitle className="text-2xl sm:text-3xl font-bold">
                                    {faculty.name || 'İxtisas Adı Yüklənir...'}
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                 </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                   <div className="md:col-span-2 space-y-8">
                        {faculty.description && <Card>
                            <CardHeader><CardTitle className="flex items-center gap-3 text-xl"><Info className="h-6 w-6 text-primary"/>Haqqında</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground text-base">{faculty.description}</p></CardContent>
                        </Card>}
                        
                         {(faculty.job_opportunities || (faculty.possible_positions && faculty.possible_positions.length > 0)) && <Card>
                            <CardHeader><CardTitle className="flex items-center gap-3 text-xl"><Briefcase className="h-6 w-6 text-primary"/>İş Dünyası</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                {faculty.job_opportunities && <div>
                                    <h4 className="font-semibold mb-2">İş İmkanları</h4>
                                    <p className="text-muted-foreground">{faculty.job_opportunities}</p>
                                </div>}
                                 {faculty.possible_positions && faculty.possible_positions.length > 0 && <div>
                                    <h4 className="font-semibold mb-2">Mümkün Vəzifələr</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {faculty.possible_positions.map((pos, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm font-medium">{pos}</Badge>
                                        ))}
                                    </div>
                                </div>}
                            </CardContent>
                        </Card>}

                        {(faculty.future || skills.length > 0) && <Card>
                            <CardHeader><CardTitle className="flex items-center gap-3 text-xl"><TrendingUp className="h-6 w-6 text-primary"/>Gələcək və Bacarıqlar</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                {faculty.future && <div>
                                    <h4 className="font-semibold mb-2">Gələcək Perspektivləri</h4>
                                    <p className="text-muted-foreground">{faculty.future}</p>
                                </div>}
                                {skills.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Code className="h-5 w-5"/>Tövsiyə Olunan Texnologiyalar</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, index) => (
                                                <Badge key={index} variant="default">{skill}</Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3">* Bu bacarıqlar ixtisasın tövsiyə bölməsindən avtomatik olaraq çıxarılmışdır.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>}
                   </div>

                    <div className="md:col-span-1 space-y-8">
                         {relatedSpecialties && relatedSpecialties.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl"><BookOpen className="h-6 w-6 text-primary"/>Universitetlər</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {relatedSpecialties.map(spec => (
                                        <div key={spec.id} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-900/50">
                                            <p className="font-semibold flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground"/>{getUniversityName(spec.universityId)}</p>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <BarChart className="h-4 w-4 text-muted-foreground"/>
                                                    <span><span className="font-medium">Bal:</span> {spec.score || '-'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                     <FileText className="h-4 w-4 text-muted-foreground"/>
                                                    <span><span className="font-medium">Plan:</span> {spec.planCount || '-'}</span>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-1.5">
                                                    <Wallet className="h-4 w-4 text-muted-foreground"/>
                                                    <span><span className="font-medium">Ödəniş:</span> {renderCost(spec)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}


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


export async function generateStaticParams() {
  try {
    const facultiesDir = path.join(process.cwd(), 'elmir', 'faculties');
    const files = await fs.readdir(facultiesDir);

    const slugs = files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        slug: file.replace('.json', ''),
      }));

    return slugs;
  } catch (error) {
    console.error("Error generating static params for faculties:", error);
    return [];
  }
}


export function Loading() {
    return (
       <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
                 <Skeleton className="h-5 w-48 mb-6" />
                <div className="space-y-10">
                    <Card><CardHeader className="p-6"><div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                        <Skeleton className="h-16 w-16 rounded-lg"/>
                        <div className="flex-grow space-y-2 pt-2">
                           <Skeleton className="h-8 w-3/4" />
                        </div>
                    </div></CardHeader></Card>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-8">
                             <Card><CardHeader><Skeleton className="h-7 w-1/2"/></CardHeader><CardContent><div className="space-y-2">
                                <Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-3/4"/>
                             </div></CardContent></Card>
                              <Card><CardHeader><Skeleton className="h-7 w-1/2"/></CardHeader><CardContent><div className="space-y-2">
                                <Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-2/3"/>
                             </div></CardContent></Card>
                        </div>
                        <div className="md:col-span-1 space-y-8">
                            <Card><CardHeader><Skeleton className="h-7 w-1/2"/></CardHeader><CardContent className="space-y-4">
                                 <Skeleton className="h-20 w-full rounded-lg" />
                                 <Skeleton className="h-20 w-full rounded-lg" />
                             </CardContent></Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
