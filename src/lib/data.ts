'use server';

import type { Specialty, UniversityInfo, FacultyDetails } from '@/lib/types';
import { allInstitutions, universities, colleges } from './data/universities';
import masterDataSource from '@/../elmir/magistr_az_2025.json';
import uniInfoNotes from '@/../elmir/uni_info.json';
import bachelorDataSource from '@/../elmir/2025_bakalavr_az.json';
import subgroupDataSource from '@/../elmir/subgroup_faculty.json';
import costDataSource from '@/../elmir/cost_data.json'; // Import the new cost data

// Helper to create a consistent mapping key
const normalizeString = (str: string) => str.trim().toLowerCase();

// --- Create a lookup map for cost and planned places from cost_data.json ---
const costMap = new Map<number, { cost: number | string; planned_places: number | null }>();
(costDataSource as { Fakulte_kodu: number; cost: any; planned_places: any }[]).forEach(item => {
    const facultyCode = Number(item.Fakulte_kodu);
    if (!isNaN(facultyCode)) {
        costMap.set(facultyCode, {
            cost: item.cost,
            planned_places: !isNaN(parseInt(item.planned_places)) ? parseInt(item.planned_places) : null
        });
    }
});


// --- Create a lookup map for subgroups ---
const subgroupMap = new Map<string, string>();
(subgroupDataSource as { ixtisas: string; ixtisas_alt_qrupu: string }[]).forEach(item => {
    const cleanSpecialtyName = item.ixtisas.replace('*', '').trim();
    subgroupMap.set(normalizeString(cleanSpecialtyName), item.ixtisas_alt_qrupu);
});

