'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelection } from '@/context/SelectionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, BarChart2, FileDown, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { universities as allUniversities } from '@/lib/data/universities';
import type { Specialty } from '@/lib/types';
import { cn } from "@/lib/utils";
import { getAllSpecialties } from '@/lib/data';
import { generateAndSavePDF } from '@/lib/pdfGenerator'; // Import the new generator

// Admission Probability Calculation (can also be moved, but kept here for now for simplicity)
const calculateProbability = (userScore: number, specialty: Specialty): number => {
  const { score: specialtyScore, planCount } = specialty;
  if (userScore === 0 || specialtyScore === null || specialtyScore === undefined) return 0;
  let competitionBuffer = 15;
  if (planCount !== null && planCount !== undefined) {
    const averagePlanCount = 40;
    const maxAdjustment = 10;
    const planAdjustment = Math.round(((averagePlanCount - planCount) / averagePlanCount) * maxAdjustment);
    competitionBuffer += planAdjustment;
  }
  const adjustedSpecialtyScore = specialtyScore + competitionBuffer;
  const scoreDiff = userScore - adjustedSpecialtyScore;
  if (scoreDiff >= 20) return 99;
  if (scoreDiff > 0) return 75 + Math.round((scoreDiff / 20) * 24);
  if (scoreDiff > -15) return 40 + Math.round((scoreDiff + 15) / 15 * 35);
  if (scoreDiff > -35) return 10 + Math.round((scoreDiff + 35) / 20 * 30);
  return Math.max(1, 5 + Math.round((scoreDiff + 35) / 10));
};

const calculateOverallProbability = (probabilities: number[]): number => {
  if (probabilities.length === 0) return 0;
  const probOfNotGettingIntoAny = probabilities.reduce((acc, prob) => acc * (1 - prob / 100), 1);
  const overallProb = (1 - probOfNotGettingIntoAny) * 100;
  return Math.round(overallProb);
};

export default function SelectionPage() {
  const { selectedList, removeFromSelection, clearSelection, userScore, moveItem } = useSelection();
  const [allSpecialties, setAllSpecialties] = React.useState<Specialty[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      const specialtiesData = await getAllSpecialties();
      setAllSpecialties(specialtiesData);
    }
    if (isClient) {
      fetchData();
    }
  }, [isClient]);
  
  // Helper function moved here as it depends on `allUniversities` from this scope
  const getUniversityName = (id: number) => {
      const university = allUniversities.find((u) => u.id === id);
      return university ? university.name : 'Naməlum';
  };

  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) return `${spec.cost} AZN`;
    return spec.cost || '-';
  };

  const handleGeneratePDF = () => {
      generateAndSavePDF({
          selectedList,
          userScore,
          allSpecialties,
          allUniversities
      });
  };

  if (!isClient) {
    return null; 
  }

  const remainingSelections = 20 - selectedList.length;

  if (selectedList.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-center">
         <Card className="py-20">
            <CardHeader>
                <BarChart2 className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4 text-2xl font-bold">Seçim Siyahınız Boşdur</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                Qəbul ehtimalınızı görmək və PDF məsləhət almaq üçün 'İxtisas Seçimi' səhifəsindən ixtisaslar əlavə edin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/ixtisas-secimi"> 
                    <Button>İxtisas Seçiminə Başla</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  const individualProbabilities = selectedList.map(spec => calculateProbability(userScore, spec));
  const overallAdmissionProbability = calculateOverallProbability(individualProbabilities);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90 text-center">Seçim Siyahısı</h1>
          <p className="mt-2 text-muted-foreground text-center">Siyahınızda {selectedList.length}/20 ixtisas var. Seçimlərinizi sıralayın və nəticəni qiymətləndirin.</p>
        </header>

        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-primary">Ümumi Qəbul Olma Ehtimalınız</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
              <p className="text-6xl font-bold text-foreground/90">{overallAdmissionProbability}%</p>
              <p className="text-sm text-muted-foreground mt-2">Bu, siyahınızdakı ən azı bir ixtisasa qəbul olma şansınızdır.</p>
          </CardContent>
        </Card>

        <div className="space-y-4 pb-32"> 
          {selectedList.map((spec, index) => {
              const probability = calculateProbability(userScore, spec);
              return(
                  <Card key={spec.id} className="relative overflow-hidden group">
                      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => moveItem(index, index - 1)} disabled={index === 0}>
                              <ArrowUp className="h-4 w-4" />
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => moveItem(index, index + 1)} disabled={index === selectedList.length - 1}>
                              <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeFromSelection(spec.id)}>
                              <X className="h-4 w-4 text-red-500" />
                          </Button>
                      </div>
                      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                         <div className="md:col-span-3 space-y-2">
                              <p className="text-lg font-bold">{index + 1}. {spec.name}</p>
                              <p className="text-sm text-muted-foreground">{getUniversityName(spec.universityId)}</p>
                               <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
                                  <span><span className="font-semibold">Qrup:</span> {spec.subGroupId || spec.groupId.replace('group-','')}</span>
                                  <span><span className="font-semibold">Keçid Balı:</span> {spec.score || '-'}</span>
                                  <span><span className="font-semibold">Təhsil Haqqı:</span> {renderCost(spec)}</span>
                              </div>
                         </div>
                         <div className="text-center md:col-span-1 flex flex-col items-center justify-center space-y-1">
                              <p className="text-xs text-muted-foreground">Sizin bal: {userScore}</p>
                              <Badge className={cn(
                                  probability > 80 && 'bg-green-600',
                                  probability <= 80 && probability > 50 && 'bg-yellow-500',
                                  probability <= 50 && 'bg-red-600',
                                  'text-white text-base font-semibold'
                              )}>Ehtimal: {probability}%</Badge>
                         </div>
                      </CardContent>
                  </Card>
              )
          })}
        </div>
      </main>
      
      {selectedList.length > 0 && (
        <footer className="sticky bottom-0 bg-background/95 border-t backdrop-blur-sm z-10">
           <div className="w-full max-w-4xl mx-auto p-4 flex flex-row justify-between items-center gap-4">
              <div className="flex-grow">
                {remainingSelections > 0 && (
                     <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>PDF üçün daha <b>{remainingSelections}</b> seçim edin.</span>
                     </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                  <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <div className={cn(selectedList.length < 20 && 'cursor-not-allowed')}>
                                  <Button 
                                      onClick={handleGeneratePDF} 
                                      disabled={selectedList.length < 20 || allSpecialties.length === 0}
                                      className='h-auto whitespace-normal text-center max-w-[220px] md:max-w-xs'
                                      style={{ lineHeight: '1.2' }} // Fine-tune line height
                                  >
                                      <FileDown className="mr-2 h-4 w-4 flex-shrink-0" />
                                      Sizin 20 seçiminiz + bizim təklifimiz (PDF)
                                  </Button>
                              </div>
                          </TooltipTrigger>
                          {selectedList.length < 20 && (
                              <TooltipContent>
                                  <p>PDF yükləmək üçün 20 ixtisas seçməlisiniz.</p>
                              </TooltipContent>
                          )}
                      </Tooltip>
                  </TooltipProvider>
                  <Button variant="destructive" onClick={clearSelection}>
                      Siyahını Təmizlə
                  </Button>
              </div>
          </div>
        </footer>
      )}
    </div>
  );
}
