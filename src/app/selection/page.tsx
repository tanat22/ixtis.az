'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Added import for Link
import { useSelection } from '@/context/SelectionContext';
import { SpecialtySelector } from '@/components/ui/SpecialtySelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileDown, Trash2, XCircle } from 'lucide-react';
import { universities } from '@/lib/data/universities';
import { generateAndSavePDF } from '@/lib/pdfGenerator';
import { getAllSpecialties } from '@/lib/data';
import { AnalysisModal } from '@/components/ui/AnalysisModal';
import type { Specialty } from '@/lib/types';

export default function SelectionPage() {
  const { selectedList, removeFromSelection, userScore, clearSelection } = useSelection();
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);

  const getUniversityName = (id: number) => {
    const university = universities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum';
  };

  const handleGeneratePdf = async () => {
    const allSpecialties = await getAllSpecialties();
    generateAndSavePDF({
        selectedList,
        userScore,
        allSpecialties,
        allUniversities: universities,
    });
  };

  const handleOpenAnalysisModal = () => {
    if (selectedList.length > 0 && userScore > 0) {
        setAnalysisModalOpen(true);
    }
  };

  const renderTypeBadge = (spec: Specialty) => {
    const type = spec.educationType;
    if (type === 'YDS' || type === 'DH') return <Badge variant="success">{type}</Badge>;
    if (type === 'YÖ') return <Badge variant="destructive">{type}</Badge>;
    if (type === 'Dövlət sifarişli') return <Badge variant="success">DS</Badge>;
    if (type === 'Ödənişli') return <Badge variant="info">Ödənişli</Badge>;
    return <Badge variant="secondary">-</Badge>;
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) return `${spec.cost} AZN`;
    if (typeof spec.cost === 'string' && spec.cost.trim() !== '') return `${spec.cost} AZN`;
    return '-';
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 dark:bg-gray-950">
      <AnalysisModal 
        isOpen={isAnalysisModalOpen} 
        onClose={() => setAnalysisModalOpen(false)} 
        onComplete={handleGeneratePdf} 
      />
      <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90">Seçim Səbəti</h1>
          <p className="mt-2 text-muted-foreground">Aşağıdakı cədvəldə seçdiyiniz ixtisasları görə bilərsiniz.</p>
        </header>

        <Card className="mb-8">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Seçilmiş İxtisaslar</CardTitle>
              <CardDescription>Siyahınıza {selectedList.length} ixtisas əlavə etmisiniz. (Maksimum 20)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <Button 
                 onClick={handleOpenAnalysisModal}
                 disabled={selectedList.length === 0 || !userScore || userScore === 0}
                 size='lg' 
                 className='bg-blue-600 hover:bg-blue-700 text-white shadow-md'>
                 <FileDown className="mr-2 h-5 w-5" />
                 Sizin seçiminiz + Bizim təklifimiz (PDF)
               </Button>
               {selectedList.length > 0 && (
                    <Button onClick={clearSelection} variant="destructive" size="lg">
                        <Trash2 className="mr-2 h-5 w-5"/> Bütün Siyahını Təmizlə
                    </Button>
               )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İxtisas</TableHead>
                  <TableHead>Təhsil Müəssisəsi</TableHead>
                  <TableHead className="text-center">Qrup</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                  <TableHead className="text-center">Tədris Növü</TableHead>
                  <TableHead className="text-center">Növ</TableHead>
                  <TableHead className="text-center">Keçid Balı</TableHead>
                  <TableHead className="text-center">Təhsil Haqqı</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedList.length > 0 ? (
                  selectedList.map((spec) => (
                    <TableRow key={spec.id}>
                      <TableCell className="font-medium">
                        <Link href={`/faculty/${spec.slug}`} className="hover:underline">
                          {spec.name}
                        </Link>
                      </TableCell>
                      <TableCell>{getUniversityName(spec.universityId)}</TableCell>
                      <TableCell className="text-center">{spec.subGroupId ? spec.subGroupId : spec.groupId.replace('group-', '')}</TableCell>
                      <TableCell className="text-center font-mono">{spec.planCount ?? '-'}</TableCell>
                      <TableCell className="text-center">{capitalizeFirstLetter(spec.educationForm)}</TableCell>
                      <TableCell className="text-center">{renderTypeBadge(spec)}</TableCell>
                      <TableCell className="text-center font-mono">{spec.score ?? '-'}</TableCell>
                      <TableCell className="text-center font-mono">{renderCost(spec)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeFromSelection(spec.id)}>
                          <XCircle className="h-5 w-5 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                      Hələ ki, heç bir ixtisas seçməmisiniz. <br /> Əsas səhifədən seçim etməyə başlaya bilərsiniz.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yeni İxtisaslar Əlavə Et</CardTitle>
            <CardDescription>Axtarışa davam edərək siyahınıza yeni ixtisaslar əlavə edə bilərsiniz. Mövcud filtrləriniz burada tətbiq olunur.</CardDescription>
          </CardHeader>
          <CardContent className='p-0 sm:p-0 md:p-0'>
             <SpecialtySelector 
                showTitle={false} 
                showSelectButton={true} 
                showCodeColumn={false}
                showFilters={false}
             />
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