const universityNameToIdMap = new Map(allInstitutions.map(u => [normalizeString(u.name.replace(/[“”"]/g, '')), u.id]));

function getUniversityId(uniName: string): number | undefined {
    if (!uniName) return undefined;
    const normalizedInputName = normalizeString(uniName.replace(/[“”"]/g, ''));

    // 1. First, try for a direct, exact match
    if (universityNameToIdMap.has(normalizedInputName)) {
        return universityNameToIdMap.get(normalizedInputName);
    }

    // 2. If not, check if any official name *contains* the input name
    for (const [officialName, id] of universityNameToIdMap.entries()) {
        if (officialName.includes(normalizedInputName)) {
            return id;
        }
    }
    
    // 3. As a fallback, check if the input name contains an official name (e.g. input is longer)
    for (const [officialName, id] of universityNameToIdMap.entries()) {
        if (normalizedInputName.includes(officialName)) {
            return id;
        }
    }

    console.warn(`Could not find university ID for: \"${uniName}\"`);
    return undefined;
}

const slugify = (text: string) => {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/,/g, '')
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c')
    .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
};

export async function getAllSpecialties(): Promise<Specialty[]> {
  const finalSpecialties: Specialty[] = [];

  (bachelorDataSource as any[]).forEach((item, index) => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    const universityId = getUniversityId(item.Uni_ad);
    const specialtyNameRaw = item['İxtisasın adı'] || item['Fakulte adi'];

    if (isNaN(facultyCode) || !universityId || !specialtyNameRaw) {
      return; // Skip invalid records
    }

    const specialtyName = String(specialtyNameRaw).trim();
    const subGroupId = subgroupMap.get(normalizeString(specialtyName));

    // --- Get cost and plan count from the new map ---
    const costInfo = costMap.get(facultyCode);
    
    const baseSpecialty = {
      facultyCode: facultyCode,
      year: item.il || 2025,
      name: specialtyName,
      note: item.qeyd ? String(item.qeyd).trim() : undefined,
      slug: slugify(specialtyName),
      universityId: universityId,
      groupId: `group-${item.group}`,
      subGroupId: subGroupId, 
      level: 'bachelor' as const,
      educationForm: item.Tedris_novu === 'Q' ? 'qiyabi' as const : 'əyani' as const,
      educationLanguage: item.Tedris_dili,
      // Use data from cost_data.json if available, otherwise fallback to original data or null
      planCount: costInfo?.planned_places ?? (item.plan_count && !isNaN(parseInt(item.plan_count)) ? parseInt(item.plan_count) : null),
      cost: costInfo?.cost ?? (!isNaN(parseFloat(String(item.cost))) && parseFloat(String(item.cost)) > 0 ? parseFloat(String(item.cost)) : item.cost),
    };

    const processEntry = (scoreString: string | number | null, type: 'Dövlət sifarişli' | 'Ödənişli') => {
        const score = parseFloat(String(scoreString));
        if (scoreString !== null && scoreString !== "" && scoreString !== "-" && !isNaN(score)) {
             finalSpecialties.push({
                ...baseSpecialty,
                id: `${facultyCode}_${type.replace(/\s+/g, '_')}`,
                educationType: type,
                score: score,
            });
        }
    };
    
    // If there is no score data in the main file, create a single entry using cost_data.json info
    if ((item.dovlet_sifarisli === null || item.dovlet_sifarisli === "" || item.dovlet_sifarisli === "-") && 
        (item.Odenisli === null || item.Odenisli === "" || item.Odenisli === "-")) {
        
        const educationType = (baseSpecialty.cost === 'YDS' || baseSpecialty.cost === 'DH') ? 'Dövlət sifarişli' : 'Ödənişli';

        finalSpecialties.push({
            ...baseSpecialty,
            id: `${facultyCode}_${educationType.replace(/\s+/g, '_')}`,
            educationType: educationType,
            score: null, // No score info in this case
        });
    } else {
        processEntry(item.dovlet_sifarisli, 'Dövlət sifarişli');
        processEntry(item.Odenisli, 'Ödənişli');
    }
  });

  // Master's data processing remains the same
  (masterDataSource as any[]).forEach((item) => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    const universityId = getUniversityId(item.Uni_ad);
    const specialtyName = item['Fakulte adi']?.trim();

    if (isNaN(facultyCode) || !universityId || !specialtyName) {
      return;
    }

    const costInfo = costMap.get(facultyCode);

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
        educationLanguage: item.tedris_dili,
        planCount: costInfo?.planned_places ?? null, 
        cost: costInfo?.cost ?? null, 
    };

    const dsScore = parseFloat(item.dovlet_sifarisli);
    if (!isNaN(dsScore)) {
      finalSpecialties.push({ ...baseSpecialty, id: `${facultyCode}_state`, educationType: 'Dövlət sifarişli', score: dsScore });
    }

    const paidScore = parseFloat(item.odenisli);
    if (!isNaN(paidScore)) {
      finalSpecialties.push({ ...baseSpecialty, id: `${facultyCode}_paid`, educationType: 'Ödənişli', score: paidScore });
    }
  });

  return finalSpecialties;
}

export async function getUniversityInfo(): Promise<{ universities: UniversityInfo[], colleges: UniversityInfo[] }> {
    const notesMap = new Map<string, any[]>();
    (uniInfoNotes as any[]).forEach(note => {
        const uniNameKey = note.ali_tehsil_muessisesi?.trim().toLowerCase().replace(/[“”"]/g, '');
        if(uniNameKey) {
            if (!notesMap.has(uniNameKey)) {
                notesMap.set(uniNameKey, []);
            }
            notesMap.get(uniNameKey)!.push(note);
        }
    });
    
    const processList = async (list: any[]) => {
        const infoList: UniversityInfo[] = await Promise.all(list.map(async (item) => {
            const uniNameKey = item.name.trim().toLowerCase().replace(/[“”"]/g, '');
            let details = null;
            try {
                const detailsModule = await import(`@/../elmir/universities/${item.id}.json`);
                details = detailsModule.default;
            } catch (e) {}

            return { ...item, notes: notesMap.get(uniNameKey) || [], details: details };
        }));
        infoList.sort((a, b) => {
            const aHasInfo = (a.notes && a.notes.length > 0) || a.details;
            const bHasInfo = (b.notes && b.notes.length > 0) || b.details;
            if (aHasInfo && !bHasInfo) return -1;
            if (!aHasInfo && bHasInfo) return 1;
            return a.name.localeCompare(b.name);
        });
        return infoList;
    };

    const universityInfoList = await processList(universities);
    const collegeInfoList = await processList(colleges);

    return { universities: universityInfoList, colleges: collegeInfoList };
}

export async function getFacultyBySlug(slug: string): Promise<FacultyDetails | null> {
  try {
    const facultyModule = await import(`@/../elmir/faculties/${slug}.json`);
    return facultyModule.default;
  } catch (error) {
    console.error(`Could not load faculty data for slug: ${slug}`, error);
    return null;
  }
}
