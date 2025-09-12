

'use server';

import type { Specialty, UniversityInfo, FacultyDetails } from '@/lib/types';
import { allInstitutions, universities, colleges } from './data/universities';
import costDataSource from '@/../elmir/cost_data.json';
import group1DataSource from '@/../elmir/group1_clean_data.json';
import masterDataSource from '@/../elmir/magistr_az_2025.json';
import uniInfoNotes from '@/../elmir/uni_info.json';


const subgroupMap: { [key: string]: string } = {
  "RK": "sub-1-rk",
  "Rİ": "sub-1-ri",
  "DT": "sub-3-dt",
  "TC": "sub-3-tc",
};

const universityNameToIdMap = new Map(allInstitutions.map(u => [u.name.trim().toLowerCase().replace(/“|”/g, '').replace(/"/g, ''), u.id]));

function getUniversityId(uniName: string): number | undefined {
    const trimmedName = uniName.trim().toLowerCase().replace(/“|”|"/g, '');
    
    // Exact match first
    if (universityNameToIdMap.has(trimmedName)) {
        return universityNameToIdMap.get(trimmedName);
    }

    // Fallback for names that might include extra text like "(gəncə şəhəri)"
     for (const [name, id] of universityNameToIdMap.entries()) {
        if (trimmedName.startsWith(name)) {
            return id;
        }
    }
    
    console.warn(`Could not find university ID for: "${uniName}"`);
    return undefined;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/\(/g, '') // Remove (
    .replace(/\)/g, '')  // Remove )
    .replace(/,/g, '')   // Remove commas
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};


export async function getAllSpecialties(): Promise<Specialty[]> {
  const costAndPlanMap = new Map<string, { cost: any; planCount: number | null }>();
  (costDataSource as any[]).forEach(item => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    if (!isNaN(facultyCode)) {
      costAndPlanMap.set(String(facultyCode), {
        cost: item.cost,
        planCount: item.planned_places && !isNaN(parseInt(item.planned_places)) ? parseInt(item.planned_places) : null,
      });
    }
  });

  const finalSpecialties: Specialty[] = [];

  // Process Bachelor Specialties from group1DataSource
  (group1DataSource as any[]).forEach((item: any) => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    const universityId = getUniversityId(item.Uni_ad);
    
    if (isNaN(facultyCode) || universityId === undefined) {
      console.warn("Skipping invalid bachelor entry from group1_clean_data:", item);
      return;
    }
    
    const costData = costAndPlanMap.get(String(facultyCode)) || { cost: null, planCount: null };
    const costType = costData.cost;
    const specialtyName = item['Fakulte adi'].replace(/\s*\(.*\)\s*/g, '').trim();


    const subgroupIdRaw = item.subgroup?.replace(/I \((R[İ|K])\)/, '$1').trim() ?? '';
    const groupNumber = item.group ? `group-${item.group}` : 'group-unknown';


    const baseSpecialty = {
      facultyCode: facultyCode,
      year: item.il || 2025,
      name: specialtyName,
      slug: slugify(specialtyName),
      universityId: universityId,
      groupId: groupNumber,
      subgroupId: subgroupMap[subgroupIdRaw] || groupNumber,
      level: 'bachelor' as const,
      educationForm: item.Tedris_novu === 'Q' ? 'qiyabi' as const : 'əyani' as const,
      educationLanguage: item.Tedris_dili as 'az' | 'ru' | 'en' | 'tr',
      planCount: costData.planCount,
      cost: !isNaN(parseFloat(costType)) && parseFloat(costType) > 0 ? parseFloat(costType) : costType,
    };
    
    const processEntry = (scoreString: string | number | null, type: 'Dövlət sifarişli' | 'Ödənişli') => {
        if (scoreString !== null && scoreString !== "" && scoreString !== "-") {
             finalSpecialties.push({
                ...baseSpecialty,
                id: `${facultyCode}_${type === 'Dövlət sifarişli' ? 'state' : 'paid'}`,
                educationType: type,
                score: !isNaN(parseFloat(String(scoreString))) ? parseFloat(String(scoreString)) : null,
            });
        }
    };
    
    if (costType === "YDS" || costType === "DH") {
      processEntry(item.dovlet_sifarisli || item.Odenisli, 'Dövlət sifarişli');
    } else if (costType === "YÖ") {
      processEntry(item.Odenisli || item.dovlet_sifarisli, 'Ödənişli');
    } else {
       processEntry(item.dovlet_sifarisli, 'Dövlət sifarişli');
       processEntry(item.Odenisli, 'Ödənişli');
    }
  });

  // Process Master Specialties
  (masterDataSource as any[]).forEach((item: any) => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    const universityId = getUniversityId(item.Uni_ad);

    if (isNaN(facultyCode) || universityId === undefined) {
      console.warn("Skipping invalid master entry:", item);
      return;
    }
    const specialtyName = item['Fakulte adi'].trim();

    const baseSpecialty = {
        facultyCode: facultyCode,
        year: item.il || 2025,
        name: specialtyName,
        slug: slugify(specialtyName),
        universityId: universityId,
        groupId: `group-master`,
        subgroupId: undefined,
        level: 'master' as const,
        educationForm: item.tedris_novu === 'Q' ? 'qiyabi' as const : 'əyani' as const,
        educationLanguage: item.tedris_dili as 'az' | 'ru' | 'en' | 'tr',
        planCount: null, 
        cost: null, 
    };

    const dsScore = parseFloat(item.dovlet_sifarisli);
    if (!isNaN(dsScore)) {
      finalSpecialties.push({
        ...baseSpecialty,
        id: `${facultyCode}_state`,
        educationType: 'Dövlət sifarişli',
        score: dsScore,
      });
    }

    const paidScore = parseFloat(item.odenisli);
    if (!isNaN(paidScore)) {
      finalSpecialties.push({
        ...baseSpecialty,
        id: `${facultyCode}_paid`,
        educationType: 'Ödənişli',
        score: paidScore,
      });
    }
  });


  return finalSpecialties;
}

export async function getUniversityInfo(): Promise<{ universities: UniversityInfo[], colleges: UniversityInfo[] }> {
    const notesMap = new Map<string, any[]>();
    (uniInfoNotes as any[]).forEach(note => {
        const uniNameKey = note.ali_tehsil_muessisesi.trim().toLowerCase().replace(/“|”|"/g, '');
        if (!notesMap.has(uniNameKey)) {
            notesMap.set(uniNameKey, []);
        }
        notesMap.get(uniNameKey)!.push(note);
    });
    
    const universityInfoList: UniversityInfo[] = await Promise.all(universities.map(async (uni) => {
        const uniNameKey = uni.name.trim().toLowerCase().replace(/“|”|"/g, '');
        let details = null;
        try {
            const detailsModule = await import(`@/../elmir/universities/${uni.id}.json`);
            details = detailsModule.default;
        } catch (e) {
             // It's okay if a file doesn't exist, it means details are not yet added.
        }

        return {
            ...uni,
            notes: notesMap.get(uniNameKey) || [],
            details: details,
        };
    }));

    // Sort universities: those with notes or details first, then alphabetically
    universityInfoList.sort((a, b) => {
        const aHasInfo = (a.notes && a.notes.length > 0) || a.details;
        const bHasInfo = (b.notes && b.notes.length > 0) || b.details;
        if (aHasInfo && !bHasInfo) return -1;
        if (!aHasInfo && bHasInfo) return 1;
        return a.name.localeCompare(b.name);
    });
    
    const collegeInfoList: UniversityInfo[] = await Promise.all(colleges.map(async (col) => {
        let details = null;
        try {
             const detailsModule = await import(`@/../elmir/universities/${col.id}.json`);
            details = detailsModule.default;
        } catch (e) {
            // It's okay if a file doesn't exist.
        }
        return {
            ...col,
            notes: [], // Currently no notes for colleges in uni_info.json
            details: details
        };
    }));

    return { universities: universityInfoList, colleges: collegeInfoList };
}

export async function getFacultyBySlug(slug: string): Promise<FacultyDetails | null> {
  try {
    const facultyModule = await import(`@/../elmir/faculties/${slug}.json`);
    return facultyModule.default as FacultyDetails;
  } catch (error) {
    console.error(`Could not load faculty data for slug: ${slug}`, error);
    return null;
  }
}
