'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, ChevronsUpDown, PlusCircle, XCircle, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { Specialty } from '@/lib/types';
import { getAllSpecialties } from '@/lib/data';
import { universities as allUniversities } from '@/lib/data/universities';
import { useSelection } from '@/context/SelectionContext';

const Notification = ({ message, onClear }: { message: string | null, onClear: () => void }) => {
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClear();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    return (
        <div className={cn(
            "fixed bottom-0 left-1/2 -translate-x-1/2 mb-5 z-50 transition-all duration-300 ease-out",
            message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}>
            <div className="flex items-center gap-3 bg-red-600/90 backdrop-blur-sm text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-2xl border border-red-500/50">
                <AlertTriangle className="h-5 w-5"/>
                <span>{message}</span>
            </div>
        </div>
    );
};

const calculateProbability = (userScore: number, specialtyScore: number | null | undefined, planCount: number | null | undefined): number => {
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

interface SpecialtySelectorProps {
  showTitle?: boolean;
  showSelectButton?: boolean;
  showCodeColumn?: boolean;
  highlightScoreInput?: boolean;
  showEducationLevelFilter?: boolean;
  showFilters?: boolean;
}

export function SpecialtySelector({ 
  showTitle = true, 
  showSelectButton = true, 
  showCodeColumn = false, 
  highlightScoreInput = false, 
  showEducationLevelFilter = false,
  showFilters = true,
}: SpecialtySelectorProps) {
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<Specialty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(10);
  const [notification, setNotification] = React.useState<string | null>(null);
  
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Get all states and setters from the global context
  const {
    selectedList, addToSelection, removeFromSelection, userScore, setUserScore,
    educationLevel, setEducationLevel,
    educationLang, setEducationLang,
    selectedGroup, setSelectedGroup,
    selectedSubGroup, setSelectedSubGroup,
    selectedUniversity, setSelectedUniversity,
    educationForm, setEducationForm,
    educationPaymentType, setEducationPaymentType,
    selectedSpecialtyName, setSelectedSpecialtyName,
  } = useSelection();

  const showSubGroupFilter = educationLevel === 'bachelor' && (selectedGroup === '1' || selectedGroup === '3');

  const uniqueSpecialtyNames = React.useMemo(() => {
    if (loading) return [];
    const names = new Set(specialties.filter(s => s.level === educationLevel).map(s => s.name));
    return Array.from(names).sort();
  }, [specialties, loading, educationLevel]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setProgress(10);
      const specialtiesData = await getAllSpecialties();
      setSpecialties(specialtiesData);
      setFilteredSpecialties(specialtiesData.filter(s => s.level === educationLevel));
      setLoading(false);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : 90));
      }, 300);
      return () => clearInterval(timer);
    }
  }, [loading]);

  React.useEffect(() => {
    if (!loading) {
      const applyFiltersAndSort = () => {
        let tempSpecialties = specialties.filter(s => s.level === educationLevel);
        
        if (educationLang !== 'all') {
            tempSpecialties = tempSpecialties.filter(s => s.educationLanguage === educationLang);
        }
        if (educationLevel === 'bachelor') {
          if (selectedGroup !== 'all') {
              tempSpecialties = tempSpecialties.filter(s => s.groupId === `group-${selectedGroup}`);
              if ((selectedGroup === '1' || selectedGroup === '3') && selectedSubGroup !== 'all'){
                  tempSpecialties = tempSpecialties.filter(s => s.subGroupId === selectedSubGroup)
              }
          }
        }
        if (selectedUniversity !== 'all') {
          tempSpecialties = tempSpecialties.filter(s => s.universityId === parseInt(selectedUniversity, 10));
        }
        if (educationForm !== 'all') {
          tempSpecialties = tempSpecialties.filter(s => s.educationForm === educationForm);
        }
        if (educationPaymentType !== 'all') {
            if (educationPaymentType === 'Dövlət sifarişli') {
                 tempSpecialties = tempSpecialties.filter(s => ['Dövlət sifarişli', 'YDS', 'DH'].includes(s.educationType || ''));
            } else if (educationPaymentType === 'Ödənişli') {
                 tempSpecialties = tempSpecialties.filter(s => ['Ödənişli', 'YÖ'].includes(s.educationType || ''));
            } else {
                tempSpecialties = tempSpecialties.filter(s => s.educationType === educationPaymentType);
            }
        }
        if (selectedSpecialtyName) {
            tempSpecialties = tempSpecialties.filter(s => s.name === selectedSpecialtyName);
        }
        tempSpecialties.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        setFilteredSpecialties(tempSpecialties);
      };
      applyFiltersAndSort();
    }
  }, [
    specialties, educationLevel, educationLang, selectedGroup, selectedSubGroup, 
    selectedUniversity, educationForm, educationPaymentType, selectedSpecialtyName, loading
  ]);

  const getUniversityName = (id: number) => {
    const university = allUniversities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum';
  };

  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) return `${spec.cost} AZN`;
    if (typeof spec.cost === 'string' && spec.cost.trim() !== '') return `${spec.cost} AZN`;
    return '-';
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderTypeBadge = (spec: Specialty) => {
    const type = spec.educationType;
    if (type === 'YDS' || type === 'DH') return <Badge variant="success">{type}</Badge>;
    if (type === 'YÖ') return <Badge variant="destructive">{type}</Badge>;
    if (type === 'Dövlət sifarişli') return <Badge variant="success">DS</Badge>;
    if (type === 'Ödənişli') return <Badge variant="info">Ödənişli</Badge>;
    return <Badge variant="secondary">-</Badge>;
  };

  const handleSelectClick = (specialty: Specialty) => {
    const isSelected = !!selectedList.find(s => s.id === specialty.id);
    if (isSelected) {
      removeFromSelection(specialty.id);
      return;
    }

    if (!userScore || userScore === 0) {
      setNotification("Seçim etmək və ehtimalları göstərə bilmək üçün xahiş olunur balınızı yazasınız");
      return;
    }

    if (educationLevel === 'bachelor' && selectedGroup === 'all') {
      setNotification("Zəhmət olmasa, əvvəlcə ixtisas qrupunu seçin.");
      return;
    }

    if (showSubGroupFilter && selectedSubGroup === 'all') {
      setNotification("Bu qrup üçün alt qrup seçimi məcburidir.");
      return;
    }

    if (selectedList.length >= 20) {
      setNotification("Maksimum 20 ixtisas seçə bilərsiniz.");
      return;
    }

    addToSelection(specialty);
  };
  
  const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center h-48 w-full">
        <Progress value={progress} className="w-3/4 md:w-1/2 mb-4" />
        <p className="text-muted-foreground animate-pulse">İxtisaslar yüklənir, zəhmət olmasa gözləyin...</p>
    </div>
  );

  const renderSelectButton = (spec: Specialty) => {
    const isSelected = !!selectedList.find(s => s.id === spec.id);
    const probability = calculateProbability(userScore, spec.score, spec.planCount);

    return (
        <Button 
            size="sm"
            onClick={() => handleSelectClick(spec)} 
            className={cn(
                "w-full md:w-auto",
                isSelected 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : {
                        'bg-green-600 hover:bg-green-700 text-white': userScore > 0 && probability > 80,
                        'bg-yellow-500 hover:bg-yellow-600 text-white': userScore > 0 && probability > 50 && probability <= 80,
                        'bg-red-600 hover:bg-red-700 text-white': userScore > 0 && probability <= 50,
                      }
            )}
        >
            {isSelected 
                ? <span className="flex items-center"><XCircle className="mr-2 h-4 w-4"/> Ləğv et</span> 
                : (userScore > 0 
                    ? <span className="flex items-center"><span className="mr-2 font-semibold">Ehtimal: {probability}%</span> | <PlusCircle className="ml-2 h-4 w-4"/> Seç</span>
                    : <span className="flex items-center"><PlusCircle className="mr-2 h-4 w-4"/> Seç</span>)}
        </Button>
    );
  }

  return (
    <main className="flex w-full flex-col items-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-8">
      <Notification message={notification} onClear={() => setNotification(null)} />
      <div className="w-full max-w-7xl">
        {showTitle && (
            <header className="mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90">İxtisas Seçimi</h1>
                <p className="mt-2 text-muted-foreground">Seçim etmək üçün təkmil filtrlərdən istifadə edin.</p>
            </header>
        )}

        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                      <CardTitle>Filtrlər</CardTitle>
                      {showEducationLevelFilter && (
                          <div className="flex items-center gap-2">
                              <Label htmlFor="education-level" className="shrink-0">Təhsil səviyyəsi</Label>
                              <Select value={educationLevel} onValueChange={setEducationLevel}>
                                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="bachelor">Bakalavr</SelectItem>
                                      <SelectItem value="master">Maqistr</SelectItem>
                                      <SelectItem value="college">Subbakalavr</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                      )}
                  </div>
                  <div className={cn(
                      "flex items-center gap-2",
                      highlightScoreInput && "p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-300/50"
                  )}>
                      <Label 
                          htmlFor="user-score" 
                          className={cn(
                              "shrink-0 text-sm font-medium",
                              highlightScoreInput && "text-base font-semibold text-blue-600 dark:text-blue-300"
                          )}
                      >
                          {highlightScoreInput ? "Topladığınız balı yazın:" : "Topladığınız bal:"}
                      </Label>
                      <Input
                          id="user-score"
                          type="number"
                          placeholder={highlightScoreInput ? "nümunə: 543" : "Balınızı daxil edin"}
                          className="w-36 text-base"
                          value={userScore || ''}
                          onChange={(e) => setUserScore(Number(e.target.value))}
                      />
                  </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 pt-6">
                <div className="space-y-2"><Label>Tədris Dili</Label><Select value={educationLang} onValueChange={setEducationLang}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Hamısı</SelectItem><SelectItem value="az">Azərbaycan</SelectItem><SelectItem value="ru">Rus</SelectItem><SelectItem value="en">İngilis</SelectItem><SelectItem value="tr">Türk</SelectItem></SelectContent></Select></div>
                {educationLevel === 'bachelor' && (
                  <>
                    <div className="space-y-2"><Label>İxtisas Qrupu</Label><Select value={selectedGroup} onValueChange={val => {setSelectedGroup(val); setSelectedSubGroup('all');}} ><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Bütün Qruplar</SelectItem><SelectItem value="1">I Qrup</SelectItem><SelectItem value="2">II Qrup</SelectItem><SelectItem value="3">III Qrup</SelectItem><SelectItem value="4">IV Qrup</SelectItem><SelectItem value="5">V Qrup</SelectItem></SelectContent></Select></div>
                    <div className={cn("space-y-2 transition-opacity duration-300", showSubGroupFilter ? "opacity-100" : "opacity-50 pointer-events-none")}><Label>Alt Qrup {showSubGroupFilter && <span className="text-red-500">*</span>}</Label><Select value={selectedSubGroup} onValueChange={setSelectedSubGroup} disabled={!showSubGroupFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Seçin...</SelectItem>{selectedGroup === '1' && <><SelectItem value="I (RK)">I (RK)</SelectItem><SelectItem value="I (Rİ)">I (Rİ)</SelectItem></>}{selectedGroup === '3' && <><SelectItem value="III (DT)">III (DT)</SelectItem><SelectItem value="III (TC)">III (TC)</SelectItem></>}
                        </SelectContent></Select></div>
                  </>
                )}
                <div className="space-y-2"><Label>Təhsil Müəssisəsi</Label><Select value={selectedUniversity} onValueChange={setSelectedUniversity}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Bütün Müəssisələr</SelectItem>{allUniversities.map((uni) => (<SelectItem key={uni.id} value={String(uni.id)}>{uni.name}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Tədris Növü</Label><Select value={educationForm} onValueChange={setEducationForm}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Hamısı</SelectItem><SelectItem value="əyani">Əyani</SelectItem><SelectItem value="qiyabi">Qiyabi</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Ödəniş Növü</Label><Select value={educationPaymentType} onValueChange={setEducationPaymentType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Hamısı</SelectItem><SelectItem value="Dövlət sifarişli">Dövlət Sifarişli</SelectItem><SelectItem value="Ödənişli">Ödənişli</SelectItem><SelectItem value="YDS">YDS (yalnız)</SelectItem><SelectItem value="YÖ">YÖ (yalnız)</SelectItem><SelectItem value="DH">DH (yalnız)</SelectItem></SelectContent></Select></div>
                <div className={cn("space-y-2 sm:col-span-2", educationLevel === 'bachelor' ? 'lg:col-span-3' : 'lg:col-span-4')}><Label>İxtisas Adı</Label><Popover open={popoverOpen} onOpenChange={setPopoverOpen}><PopoverTrigger asChild><Button variant="outline" role="combobox" aria-expanded={popoverOpen} className="w-full justify-between font-normal text-left"><span className='truncate'>{selectedSpecialtyName? selectedSpecialtyName: "İxtisas seçin..."}</span><ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"><Command><CommandInput placeholder="İxtisas axtar..." /><CommandEmpty>İxtisas tapılmadı.</CommandEmpty><CommandGroup className="max-h-60 overflow-y-auto"><CommandItem onSelect={() => { setSelectedSpecialtyName(""); setPopoverOpen(false);}}>Bütün İxtisaslar</CommandItem>{uniqueSpecialtyNames.map((name) => (<CommandItem key={name} onSelect={(currentValue) => { setSelectedSpecialtyName(name === selectedSpecialtyName ? "" : name); setPopoverOpen(false);}}><Check className={cn("mr-2 h-4 w-4",selectedSpecialtyName === name ? "opacity-100" : "opacity-0" )}/>{name}</CommandItem>))}</CommandGroup></Command></PopoverContent></Popover></div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Nəticələr</CardTitle>
            <CardDescription>
              {!loading && `${filteredSpecialties.length} ixtisas tapıldı.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <LoadingIndicator /> : (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {showCodeColumn && <TableHead>Kod</TableHead>}
                        <TableHead>İxtisas</TableHead>
                        {educationLevel === 'bachelor' && <TableHead>Qrup</TableHead>}
                        <TableHead className="text-center">Keçid Balı</TableHead>
                        <TableHead className="text-center">Plan</TableHead>
                        <TableHead className="text-center">Təhsil Haqqı</TableHead>
                        <TableHead className="text-center">Növ</TableHead>
                        <TableHead className="text-center">Tədris Növü</TableHead>
                        {showSelectButton && <TableHead className="text-right">Seçim</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpecialties.length > 0 ? (
                        filteredSpecialties.map((spec) => {
                          const isSelected = !!selectedList.find(s => s.id === spec.id);
                          return (
                            <TableRow key={spec.id}>
                              {showCodeColumn && <TableCell className="font-mono text-xs">{spec.facultyCode}</TableCell>}
                              <TableCell className="font-medium"><Link href={`/faculty/${spec.slug}`} className="hover:underline">{spec.name}</Link><p className="text-xs text-muted-foreground">{getUniversityName(spec.universityId)}</p></TableCell>
                              {educationLevel === 'bachelor' && <TableCell>{spec.subGroupId ? spec.subGroupId : spec.groupId.replace('group-', '')}</TableCell>}
                              <TableCell className="text-center font-mono">{spec.score ?? '-'}</TableCell>
                              <TableCell className="text-center font-mono">{spec.planCount ?? '-'}</TableCell>
                              <TableCell className="text-center font-mono">{renderCost(spec)}</TableCell>
                              <TableCell className="text-center flex justify-center">{renderTypeBadge(spec)}</TableCell>
                              <TableCell className="text-center">{capitalizeFirstLetter(spec.educationForm)}</TableCell>
                              {showSelectButton && <TableCell className="text-right">{renderSelectButton(spec)}</TableCell>}
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow><TableCell colSpan={showSelectButton ? 9 : 8} className="h-24 text-center">Nəticə tapılmadı.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredSpecialties.length > 0 ? (
                      filteredSpecialties.map((spec) => {
                          const isSelected = !!selectedList.find(s => s.id === spec.id);
                          return(
                            <Card key={spec.id} className="overflow-hidden"><CardContent className="p-4 space-y-3"><div className="flex justify-between items-start"><h3 className="font-bold text-base leading-tight pr-2"><Link href={`/faculty/${spec.slug}`} className="hover:underline">{spec.name}</Link></h3><div className="flex-shrink-0">{renderTypeBadge(spec)}</div></div><p className="text-sm text-muted-foreground">{getUniversityName(spec.universityId)}</p><div className="grid grid-cols-3 gap-x-2 gap-y-3 text-xs pt-2">
                                {educationLevel === 'bachelor' && <div className='space-y-1'><p className="text-muted-foreground">Qrup</p><p className="font-bold">{spec.subGroupId ? spec.subGroupId : spec.groupId.replace('group-', '')}</p></div>}
                                <div className='space-y-1'><p className="text-muted-foreground">Keçid Balı</p><p className="font-bold font-mono">{spec.score ?? '-'}</p></div><div className='space-y-1'><p className="text-muted-foreground">Plan</p><p className="font-bold font-mono">{spec.planCount ?? '-'}</p></div><div className='space-y-1'><p className="text-muted-foreground">Dil</p><p className="font-bold uppercase">{spec.educationLanguage}</p></div>
                                {showCodeColumn && <div className='space-y-1'><p className="text-muted-foreground">Kod</p><p className="font-bold font-mono">{spec.facultyCode}</p></div>}
                                <div className='space-y-1'><p className="text-muted-foreground">Tədris Növü</p><p className="font-bold">{capitalizeFirstLetter(spec.educationForm)}</p></div><div className='space-y-1'><p className="text-muted-foreground">Təhsil haqqı</p><p className="font-bold font-mono">{renderCost(spec)}</p></div></div>
                            {showSelectButton && <div className="pt-4">{renderSelectButton(spec)}</div>}
                            </CardContent></Card>
                          )
                      })
                  ) : (
                      <div className="h-24 text-center flex items-center justify-center"><p>Nəticə tapılmadı.</p></div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
