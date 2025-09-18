'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Specialty } from '@/lib/types';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular-base64'; // Use the new reliable font

// Helper functions that are now self-contained within the PDF generator
const getUniversityName = (id: number, allUniversities: any[]) => {
    const university = allUniversities.find((u) => u.id === id);
    return university ? university.name : 'Naməlum';
};

const renderCost = (spec: Specialty) => {
    if (typeof spec.cost === 'number' && spec.cost > 0) return `${spec.cost} AZN`;
    return spec.cost || '-';
};

const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

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

interface PdfData {
    selectedList: Specialty[];
    userScore: number;
    allSpecialties: Specialty[];
    allUniversities: any[];
}

export const generateAndSavePDF = (data: PdfData) => {
    const { selectedList, userScore, allSpecialties, allUniversities } = data;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Add the Base64 font file to the virtual file system and register it
    doc.addFileToVFS('Roboto-Regular.ttf', robotoRegularBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    const getLanguagePhrase = (lang: string) => {
        const langMap: { [key: string]: string } = {
            'az': 'Azərbaycan dilində tədrisə',
            'en': 'İngilis dilində tədrisə',
            'ru': 'Rus dilində tədrisə',
            'tr': 'Türk dilində tədrisə'
        };
        return langMap[lang] || `${lang} tədrisinə`;
    };

    const addFooter = () => {
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100);
        const footerText1 = "Seçimlərinizdə uğurlar!";
        const footerText2 = "© Təhsil Bələdçisi | Məlumatlar Dövlət İmtahan Mərkəzinin (DİM) rəsmi mənbələrinə əsasən hazırlanmışdır. Buna baxmayaraq, ixtisas kodları və digər məlumatların dəqiqliyini yoxlamağınız tövsiyə olunur.";
        doc.text(footerText1, pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text(footerText2, pageWidth / 2, pageHeight - 10, { align: 'center' });
    };

    // --- PAGE 1: User's Selections ---
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(18);
    doc.text("Sizin Seçim Siyahınız", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Topladığınız bal: ${userScore}`, margin, 30);

    const userTableData = selectedList.map((spec, index) => [
        index + 1,
        spec.facultyCode,
        spec.name,
        getUniversityName(spec.universityId, allUniversities),
        spec.educationLanguage,
        capitalizeFirstLetter(spec.educationForm),
        spec.score || '-',
        renderCost(spec),
        spec.planCount || '-',
        `${calculateProbability(userScore, spec)}%`
    ]);

    autoTable(doc, {
        startY: 35,
        head: [['#', 'Kod', 'İxtisas', 'Universitet', 'Dil', 'Tədris Növü', 'Keçid Balı', 'Təhsil Haqqı', 'Plan Yeri', 'Şansınız']],
        body: userTableData,
        theme: 'grid',
        styles: { font: 'Roboto', fontStyle: 'normal', fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [40, 40, 40], textColor: 255, fontSize: 7, font: 'Roboto', fontStyle: 'normal' },
        margin: { left: margin, right: margin },
        didDrawPage: addFooter
    });

    // --- PAGE 2: Algorithm's Advice ---
    doc.addPage();
    doc.setFont('Roboto', 'normal'); 
    doc.setFontSize(18);
    doc.text("Təhsil Bələdçisinin Məsləhəti", pageWidth / 2, 20, { align: 'center' });
    
    const groupCounts = selectedList.reduce((acc, spec) => { acc[spec.groupId] = (acc[spec.groupId] || 0) + 1; return acc; }, {} as Record<string, number>);
    const dominantGroup = Object.keys(groupCounts).reduce((a, b) => groupCounts[a] > groupCounts[b] ? a : b, 'group-1');
    const dominantGroupId = dominantGroup.replace('group-', '');

    const subGroupCounts = selectedList.filter(s => s.groupId === dominantGroup && s.subGroupId).reduce((acc, spec) => { acc[spec.subGroupId!] = (acc[spec.subGroupId!] || 0) + 1; return acc; }, {} as Record<string, number>);
    const dominantSubGroup = Object.keys(subGroupCounts).length > 0 ? Object.keys(subGroupCounts).reduce((a, b) => subGroupCounts[a] > subGroupCounts[b] ? a : b) : null;

    const langCounts = selectedList.reduce((acc, spec) => { acc[spec.educationLanguage] = (acc[spec.educationLanguage] || 0) + 1; return acc; }, {} as Record<string, number>);
    let dominantLanguage = 'az';
    const langKeys = Object.keys(langCounts);
    if (langKeys.length === 1) {
        dominantLanguage = langKeys[0];
    } else if (langKeys.length > 1) {
        const sortedLangs = langKeys.sort((a, b) => langCounts[b] - langCounts[a]);
        if (langCounts[sortedLangs[0]] > selectedList.length / 2) {
             dominantLanguage = sortedLangs[0];
        }
    }

    doc.setFontSize(11);
    let subGroupText = dominantSubGroup ? `(${dominantSubGroup})` : '';
    let langPhrase = getLanguagePhrase(dominantLanguage);
    let adviceText = `Balınıza (${userScore}), seçimlərinizdə üstünlük təşkil edən ${dominantGroupId}. qrup ${subGroupText} və ${langPhrase} əsaslanan təkliflər:`
    doc.text(adviceText, margin, 30, { maxWidth: pageWidth - margin * 2 });

    const baseAdviceSpecialties = allSpecialties.filter(s => {
        const groupMatch = s.groupId === dominantGroup;
        const subGroupMatch = dominantSubGroup ? s.subGroupId === dominantSubGroup : true;
        const langMatch = s.educationLanguage === dominantLanguage;
        return groupMatch && subGroupMatch && langMatch && !selectedList.some(sel => sel.id === s.id);
    });

    let riskSpecialties = baseAdviceSpecialties.filter(s => s.score && s.score > userScore && s.score <= userScore + 35).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    let targetSpecialties = baseAdviceSpecialties.filter(s => s.score && s.score <= userScore && s.score > userScore - 25).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    let safeSpecialties = baseAdviceSpecialties.filter(s => s.score && s.score <= userScore - 25).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    let allAdvised: Specialty[] = [];
    allAdvised.push(...riskSpecialties.slice(0, 3));
    allAdvised.push(...targetSpecialties.slice(0, 12));
    allAdvised.push(...safeSpecialties.slice(0, 5));

    if (allAdvised.length < 20) {
        const remainingSpecialties = baseAdviceSpecialties.filter(s => !allAdvised.includes(s));
        const needed = 20 - allAdvised.length;
        allAdvised.push(...remainingSpecialties.slice(0, needed));
    }
    allAdvised = allAdvised.slice(0, 20);

    const adviceTableData = allAdvised.map((s, index) => {
      let category = 'Təhlükəsiz';
      if (s.score && s.score > userScore) category = 'Riskli';
      else if (s.score && s.score > userScore - 25) category = 'Hədəf';
      return [
        index + 1,
        s.facultyCode,
        s.name,
        getUniversityName(s.universityId, allUniversities),
        s.educationLanguage,
        capitalizeFirstLetter(s.educationForm),
        s.score || '-',
        renderCost(s),
        s.planCount || '-',
        category
      ];
    });

    autoTable(doc, {
        startY: 45, 
        head: [['#', 'Kod', 'İxtisas Adı', 'Universitet', 'Dil', 'Tədris Növü', 'Keçid Balı', 'Təhsil Haqqı', 'Plan Yeri', 'Kateqoriya']],
        body: adviceTableData,
        theme: 'grid',
        styles: { font: 'Roboto', fontStyle: 'normal', fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [22, 163, 74], textColor: 255, fontSize: 7, font: 'Roboto', fontStyle: 'normal' },
        margin: { left: margin, right: margin },
        didDrawPage: addFooter
    });

    doc.save(`ixtisas_secimi_${userScore}_bal.pdf`);
};