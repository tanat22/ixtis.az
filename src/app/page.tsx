
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { specialties as allSpecialties, universities as allUniversities, groups, subgroups, levels, educationForms, educationLanguages, years } from '@/lib/data';
import type { Specialty } from '@/lib/types';
import { specialtyInfo, type SpecialtyInfo } from '@/lib/data/specialty-info';
import { universityInfo, type UniversityInfo } from '@/lib/data/university-info';
import { ArrowUp, ArrowDown, Sparkles, University as UniversityIcon, Info } from 'lucide-react';

type CombinedSpecialty = {
    id: string;
    name: string;
    universityId: string;
    groupId: string;
    subgroupId?: string;
    level: 'bachelor' | 'college' | 'master';
    educationForm: 'əyani' | 'qiyabi';
    educationLanguage: 'az' | 'ru' | 'en' | 'tr';
    paymentType: 'dövlət sifarişli' | 'ödənişli';
    planCount: number;
    scores: { [year: number]: number | null };
};

export default function InteractiveGuidePage() {
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<CombinedSpecialty[]>([]);
  const [level, setLevel] = React.useState('bachelor');
  const [university, setUniversity] = React.useState('all');
  const [group, setGroup] = React.useState('all');
  const [subgroup, setSubgroup] = React.useState('all');
  const [educationForm, setEducationForm] = React.useState('all');
  const [educationLanguage, setEducationLanguage] = React.useState('all');
  const [specialtyName, setSpecialtyName] = React.useState('all');
  const [score, setScore] = React.useState(700);

  const [isInfoDialogOpen, setIsInfoDialogOpen] = React.useState(false);
  const [selectedSpecialtyInfo, setSelectedSpecialtyInfo] = React.useState<{ name: string; info: SpecialtyInfo | null; lang: string } | null>(null);

  const [isUniversityInfoDialogOpen, setIsUniversityInfoDialogOpen] = React.useState(false);
  const [selectedUniversityInfo, setSelectedUniversityInfo] = React.useState<{ name: string; info: UniversityInfo | null } | null>(null);

  const combinedSpecialties = React.useMemo(() => {
    const specialtyMap = new Map<string, CombinedSpecialty>();

    allSpecialties.forEach(s => {
      const key = `${s.name}-${s.universityId}-${s.level}-${s.educationForm}-${s.educationLanguage}-${s.paymentType}-${s.groupId}-${s.subgroupId || ''}`;
      
      let existingSpec = specialtyMap.get(key);

      if (!existingSpec) {
        existingSpec = {
          id: s.id,
          name: s.name,
          universityId: s.universityId,
          groupId: s.groupId,
          subgroupId: s.subgroupId,
          level: s.level,
          educationForm: s.educationForm,
          educationLanguage: s.educationLanguage,
          paymentType: s.paymentType,
          planCount: s.planCount,
          scores: {},
        };
        specialtyMap.set(key, existingSpec);
      }
      
      if (existingSpec.scores[s.year] === undefined) {
          existingSpec.scores[s.year] = s.score;
      }
    });

    return Array.from(specialtyMap.values());
  }, []);

 const availableUniversities = React.useMemo(() => {
    const universityIdsInSpecialties = new Set(allSpecialties.map(s => s.universityId));
    return allUniversities.filter(u => universityIdsInSpecialties.has(u.id));
  }, []);


  const availableSubgroups = React.useMemo(() => {
    if (group === 'grp-1' || group === 'grp-3') {
      return subgroups.filter(sg => sg.groupId === group);
    }
    return [];
  }, [group]);
  
  const availableSpecialties = React.useMemo(() => {
    const filtered = combinedSpecialties.filter(s => {
        if (level === 'master' || level === 'college') {
            return s.level === level;
        }
        const groupMatch = group === 'all' || s.groupId === group;
        const subgroupMatch = subgroup === 'all' || s.subgroupId === subgroup;
        return s.level === 'bachelor' && groupMatch && subgroupMatch;
    });

    const uniqueNames = [...new Set(filtered.map(s => s.name))];
    return uniqueNames.sort((a,b) => a.localeCompare(b, 'az'));
  }, [group, subgroup, level, combinedSpecialties]);


  React.useEffect(() => {
    if (availableSubgroups.length > 0 && !availableSubgroups.find(sg => sg.id === subgroup)) {
        setSubgroup('all');
    } else if (availableSubgroups.length === 0) {
      setSubgroup('all');
    }
  }, [group, availableSubgroups, subgroup]);

  React.useEffect(() => {
    const results = combinedSpecialties.filter(s => {
      const latestYear = Math.max(...Object.keys(s.scores).map(Number).filter(y => s.scores[y] !== null));
      const latestScore = s.scores[latestYear];

      const levelMatch = s.level === level;
      const universityMatch = university === 'all' || s.universityId === university;
      const educationFormMatch = educationForm === 'all' || s.educationForm === educationForm;
      const educationLanguageMatch = educationLanguage === 'all' || s.educationLanguage === educationLanguage;
      const specialtyNameMatch = specialtyName === 'all' || s.name === specialtyName;
      const scoreMatch = (latestScore !== null && latestScore !== undefined ? latestScore <= score : true);

      if (level === 'master' || level === 'college') {
           return levelMatch && universityMatch && educationFormMatch && educationLanguageMatch && specialtyNameMatch && scoreMatch;
      }
      
      const groupMatch = group === 'all' || s.groupId === group;
      const hasSubgroup = s.groupId === 'grp-1' || s.groupId === 'grp-3';
      const subgroupMatch = !hasSubgroup || subgroup === 'all' || s.subgroupId === subgroup;

      return levelMatch && universityMatch && groupMatch && subgroupMatch && educationFormMatch && educationLanguageMatch && specialtyNameMatch && scoreMatch;
    });
    setFilteredSpecialties(results);
  }, [level, university, group, subgroup, educationForm, educationLanguage, specialtyName, score, combinedSpecialties]);

  const sortedYears = React.useMemo(() => years.sort((a,b) => a - b), []);

  const handleSpecialtyRowClick = (spec: CombinedSpecialty) => {
    const baseName = spec.name.replace(/\s*\(tədris .*\)/, '').trim();
    const info = specialtyInfo[baseName] || null;
    setSelectedSpecialtyInfo({ name: spec.name, info, lang: spec.educationLanguage });
    setIsInfoDialogOpen(true);
  };
  
  const handleUniversityRowClick = (uniId: string) => {
      const uni = allUniversities.find(u => u.id === uniId);
      if (!uni) return;
      const info = universityInfo[uni.id] || null;
      setSelectedUniversityInfo({ name: uni.name, info });
      setIsUniversityInfoDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground/90">İnteraktiv Təhsil Bələdçisi</h1>
            <p className="text-muted-foreground mt-2">Keçid ballarını kəşf edin və müqayisə edin</p>
        </header>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Filtrlər</CardTitle>
                <CardDescription>Axtarışınızı dəqiqləşdirmək üçün filtrlərdən istifadə edin.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Təhsil Səviyyəsi</label>
                        <Select value={level} onValueChange={(value) => { setLevel(value); setGroup('all'); setSubgroup('all'); setSpecialtyName('all'); }}>
                            <SelectTrigger><SelectValue placeholder="Təhsil Səviyyəsi" /></SelectTrigger>
                            <SelectContent>
                                {levels.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Təhsil Müəssisəsi</label>
                         <Select value={university} onValueChange={setUniversity}>
                            <SelectTrigger><SelectValue placeholder="Universitet/Kollec" /></SelectTrigger>
                            <SelectContent className="max-h-80">
                                <SelectItem value="all">Bütün Təhsil Müəssisələri</SelectItem>
                                {availableUniversities.sort((a, b) => a.name.localeCompare(b.name, 'az')).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {level === 'bachelor' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">İxtisas Qrupu</label>
                                <Select value={group} onValueChange={(value) => { setGroup(value); setSpecialtyName('all'); }}>
                                    <SelectTrigger><SelectValue placeholder="İxtisas Qrupu" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Bütün Qruplar</SelectItem>
                                        {groups.filter(g => g.id !== 'none').map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {availableSubgroups.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Altqrup</label>
                                    <Select value={subgroup} onValueChange={(value) => { setSubgroup(value); setSpecialtyName('all'); }}>
                                        <SelectTrigger><SelectValue placeholder="Altqrup seçin" /></SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="all">Hamısı</SelectItem>
                                            {availableSubgroups.map(sg => <SelectItem key={sg.id} value={sg.id}>{sg.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tədris Forması</label>
                         <Select value={educationForm} onValueChange={setEducationForm}>
                            <SelectTrigger><SelectValue placeholder="Tədris Forması" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hamısı</SelectItem>
                                {educationForms.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tədris Dili</label>
                         <Select value={educationLanguage} onValueChange={setEducationLanguage}>
                            <SelectTrigger><SelectValue placeholder="Tədris Dili" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hamısı</SelectItem>
                                {educationLanguages.map(lang => <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 lg:col-span-2 xl:col-span-2">
                         <label htmlFor="search" className="text-sm font-medium">İxtisas üzrə axtarış</label>
                         <Select value={specialtyName} onValueChange={setSpecialtyName}>
                             <SelectTrigger><SelectValue placeholder="İxtisas adı..." /></SelectTrigger>
                             <SelectContent className="max-h-80">
                                 <SelectItem value="all">Bütün İxtisaslar</SelectItem>
                                 {availableSpecialties.map(specName => <SelectItem key={specName} value={specName}>{specName}</SelectItem>)}
                             </SelectContent>
                         </Select>
                    </div>
                    <div className="lg:col-span-full xl:col-span-full space-y-2">
                         <label htmlFor="score" className="text-sm font-medium">Maksimal Keçid Balı: {score}</label>
                         <Slider
                            id="score"
                            min={0}
                            max={700}
                            step={1}
                            value={[score]}
                            onValueChange={(value) => setScore(value[0])}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground mb-4">
            Tapılan unikal ixtisas sayı: {filteredSpecialties.length}
        </div>

        <div className="hidden md:block">
            <Card>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-3/12">Təhsil Müəssisəsi</TableHead>
                            <TableHead className="w-4/12">İxtisas</TableHead>
                            <TableHead className="w-1/12 text-center">Qrup</TableHead>
                            <TableHead className="w-1/12 text-center">Tədris Dili</TableHead>
                            <TableHead className="w-1/12 text-center">Tədris Forması</TableHead>
                            <TableHead className="w-1/12 text-center">Ödəniş</TableHead>
                            {sortedYears.map((year, index) => (
                            <React.Fragment key={year}>
                                {index > 0 && <TableHead className="w-auto text-center px-1"></TableHead>}
                                <TableHead className="w-1/12 text-center">{year}</TableHead>
                            </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredSpecialties.length > 0 ? (
                        filteredSpecialties.sort((a, b) => (b.scores[2024] || 0) - (a.scores[2024] || 0)).map(spec => {
                            const uni = allUniversities.find(u => u.id === spec.universityId);
                            const grp = groups.find(g => g.id === spec.groupId);
                            const form = educationForms.find(f => f.id === spec.educationForm);
                            
                            return (
                                <TableRow key={spec.id} >
                                    <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => handleUniversityRowClick(spec.universityId)}>{uni ? uni.name : 'Naməlum'}</TableCell>
                                    <TableCell onClick={() => handleSpecialtyRowClick(spec)} className="cursor-pointer hover:underline">{spec.name}</TableCell>
                                    <TableCell className="text-center">{grp?.name.replace(' Qrup', '') || '-'}</TableCell>
                                    <TableCell className="text-center uppercase">{spec.educationLanguage}</TableCell>
                                    <TableCell className="text-center capitalize">{form?.name}</TableCell>
                                    <TableCell className="text-center capitalize">
                                        <Badge variant={spec.paymentType === 'ödənişli' ? 'secondary' : 'default'}>
                                            {spec.paymentType}
                                        </Badge>
                                    </TableCell>
                                    {sortedYears.map((year, index) => {
                                        const currentScore = spec.scores[year];
                                        const prevYear = sortedYears[index - 1];
                                        const prevScore = prevYear ? spec.scores[prevYear] : undefined;
                                        let scoreChange: 'up' | 'down' | null = null;
                                        if (currentScore != null && prevScore != null) {
                                            if(currentScore > prevScore) scoreChange = 'up';
                                            if(currentScore < prevScore) scoreChange = 'down';
                                        }

                                        return (
                                            <React.Fragment key={year}>
                                                {index > 0 && (
                                                    <TableCell className="w-auto text-center px-1">
                                                        {scoreChange === 'up' && <ArrowUp className="w-4 h-4 text-red-500 mx-auto" />}
                                                        {scoreChange === 'down' && <ArrowDown className="w-4 h-4 text-green-500 mx-auto" />}
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-center font-mono">
                                                    {currentScore ? currentScore.toFixed(1) : spec.scores.hasOwnProperty(year) ? 'Müsabiqə' : '-'}
                                                </TableCell>
                                            </React.Fragment>
                                        )
                                    })}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6 + sortedYears.length + (sortedYears.length > 1 ? sortedYears.length - 1 : 0)} className="text-center h-24">
                                Axtarışınıza uyğun nəticə tapılmadı.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </Card>
        </div>

        <div className="md:hidden space-y-4">
            {filteredSpecialties.length > 0 ? (
                filteredSpecialties.sort((a, b) => (b.scores[2024] || 0) - (a.scores[2024] || 0)).map(spec => {
                    const uni = allUniversities.find(u => u.id === spec.universityId);
                    const grp = groups.find(g => g.id === spec.groupId);
                    const form = educationForms.find(f => f.id === spec.educationForm);
                    const latestYear = Math.max(...Object.keys(spec.scores).map(Number).filter(y => spec.scores[y] !== null));
                    const latestScore = spec.scores[latestYear];
                    
                    return (
                        <Card key={spec.id} className="overflow-hidden">
                             <CardHeader>
                                <CardTitle className="cursor-pointer hover:underline text-lg" onClick={() => handleUniversityRowClick(spec.universityId)}>
                                    {uni ? uni.name : 'Naməlum'}
                                </CardTitle>
                                <CardDescription className="cursor-pointer hover:underline" onClick={() => handleSpecialtyRowClick(spec)}>
                                    {spec.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center border-t pt-3">
                                    <span className="text-sm text-muted-foreground">Son Keçid Balı ({latestYear}):</span>
                                    <span className="font-bold text-lg">{latestScore ? latestScore.toFixed(1) : 'Müsabiqə'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div><span className="font-medium">Qrup:</span> {grp?.name.replace(' Qrup', '') || '-'}</div>
                                    <div><span className="font-medium">Forma:</span> <span className="capitalize">{form?.name}</span></div>
                                    <div><span className="font-medium">Dil:</span> <span className="uppercase">{spec.educationLanguage}</span></div>
                                    <div><span className="font-medium">Ödəniş:</span> <Badge variant={spec.paymentType === 'ödənişli' ? 'secondary' : 'default'} className="ml-1">{spec.paymentType}</Badge></div>
                                </div>
                                <div className="flex justify-around items-center border-t pt-3 mt-3">
                                     {sortedYears.map((year, index) => {
                                        const currentScore = spec.scores[year];
                                        const prevYear = sortedYears[index - 1];
                                        const prevScore = prevYear ? spec.scores[prevYear] : undefined;
                                        let scoreChange: 'up' | 'down' | null = null;
                                        if (currentScore != null && prevScore != null) {
                                            if(currentScore > prevScore) scoreChange = 'up';
                                            if(currentScore < prevScore) scoreChange = 'down';
                                        }

                                        return (
                                            <div key={year} className="flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground">{year}</span>
                                                <div className="flex items-center gap-1">
                                                     {index > 0 && (
                                                        <div className="w-4 h-4">
                                                            {scoreChange === 'up' && <ArrowUp className="w-4 h-4 text-red-500" />}
                                                            {scoreChange === 'down' && <ArrowDown className="w-4 h-4 text-green-500" />}
                                                        </div>
                                                    )}
                                                    <span className="font-mono text-base">
                                                      {currentScore ? currentScore.toFixed(1) : spec.scores.hasOwnProperty(year) ? 'M' : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                     })}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            ) : (
                 <Card>
                    <CardContent className="h-24 flex items-center justify-center">
                        Axtarışınıza uyğun nəticə tapılmadı.
                    </CardContent>
                </Card>
            )}
        </div>
      </div>

      <AlertDialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{selectedSpecialtyInfo?.name}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="text-left space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-4">
                            {selectedSpecialtyInfo?.info ? (
                                <>
                                    <div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2"><Info className="w-4 h-4" /> Tələb Olunan Bacarıqlar</h3>
                                        <p className="text-muted-foreground pl-6">{selectedSpecialtyInfo.info.skills}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2"><UniversityIcon className="w-4 h-4" /> Gələcək Karyera İmkanları</h3>
                                        <p className="text-muted-foreground pl-6">{selectedSpecialtyInfo.info.careers}</p>
                                    </div>
                                </>
                            ) : (
                                <p>Bu ixtisas haqqında əlavə məlumat tapılmadı.</p>
                            )}
                             {selectedSpecialtyInfo?.lang === 'en' && (
                                <div>
                                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                        İngilis Dilində Təhsilin Üstünlükləri
                                    </h3>
                                    <p className="text-muted-foreground pl-6">
                                        Bu ixtisası ingilis dilində təhsil almaq sizə beynəlxalq əmək bazarında rəqabət üstünlüyü qazandırır, ən son elmi mənbələrə və ədəbiyyatlara birbaşa çıxış imkanı yaradır və qlobal karyera qurmaq üçün geniş üfüqlər açır.
                                    </p>
                                </div>
                             )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsInfoDialogOpen(false)}>Bağla</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isUniversityInfoDialogOpen} onOpenChange={setIsUniversityInfoDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{selectedUniversityInfo?.name}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                         <div className="text-left space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-4">
                            {selectedUniversityInfo?.info ? (
                                <>
                                    <p className="text-muted-foreground">{selectedUniversityInfo.info.description}</p>
                                    {selectedUniversityInfo.info.tuitionInfo && (
                                        <div>
                                            <h3 className="font-semibold text-foreground">Təhsil Haqqı (2024/2025)</h3>
                                            <p className="text-muted-foreground">{selectedUniversityInfo.info.tuitionInfo}</p>
                                        </div>
                                    )}
                                    {selectedUniversityInfo.info.website && (
                                        <a href={selectedUniversityInfo.info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block mt-4">
                                            Rəsmi veb-sayta keçid
                                        </a>
                                    )}
                                </>
                                
                            ) : (
                                <p>Bu universitet haqqında məlumat tapılmadı.</p>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsUniversityInfoDialogOpen(false)}>Bağla</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
