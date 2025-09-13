'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelection } from '@/context/SelectionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, X, BarChart2, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { universities as allUniversities } from '@/lib/data/universities';
import type { Specialty } from '@/lib/types';
import { cn } from "@/lib/utils";

// PDF Generation
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to replace Azerbaijani characters with Latin equivalents for PDF
const latinize = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/ə/g, 'e').replace(/Ə/g, 'E')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ş/g, 's').replace(/Ş/g, 'S');
};

// Helper function to calculate admission probability
const calculateProbability = (userScore: number, specialtyScore: number | null | undefined): number => {
  if (userScore === 0 || specialtyScore === null || specialtyScore === undefined) {
    return 0;
  }
  const scoreDiff = userScore - specialtyScore;
  if (scoreDiff >= 20) return 99;
  if (scoreDiff > 0) return 80 + Math.round(scoreDiff / 20 * 19);
  if (scoreDiff > -20) return 40 + Math.round((scoreDiff + 20) / 20 * 40);
  if (scoreDiff > -50) return 10 + Math.round((scoreDiff + 50) / 30 * 30);
  return Math.max(1, Math.round(10 + (scoreDiff + 50) / 5));
};

// Helper function to calculate overall probability
const calculateOverallProbability = (probabilities: number[]): number => {
  if (probabilities.length === 0) return 0;
  const probOfNotGettingIntoAny = probabilities.reduce((acc, prob) => acc * (1 - prob / 100), 1);
  const overallProb = (1 - probOfNotGettingIntoAny) * 100;
  return Math.round(overallProb);
};


export default function SelectionPage() {
  const { selectedList, removeFromSelection, moveSelection, clearSelection, userScore } = useSelection();

  const getUniversityName = (id: number) => {
    const university = allUniversities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum';
  };

  const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) return `${spec.cost} AZN`;
    return spec.cost || '-';
  };
  
  const individualProbabilities = selectedList.map(spec => calculateProbability(userScore, spec.score));
  const overallAdmissionProbability = calculateOverallProbability(individualProbabilities);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text(latinize("İxtisas Seçim Nəticələri"), doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // User Info
    doc.setFontSize(12);
    doc.text(latinize(`Topladığınız bal: ${userScore}`), 14, 35);
    doc.text(latinize(`Ümumi qəbul olma ehtimalınız: ${overallAdmissionProbability}%`), 14, 42);

    // Create table
    const tableData = selectedList.map((spec, index) => [
      index + 1,
      spec.facultyCode,
      latinize(spec.name),
      latinize(getUniversityName(spec.universityId)),
      spec.score || '-',
      latinize(renderCost(spec)),
      `${calculateProbability(userScore, spec.score)}%`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['#', latinize('Kod'), latinize('İxtisas'), latinize('Universitet'), latinize('Keçid Balı'), latinize('Təhsil Haqqı'), 'Ehtimal']],
      body: tableData,
      styles: { halign: 'left', fontSize: 8 },
      headStyles: { halign: 'center', fillColor: [41, 128, 185], fontSize: 8 },
       columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        1: { halign: 'center', cellWidth: 15 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { halign: 'center', cellWidth: 20 },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 18 },
      },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = data.settings.margin;

        // Good luck message
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(latinize("Seçimlərinizdə uğurlar!"), pageWidth / 2, pageHeight - 20, { align: 'center' });

        // Disclaimer and Copyright
        doc.setFontSize(8);
        doc.setTextColor(150);
        const disclaimerText = latinize(
          "© Təhsil Bələdçisi | Məlumatlar Dövlət İmtahan Mərkəzinin (DİM) rəsmi mənbələrinə istinadən hazırlanmışdır. " +
          "Buna baxmayaraq, ixtisas kodları və digər məlumatların dəqiqliyini yoxlamağınız tövsiyə olunur."
        );
        // Corrected the x-coordinate to be the center of the page for proper alignment
        doc.text(disclaimerText, pageWidth / 2, pageHeight - 12, { 
          maxWidth: pageWidth - margin.left - margin.right,
          align: 'center' 
        });
      },
    });
    
    doc.save(latinize('secim_neticesi.pdf'));
  };

  if (selectedList.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-center">
         <Card className="py-20">
            <CardHeader>
                <BarChart2 className="mx-auto h-16 w-16 text-muted-foreground" />
                <CardTitle className="mt-4 text-2xl font-bold">Seçim Siyahınız Boşdur</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                Qəbul ehtimalınızı görmək üçün 'İxtisas Seçimi' səhifəsindən bəyəndiyiniz ixtisasları əlavə edin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/coding">
                    <Button>İxtisas Seçiminə Qayıt</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90 text-center">Seçim Siyahısı</h1>
        <p className="mt-2 text-muted-foreground text-center">
          Seçdiyiniz ixtisasları sıralayın və ümumi nəticənizi qiymətləndirin.
        </p>
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

      <div className="space-y-4">
        {selectedList.map((spec, index) => {
            const probability = calculateProbability(userScore, spec.score);
            return(
                <Card key={spec.id} className="relative overflow-hidden group">
                    <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => moveSelection(index, 'up')} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => moveSelection(index, 'down')} disabled={index === selectedList.length - 1}>
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
                                <span><span className="font-semibold">Kod:</span> {spec.facultyCode}</span>
                                <span><span className="font-semibold">Qrup:</span> {spec.subGroupId || spec.groupId.replace('group-','')}</span>
                                <span><span className="font-semibold">Keçid Balı:</span> {spec.score || '-'}</span>
                                <span><span className="font-semibold">Təhsil haqqı:</span> {renderCost(spec)}</span>
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
      
      {selectedList.length > 0 && (
         <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                PDF olaraq Endir
            </Button>
            <Button variant="destructive" onClick={clearSelection}>
                Siyahını Təmizlə
            </Button>
        </div>
      )}
    </div>
  );
}
