
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { specialties, universities, groups, subgroups, levels, years, educationForms } from '@/lib/data';
import type { Specialty } from '@/lib/types';

export default function InteractiveGuidePage() {
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<Specialty[]>(specialties);
  const [year, setYear] = React.useState('all');
  const [level, setLevel] = React.useState('all');
  const [university, setUniversity] = React.useState('all');
  const [group, setGroup] = React.useState('all');
  const [subgroup, setSubgroup] = React.useState('all');
  const [educationForm, setEducationForm] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [score, setScore] = React.useState(700);

  const availableSubgroups = React.useMemo(() => {
    if (group === 'grp-1' || group === 'grp-3') {
      return subgroups.filter(sg => sg.groupId === group);
    }
    return [];
  }, [group]);

  React.useEffect(() => {
    // Reset subgroup when group changes
    setSubgroup('all');
  }, [group]);


  React.useEffect(() => {
    const results = specialties.filter(s => {
        const universityName = universities.find(u => u.id === s.universityId)?.name || '';
        const hasSubgroup = s.groupId === 'grp-1' || s.groupId === 'grp-3';

        return (
            (year === 'all' || s.year.toString() === year) &&
            (level === 'all' || s.level === level) &&
            (university === 'all' || s.universityId === university) &&
            (group === 'all' || s.groupId === group) &&
            (educationForm === 'all' || s.educationForm === educationForm) &&
            (!hasSubgroup || subgroup === 'all' || s.subgroupId === subgroup) &&
            (s.name.toLowerCase().includes(search.toLowerCase()) || universityName.toLowerCase().includes(search.toLowerCase())) &&
            (s.score ? s.score <= score : true)
        )
    });
    setFilteredSpecialties(results);
  }, [year, level, university, group, subgroup, educationForm, search, score]);


  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">İnteraktiv Təhsil Bələdçisi</h1>
            <p className="text-muted-foreground mt-2">2025-ci il üzrə keçid ballarını kəşf edin</p>
        </header>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Filtrlər</CardTitle>
                <CardDescription>Axtarışınızı dəqiqləşdirmək üçün filtrlərdən istifadə edin.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">İl</label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger><SelectValue placeholder="İl" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Bütün İllər</SelectItem>
                                {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Təhsil Səviyyəsi</label>
                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger><SelectValue placeholder="Təhsil Səviyyəsi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Bütün Səviyyələr</SelectItem>
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
                     <div className="space-y-2">
                        <label className="text-sm font-medium">İxtisas Qrupu</label>
                         <Select value={group} onValueChange={setGroup}>
                            <SelectTrigger><SelectValue placeholder="İxtisas Qrupu" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Bütün Qruplar</SelectItem>
                                {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {availableSubgroups.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Altqrup</label>
                            <Select value={subgroup} onValueChange={setSubgroup}>
                                <SelectTrigger><SelectValue placeholder="Altqrup seçin" /></SelectTrigger>
                                <SelectContent>
                                   {group !== 'grp-1' && <SelectItem value="all">Hamısı</SelectItem>}
                                    {availableSubgroups.map(sg => <SelectItem key={sg.id} value={sg.id}>{sg.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
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
                    <div className="space-y-2 lg:col-span-2 xl:col-span-1">
                         <label htmlFor="search" className="text-sm font-medium">İxtisas üzrə axtarış</label>
                         <Input
                            id="search"
                            placeholder="İxtisas adı..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
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
            Tapılan ixtisas sayı: {filteredSpecialties.length}
        </div>

        <Card>
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/12 text-center">İl</TableHead>
                        <TableHead className="w-3/12">Təhsil Müəssisəsi</TableHead>
                        <TableHead className="w-4/12">İxtisas</TableHead>
                        <TableHead className="w-1/12 text-center">Qrup</TableHead>
                        <TableHead className="w-1/12 text-center">Tədris Dili</TableHead>
                        <TableHead className="w-1/12 text-center">Tədris Forması</TableHead>
                        <TableHead className="w-1/12 text-center">Plan</TableHead>
                        <TableHead className="w-1/12 text-center">Ödəniş</TableHead>
                        <TableHead className="w-1/12 text-right">Keçid Balı</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {filteredSpecialties.length > 0 ? (
                    filteredSpecialties.sort((a, b) => (b.score || 0) - (a.score || 0)).map(spec => {
                        const uni = universities.find(u => u.id === spec.universityId);
                        const grp = groups.find(g => g.id === spec.groupId);
                        const form = educationForms.find(f => f.id === spec.educationForm);
                        return (
                            <TableRow key={spec.id}>
                                <TableCell className="text-center">{spec.year}</TableCell>
                                <TableCell className="font-medium">{uni ? uni.name : 'Naməlum'}</TableCell>
                                <TableCell>{spec.name}</TableCell>
                                <TableCell className="text-center">{grp ? grp.name : '-'}</TableCell>
                                <TableCell className="text-center uppercase">{spec.educationLanguage}</TableCell>
                                <TableCell className="text-center capitalize">{form?.name}</TableCell>
                                <TableCell className="text-center">{spec.planCount}</TableCell>
                                <TableCell className="text-center capitalize">
                                    <Badge variant={spec.paymentType === 'ödənişli' ? 'secondary' : 'default'}>
                                        {spec.paymentType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">{spec.score ? spec.score.toFixed(1) : 'Müsabiqə'}</TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center h-24">
                            Axtarışınıza uyğun nəticə tapılmadı.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
        </Card>
      </div>
    </div>
  );
}
