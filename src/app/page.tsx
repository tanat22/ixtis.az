'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, ChevronsUpDown } from "lucide-react"

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
import type { Specialty } from '@/lib/types';
import { getAllSpecialties } from '@/lib/data';
import { universities as allUniversities } from '@/lib/data/universities';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

export default function InteractiveGuidePage() {
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<Specialty[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filters State
  const [educationLevel, setEducationLevel] = React.useState('bachelor');
  const [educationLang, setEducationLang] = React.useState('all');
  const [selectedGroup, setSelectedGroup] = React.useState('all');
  const [selectedSubGroup, setSelectedSubGroup] = React.useState('all');
  const [selectedUniversity, setSelectedUniversity] = React.useState('all');
  const [educationForm, setEducationForm] = React.useState('all');
  const [educationType, setEducationType] = React.useState('all');
  const [maxScore, setMaxScore] = React.useState([700]);
  const [selectedSpecialtyName, setSelectedSpecialtyName] = React.useState('');
  
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const uniqueSpecialtyNames = React.useMemo(() => {
    if (loading) return [];
    const names = new Set(specialties.map(s => s.name));
    return Array.from(names).sort();
  }, [specialties, loading]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const specialtiesData = await getAllSpecialties();
      setSpecialties(specialtiesData);
      setFilteredSpecialties(specialtiesData); // Initially show all
      setLoading(false);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    const applyFiltersAndSort = () => {
      let tempSpecialties = specialties;

      tempSpecialties = tempSpecialties.filter(s => s.level === educationLevel);
      
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

      if (educationType !== 'all') {
        tempSpecialties = tempSpecialties.filter(s => s.educationType === educationType);
      }

      tempSpecialties = tempSpecialties.filter(s => (s.score ?? 0) <= maxScore[0]);
      
      if (selectedSpecialtyName) {
          tempSpecialties = tempSpecialties.filter(s => s.name === selectedSpecialtyName);
      }
      
      tempSpecialties.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      setFilteredSpecialties(tempSpecialties);
    };

    if (!loading) {
      applyFiltersAndSort();
    }
  }, [
    specialties, educationLevel, educationLang, selectedGroup, selectedSubGroup, 
    selectedUniversity, educationForm, educationType, maxScore, selectedSpecialtyName, loading
  ]);

  const getUniversityName = (id: number) => {
    const university = allUniversities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum';
  };

  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) {
        return `${spec.cost} AZN`;
    }
    return spec.cost || '-';
  };

  const renderTypeBadge = (spec: Specialty) => {
    const cost = spec.cost;
    const type = spec.educationType;
    if (cost === 'YDS' || cost === 'DH') return <Badge variant="success">{cost}</Badge>;
    if (cost === 'YÖ') return <Badge variant="info">{cost}</Badge>;
    if (type === 'Dövlət sifarişli') return <Badge variant="success">DS</Badge>;
    if (type === 'Ödənişli') return <Badge variant="info">Ödənişli</Badge>;
    return <Badge variant="secondary">-</Badge>;
  };

  const showSubGroupFilter = selectedGroup === '1' || selectedGroup === '3';

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90">
            İnteraktiv Təhsil Bələdçisi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Axtarışınızı dəqiqləşdirmək üçün təkmil filtrlərdən istifadə edin.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrlər</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                  <Label>Təhsil Səviyyəsi</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="bachelor">Bakalavriat</SelectItem>
                          <SelectItem value="master">Magistratura</SelectItem>
                          <SelectItem value="college">Orta ixtisas</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

               <div className="space-y-2">
                  <Label>Tədris Dili</Label>
                  <Select value={educationLang} onValueChange={setEducationLang}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Hamısı</SelectItem>
                          <SelectItem value="az">Azərbaycan</SelectItem>
                          <SelectItem value="ru">Rus</SelectItem>
                          <SelectItem value="en">İngilis</SelectItem>
                          <SelectItem value="tr">Türk</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                <Label>İxtisas Qrupu</Label>
                <Select value={selectedGroup} onValueChange={val => {setSelectedGroup(val); setSelectedSubGroup('all');}} disabled={educationLevel !== 'bachelor'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün Qruplar</SelectItem>
                    <SelectItem value="1">I Qrup</SelectItem>
                    <SelectItem value="2">II Qrup</SelectItem>
                    <SelectItem value="3">III Qrup</SelectItem>
                    <SelectItem value="4">IV Qrup</SelectItem>
                    <SelectItem value="5">V Qrup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className={cn("space-y-2 transition-opacity duration-300", showSubGroupFilter ? "opacity-100" : "opacity-50 pointer-events-none")}>
                <Label>Alt Qrup {showSubGroupFilter && <span className="text-red-500">*</span>}</Label>
                <Select value={selectedSubGroup} onValueChange={setSelectedSubGroup} disabled={!showSubGroupFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Seçin...</SelectItem>
                    {selectedGroup === '1' && <><SelectItem value="I (RK)">I (RK)</SelectItem><SelectItem value="I (Rİ)">I (Rİ)</SelectItem></>}
                    {selectedGroup === '3' && <><SelectItem value="III (DT)">III (DT)</SelectItem><SelectItem value="III (TC)">III (TC)</SelectItem></>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Təhsil Müəssisəsi</Label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün Müəssisələr</SelectItem>
                    {allUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={String(uni.id)}>{uni.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                  <Label>Təhsil Forması</Label>
                  <Select value={educationForm} onValueChange={setEducationForm}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Hamısı</SelectItem>
                          <SelectItem value="əyani">Əyani</SelectItem>
                          <SelectItem value="qiyabi">Qiyabi</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                  <Label>Təhsil Növü</Label>
                  <Select value={educationType} onValueChange={setEducationType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Hamısı</SelectItem>
                          <SelectItem value="Dövlət sifarişli">Dövlət sifarişli</SelectItem>
                          <SelectItem value="Ödənişli">Ödənişli</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <Label>İxtisas Adı</Label>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className="w-full justify-between font-normal text-left"
                        >
                            <span className='truncate'>
                            {selectedSpecialtyName
                            ? selectedSpecialtyName
                            : "İxtisas seçin..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                            <CommandInput placeholder="İxtisas axtar..." />
                            <CommandEmpty>İxtisas tapılmadı.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                            <CommandItem
                                onSelect={() => {
                                    setSelectedSpecialtyName("");
                                    setPopoverOpen(false);
                                }}
                                >
                                Bütün İxtisaslar
                            </CommandItem>
                            {uniqueSpecialtyNames.map((name) => (
                                <CommandItem
                                key={name}
                                onSelect={(currentValue) => {
                                    setSelectedSpecialtyName(name === selectedSpecialtyName ? "" : name)
                                    setPopoverOpen(false)
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedSpecialtyName === name ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </Command>
                        </PopoverContent>
                    </Popover>
              </div>

             <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <Label>Maksimum Keçid Balı: <span className="font-bold text-blue-600">{maxScore[0]}</span></Label>
                  <Slider
                    min={0}
                    max={700}
                    step={1}
                    value={maxScore}
                    onValueChange={setMaxScore}
                  />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nəticələr</CardTitle>
            <CardDescription>
              {filteredSpecialties.length} ixtisas tapıldı.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table - Hidden on small screens */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>İxtisas</TableHead>
                    <TableHead>Qrup</TableHead>
                    <TableHead>Təhsil Müəssisəsi</TableHead>
                    <TableHead className="text-center">Dil</TableHead>
                    <TableHead className="text-center">Bal</TableHead>
                    <TableHead className="text-center">Plan</TableHead>
                    <TableHead className="text-center">Növ</TableHead>
                    <TableHead className="text-right">Təhsil Haqqı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-56" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-12" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-16" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-12" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-12" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="ml-auto h-5 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredSpecialties.length > 0 ? (
                    filteredSpecialties.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="font-mono text-xs">{spec.facultyCode}</TableCell>
                        <TableCell className="font-medium">
                           <Link href={`/faculty/${spec.slug}`} className="hover:underline">{spec.name}</Link>
                           {spec.note && <p className="text-xs text-muted-foreground">({spec.note})</p>}
                        </TableCell>
                        <TableCell>{spec.subGroupId ? spec.subGroupId : spec.groupId.replace('group-', '')}</TableCell>
                        <TableCell>{getUniversityName(spec.universityId)}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="uppercase">{spec.educationLanguage}</Badge></TableCell>
                        <TableCell className="text-center font-mono">{spec.score ?? '-'}</TableCell>
                        <TableCell className="text-center font-mono">{spec.planCount ?? '-'}</TableCell>
                        <TableCell className="text-center">{renderTypeBadge(spec)}</TableCell>
                        <TableCell className="text-right font-mono">{renderCost(spec)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">Nəticə tapılmadı.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List - Hidden on medium and larger screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                     <Card key={i}><CardContent className="pt-6 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                     </CardContent></Card>
                  ))
              ) : filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((spec) => (
                    <Card key={spec.id} className="overflow-hidden">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base leading-tight pr-2">
                               <Link href={`/faculty/${spec.slug}`} className="hover:underline">{spec.name}</Link>
                            </h3>
                            <div className="flex-shrink-0">{renderTypeBadge(spec)}</div>
                        </div>
                         {spec.note && <p className="text-xs text-muted-foreground">({spec.note})</p>}
                        <p className="text-sm text-muted-foreground">{getUniversityName(spec.universityId)}</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                            <div className='space-y-1'><p className="text-muted-foreground">Qrup</p><p className="font-bold">{spec.subGroupId ? spec.subGroupId : spec.groupId.replace('group-', '')}</p></div>
                            <div className='space-y-1'><p className="text-muted-foreground">Bal</p><p className="font-bold font-mono">{spec.score ?? '-'}</p></div>
                            <div className='space-y-1'><p className="text-muted-foreground">Plan</p><p className="font-bold font-mono">{spec.planCount ?? '-'}</p></div>
                            <div className='space-y-1'><p className="text-muted-foreground">Dil</p><p className="font-bold uppercase">{spec.educationLanguage}</p></div>
                            <div className='space-y-1'><p className="text-muted-foreground">Kod</p><p className="font-bold font-mono">{spec.facultyCode}</p></div>
                             <div className='space-y-1'><p className="text-muted-foreground">Təhsil haqqı</p><p className="font-bold font-mono">{renderCost(spec)}</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                  <div className="h-24 text-center flex items-center justify-center">
                     <p>Nəticə tapılmadı.</p>
                  </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
