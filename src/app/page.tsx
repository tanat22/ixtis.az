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
import { specialties, universities, groups, subgroups, levels, educationForms, educationLanguages, years } from '@/lib/data';
import type { Specialty } from '@/lib/types';
import { specialtyInfo, type SpecialtyInfo } from '@/lib/data/specialty-info';
import { ArrowUp, ArrowDown } from 'lucide-react';

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
  const [selectedSpecialtyInfo, setSelectedSpecialtyInfo] = React.useState<{ name: string; info: SpecialtyInfo | null } | null>(null);

  const availableSubgroups = React.useMemo(() => {
    if (group === 'grp-1' || group === 'grp-3') {
      return subgroups.filter(sg => sg.groupId === group);
    }
    return [];
  }, [group]);

  const combinedSpecialties = React.useMemo(() => {
    const specialtyMap = new Map<string, CombinedSpecialty>();

    specialties.forEach(s => {
      const key = `${s.name}-${s.universityId}-${s.level}-${s.educationForm}-${s.educationLanguage}-${s.paymentType}-${s.groupId}-${s.subgroupId || ''}`;
      
      if (!specialtyMap.has(key)) {
        specialtyMap.set(key, {
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
        });
      }
      
      const combinedSpec = specialtyMap.get(key);
      if (combinedSpec) {
        combinedSpec.scores[s.year] = s.score;
      }
    });

    return Array.from(specialtyMap.values());
  }, []);
  
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
    return uniqueNames.sort((a,b) => a.localeCompare(b));
  }, [group, subgroup, level, combinedSpecialties]);


  React.useEffect(() => {
    if (availableSubgroups.length > 0 && subgroup === 'all') {
      // setSubgroup(availableSubgroups[0].id);
    } else if (availableSubgroups.length === 0) {
      setSubgroup('all');
    }
  }, [group, availableSubgroups, subgroup]);

  React.useEffect(() => {
    const results = combinedSpecialties.filter(s => {
      const universityName = universities.find(u => u.id === s.universityId)?.name || '';
      const latestYear = Math.max(...Object.keys(s.scores).map(Number).filter(y => s.scores[y] !== null));
      const latestScore = s.scores[latestYear];

      if (level === 'master' || level === 'college') {
           return (
              s.level === level &&
              (university === 'all' || s.universityId === university) &&
              (educationForm === 'all' || s.educationForm === educationForm) &&
              (educationLanguage === 'all' || s.educationLanguage === educationLanguage) &&
              (specialtyName === 'all' || s.name === specialtyName) &&
              (latestScore !== null && latestScore !== undefined ? latestScore <= score : true)
          )
      }

      const hasSubgroup = s.groupId === 'grp-1' || s.groupId === 'grp-3';

      return (
          (level === 'all' || s.level === level) &&
          (university === 'all' || s.universityId === university) &&
          (group === 'all' || s.groupId === group) &&
          (educationForm === 'all' || s.educationForm === educationForm) &&
          (educationLanguage === 'all' || s.educationLanguage === educationLanguage) &&
          (!hasSubgroup || subgroup === 'all' || s.subgroupId === subgroup) &&
          (specialtyName === 'all' || s.name === specialtyName) &&
          (latestScore !== null && latestScore !== undefined ? latestScore <= score : true)
      )
    });
    setFilteredSpecialties(results);
  }, [level, university, group, subgroup, educationForm, educationLanguage, specialtyName, score, combinedSpecialties]);

  const sortedYears = React.useMemo(() => years.sort((a,b) => a - b), []);

  const handleRowClick = (specialtyName: string) => {
    const info = specialtyInfo[specialtyName] || null;
    setSelectedSpecialtyInfo({ name: specialtyName, info });
    setIsInfoDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">İnteraktiv Təhsil Bələdçisi</h1>
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
                        <label className="text-sm font-medium">Universitet/Kollec</label>
                         <Select value={university} onValueChange={setUniversity}>
                            <SelectTrigger><SelectValue placeholder="Universitet/Kollec" /></SelectTrigger>
                            <SelectContent className="max-h-80">
                                <SelectItem value="all">Bütün Təhsil Müəssisələri</SelectItem>
                                {universities.sort((a, b) => a.name.localeCompare(b.name)).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
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
                        const uni = universities.find(u => u.id === spec.universityId);
                        const grp = groups.find(g => g.id === spec.groupId);
                        const form = educationForms.find(f => f.id === spec.educationForm);
                        
                        return (
                            <TableRow key={spec.id} onClick={() => handleRowClick(spec.name)} className="cursor-pointer">
                                <TableCell className="font-medium">{uni ? uni.name : 'Naməlum'}</TableCell>
                                <TableCell>{spec.name}</TableCell>
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

      <AlertDialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{selectedSpecialtyInfo?.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {selectedSpecialtyInfo?.info ? (
                            <div className="text-left space-y-4 mt-4">
                                <div>
                                    <h3 className="font-semibold text-foreground">Tələb Olunan Bacarıqlar</h3>
                                    <p className="text-muted-foreground">{selectedSpecialtyInfo.info.skills}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Gələcək Karyera İmkanları</h3>
                                    <p className="text-muted-foreground">{selectedSpecialtyInfo.info.careers}</p>
                                </div>
                            </div>
                        ) : (
                            "Bu ixtisas haqqında əlavə məlumat tapılmadı."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsInfoDialogOpen(false)}>Bağla</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
