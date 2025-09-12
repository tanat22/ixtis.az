

'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import type { Specialty, Group } from '@/lib/types';
import { getAllSpecialties } from '@/lib/data';
import { universities } from '@/lib/data/universities';
import { getAllGroups } from '@/lib/data/groups';
import { Skeleton } from '@/components/ui/skeleton';

export default function InteractiveGuidePage() {
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = React.useState<
    Specialty[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Filters State
  const [educationLevel, setEducationLevel] = React.useState<
    'bachelor' | 'master' | 'college'
  >('bachelor');
  const [educationLang, setEducationLang] = React.useState<'az' | 'ru' | 'en' | 'tr' | 'all'>('all');
  const [selectedGroup, setSelectedGroup] = React.useState('all');
  const [selectedUniversity, setSelectedUniversity] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [educationForms, setEducationForms] = React.useState<string[]>(['əyani']);
  const [educationTypes, setEducationTypes] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [specialtiesData, groupsData] = await Promise.all([
        getAllSpecialties(),
        getAllGroups(),
      ]);
      setSpecialties(specialtiesData);
      setGroups(groupsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    const applyFilters = () => {
      let tempSpecialties = specialties.filter(s => s.level === educationLevel);
      
      if (educationLang && educationLang !== 'all') {
          tempSpecialties = tempSpecialties.filter(s => s.educationLanguage === educationLang);
      }

      if (educationLevel === 'bachelor') {
        if (selectedGroup !== 'all') {
            tempSpecialties = tempSpecialties.filter(
            (s) => s.groupId === selectedGroup
            );
        }
      }

      // University Filter
      if (selectedUniversity !== 'all') {
        tempSpecialties = tempSpecialties.filter(
          (s) => s.universityId === parseInt(selectedUniversity, 10)
        );
      }

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        tempSpecialties = tempSpecialties.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Education Form Filter
      if (educationForms.length > 0) {
        tempSpecialties = tempSpecialties.filter((s) =>
          educationForms.includes(s.educationForm)
        );
      }

      // Education Type Filter
      if (educationTypes.length > 0) {
        tempSpecialties = tempSpecialties.filter((s) =>
          educationTypes.includes(s.educationType)
        );
      }

      setFilteredSpecialties(tempSpecialties);
    };

    if (!loading) {
      applyFilters();
    }
  }, [
    specialties,
    educationLevel,
    educationLang,
    selectedGroup,
    selectedUniversity,
    searchQuery,
    educationForms,
    educationTypes,
    loading,
  ]);

  const handleFormChange = (form: 'əyani' | 'qiyabi') => {
    setEducationForms((prev) =>
      prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]
    );
  };

  const handleTypeChange = (type: 'Dövlət sifarişli' | 'Ödənişli') => {
    setEducationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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

const renderTypeBadge = (spec: Specialty) => {
    const cost = spec.cost;
    const type = spec.educationType;

    if (cost === 'YDS' || cost === 'DH') {
        return <Badge variant="success">{cost}</Badge>;
    }
    if (cost === 'YÖ') {
        return <Badge variant="info">{cost}</Badge>;
    }
    if (type === 'Dövlət sifarişli') {
        return <Badge variant="success">DS</Badge>;
    }
    if (type === 'Ödənişli') {
        return <Badge variant="info">Ödənişli</Badge>;
    }
    return <Badge variant="secondary">-</Badge>;
};


  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
            İnteraktiv Təhsil Bələdçisi
          </h1>
          <p className="mt-2 text-muted-foreground">
            İxtisasları kəşf edin, filtrlərlə axtarışınızı dəqiqləşdirin.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrlər</CardTitle>
            <CardDescription>
              Axtarışınızı dəqiqləşdirmək üçün filtrlərdən istifadə edin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Education Level and Language */}
              <div className="space-y-2">
                <Label>Təhsil Səviyyəsi və Dili</Label>
                <div className="flex gap-2">
                  <RadioGroup
                    value={educationLevel}
                    onValueChange={(value) =>
                      setEducationLevel(value as 'bachelor' | 'master' |'college')
                    }
                    className="flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bachelor" id="bachelor" />
                      <Label htmlFor="bachelor">Bakalavriat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="master" id="master" />
                      <Label htmlFor="master">Magistratura</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="college" id="college" disabled />
                      <Label htmlFor="college" className="text-muted-foreground">Orta ixtisas (tezliklə)</Label>
                    </div>
                  </RadioGroup>
                  <Select
                    value={educationLang}
                    onValueChange={(value) =>
                      setEducationLang(value as 'az' | 'ru' | 'en' | 'tr' | 'all')
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      <SelectItem value="az">AZ</SelectItem>
                      <SelectItem value="ru">RU</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="tr">TR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Group and University */}
              <div className="space-y-2">
                <Label htmlFor="group-select">İxtisas Qrupu</Label>
                <Select
                  onValueChange={setSelectedGroup}
                  defaultValue="all"
                  disabled={educationLevel !== 'bachelor'}
                >
                  <SelectTrigger id="group-select">
                    <SelectValue placeholder="Bütün Qruplar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün Qruplar</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="university-select">Təhsil Müəssisəsi</Label>
                <Select onValueChange={setSelectedUniversity} defaultValue="all">
                  <SelectTrigger id="university-select">
                    <SelectValue placeholder="Bütün Müəssisələr" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün Müəssisələr</SelectItem>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={String(uni.id)}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Search by Name */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="search-query">İxtisas Adı ilə Axtar</Label>
                <Input
                  id="search-query"
                  placeholder="Məsələn, Kompüter mühəndisliyi"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Education Form and Type */}
              <div className="flex gap-6 pt-2">
                <div className="space-y-2">
                  <Label>Təhsil Forması</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="form-ayani"
                      checked={educationForms.includes('əyani')}
                      onCheckedChange={() => handleFormChange('əyani')}
                    />
                    <Label htmlFor="form-ayani">Əyani</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="form-qiyabi"
                      checked={educationForms.includes('qiyabi')}
                      onCheckedChange={() => handleFormChange('qiyabi')}
                    />
                    <Label htmlFor="form-qiyabi">Qiyabi</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Təhsil Növü</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-state"
                      checked={educationTypes.includes('Dövlət sifarişli')}
                      onCheckedChange={() =>
                        handleTypeChange('Dövlət sifarişli')
                      }
                    />
                    <Label htmlFor="type-state">Dövlət sifarişli</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-paid"
                      checked={educationTypes.includes('Ödənişli')}
                      onCheckedChange={() => handleTypeChange('Ödənişli')}
                    />
                    <Label htmlFor="type-paid">Ödənişli</Label>
                  </div>
                </div>
              </div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>İxtisas</TableHead>
                  <TableHead>Təhsil Müəssisəsi</TableHead>
                  <TableHead className="text-center">Keçid Balı</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                   <TableHead className="text-center">Növ</TableHead>
                  <TableHead className="text-right">
                    İllik Təhsil Haqqı
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                       <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-56" /></TableCell>
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
                        <Link href={`/faculty/${spec.slug}`} className="hover:underline">
                            {spec.name}
                        </Link>
                         <Badge
                          variant="outline"
                          className="uppercase ml-2"
                        >
                          {spec.educationLanguage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getUniversityName(spec.universityId)}
                      </TableCell>
                       <TableCell className="text-center font-mono">
                        {spec.score ?? '-'}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {spec.planCount ?? '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderTypeBadge(spec)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                         {renderCost(spec)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Seçilmiş filtrlərə uyğun nəticə tapılmadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

