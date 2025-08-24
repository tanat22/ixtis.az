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
import { specialties, universities, groups, levels } from '@/lib/data';
import type { Specialty } from '@/lib/types';

export default function InteractiveGuidePage() {
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<Specialty[]>(specialties);
  const [level, setLevel] = React.useState('all');
  const [university, setUniversity] = React.useState('all');
  const [group, setGroup] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [score, setScore] = React.useState(700);

  React.useEffect(() => {
    const results = specialties.filter(s => {
        const universityName = universities.find(u => u.id === s.universityId)?.name || '';
        return (
            (level === 'all' || s.level === level) &&
            (university === 'all' || s.universityId === university) &&
            (group === 'all' || s.groupId === group) &&
            (s.name.toLowerCase().includes(search.toLowerCase()) || universityName.toLowerCase().includes(search.toLowerCase())) &&
            s.score <= score
        )
    });
    setFilteredSpecialties(results);
  }, [level, university, group, search, score]);


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
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
                            <SelectContent>
                                <SelectItem value="all">Bütün Təhsil Müəssisələri</SelectItem>
                                {universities.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
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
                    <div className="space-y-2 lg:col-span-2">
                         <label htmlFor="search" className="text-sm font-medium">İxtisas üzrə axtarış</label>
                         <Input
                            id="search"
                            placeholder="İxtisas adı..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="lg:col-span-5 space-y-2">
                         <label htmlFor="score" className="text-sm font-medium">Keçid Balı Diapazonu: {score}</label>
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Təhsil Müəssisəsi</TableHead>
                        <TableHead>İxtisas</TableHead>
                        <TableHead className="text-center">Qrup</TableHead>
                        <TableHead className="text-right">Keçid Balı</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {filteredSpecialties.length > 0 ? (
                    filteredSpecialties.map(spec => {
                        const uni = universities.find(u => u.id === spec.universityId);
                        const grp = groups.find(g => g.id === spec.groupId);
                        return (
                            <TableRow key={spec.id}>
                                <TableCell className="font-medium">{uni ? uni.name : 'Naməlum'}</TableCell>
                                <TableCell>{spec.name}</TableCell>
                                <TableCell className="text-center">{grp ? grp.name : '-'}</TableCell>
                                <TableCell className="text-right font-mono">{spec.score.toFixed(1)}</TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            Axtarışınıza uyğun nəticə tapılmadı.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </Card>
      </div>
    </div>
  );
}
