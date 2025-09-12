
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { UniversityInfo } from '@/lib/types';
import { getUniversityInfo } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, MapPin, Calendar, User, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function UniversitiesPage() {
  const [universities, setUniversities] = React.useState<UniversityInfo[]>([]);
  const [colleges, setColleges] = React.useState<UniversityInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { universities: uniData, colleges: collegeData } = await getUniversityInfo();
      setUniversities(uniData);
      setColleges(collegeData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const renderUniversityCard = (uni: UniversityInfo) => (
    <Card key={uni.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6 text-muted-foreground" />
          {uni.name}
        </CardTitle>
        {uni.details?.address && (
          <CardDescription className="flex items-center gap-2 pt-1">
            <MapPin className="h-4 w-4" /> {uni.details.address}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {uni.details && (
            <AccordionItem value="item-1">
              <AccordionTrigger>Ümumi Məlumat</AccordionTrigger>
              <AccordionContent className="space-y-2 text-muted-foreground">
                {uni.details.rector && (
                  <p className="flex items-center">
                    <User className="inline-block mr-2 h-4 w-4" />
                    <strong>Rektor:</strong> <span className="ml-2">{uni.details.rector}</span>
                  </p>
                )}
                {uni.details.founded && (
                  <p className="flex items-center">
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    <strong>Yaranma tarixi:</strong> <span className="ml-2">{uni.details.founded}</span>
                  </p>
                )}
                 {uni.details.website && (
                  <p className="flex items-center">
                    <LinkIcon className="inline-block mr-2 h-4 w-4" />
                    <strong>Rəsmi sayt:</strong>
                    <Link href={uni.details.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                      {uni.details.website}
                    </Link>
                  </p>
                )}
                {uni.details.branches && uni.details.branches.length > 0 && (
                   <div className="pt-2">
                     <p className="flex items-center font-semibold text-foreground/90">
                        <MapPin className="inline-block mr-2 h-4 w-4" />
                        Filiallar:
                      </p>
                     <ul className="list-disc pl-8 mt-1 space-y-1">
                       {uni.details.branches.map((branch, index) => (
                         <li key={index}>{branch}</li>
                       ))}
                     </ul>
                   </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
          {uni.notes && uni.notes.length > 0 && (
            <AccordionItem value="item-2">
              <AccordionTrigger>Qəbula dair qeydlər</AccordionTrigger>
              <AccordionContent className="space-y-3">
                {uni.notes.map((note) => (
                  <div
                    key={note.note_no}
                    className="flex items-start gap-3"
                  >
                    <Badge variant="secondary" className="mt-1">
                      {note.note_no}
                    </Badge>
                    <p className="text-muted-foreground">{note.qeyd}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          {uni.details?.history && (
            <AccordionItem value="item-3">
              <AccordionTrigger>Tarixçə</AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">
                {uni.details.history}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
  
    const renderCollegeCard = (uni: UniversityInfo) => (
    <Card key={uni.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="h-5 w-5 text-muted-foreground" />
          {uni.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );

  return (
    <main className="container mx-auto max-w-5xl px-4 sm:px-8 py-8">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Ali Təhsil Müəssisələri
          </CardTitle>
          <CardDescription>
            Azərbaycanın ali təhsil müəssisələri haqqında ətraflı məlumat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-7 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                </Card>
              ))
            : universities.map(renderUniversityCard)}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Orta İxtisas Təhsili Müəssisələri (Kolleclər)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                 <Card key={`skel-coll-${i}`}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                </Card>
              ))
            : colleges.map(renderCollegeCard)
            }
        </CardContent>
      </Card>
    </main>
  );
}

