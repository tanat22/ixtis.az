'use server';

import type { Specialty, UniversityInfo, FacultyDetails } from '@/lib/types';
import { allInstitutions, universities, colleges } from './data/universities';
import masterDataSource from '@/../elmir/magistr_az_2025.json';
import uniInfoNotes from '@/../elmir/uni_info.json';
import bachelorDataSource from '@/../elmir/2025_bakalavr_az.json';
import subgroupDataSource from '@/../elmir/subgroup_faculty.json';
import costDataSource from '@/../elmir/cost_data.json';

const normalizeString = (str: string) => str.trim().toLowerCase().replace(/[“”"()]/g, '');

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

const subgroupMap = new Map<string, string>();
(subgroupDataSource as { ixtisas: string; ixtisas_alt_qrupu: string }[]).forEach(item => {
    const cleanSpecialtyName = item.ixtisas.replace(/\*/g, '').trim();
    subgroupMap.set(normalizeString(cleanSpecialtyName), item.ixtisas_alt_qrupu);
});

// --- ADVANCED UNIVERSITY ID LOOKUP ---

// 1. Create a detailed map of official university names to their IDs
const universityNameToIdMap = new Map(allInstitutions.map(u => [normalizeString(u.name), u.id]));

// 2. Pre-process a "keyword map" for more flexible matching
const universityKeywordMap = new Map<string, number>();
allInstitutions.forEach(u => {
    const normalizedName = normalizeString(u.name);
    // Use significant keywords from the name. This helps differentiate between similar names.
    // E.g., "dövlət idarəçilik" vs "dövlət neft"
    const keywords = normalizedName.split(' ').filter(word => word.length > 3 && !['adına', 'respublikası', 'universiteti', 'akademiyası'].includes(word));
    
    // Create a primary key from the first few significant keywords
    const primaryKey = keywords.slice(0, 3).join(' ');
    if (primaryKey && !universityKeywordMap.has(primaryKey)) {
        universityKeywordMap.set(primaryKey, u.id);
    }
    // Fallback for shorter names
    if (!primaryKey && normalizedName && !universityKeywordMap.has(normalizedName)) {
         universityKeywordMap.set(normalizedName, u.id);
    }
});

// Cache for found IDs to speed up subsequent lookups of the same name
const foundIdsCache = new Map<string, number>();

function getUniversityId(uniName: string): number | undefined {
    if (!uniName) return undefined;

    const normalizedInputName = normalizeString(uniName);

    // 1. Check cache first for exact normalized match
    if (foundIdsCache.has(normalizedInputName)) {
        return foundIdsCache.get(normalizedInputName);
    }

    // 2. Try for a direct, exact match in the official name map
    if (universityNameToIdMap.has(normalizedInputName)) {
        const id = universityNameToIdMap.get(normalizedInputName)!;
        foundIdsCache.set(normalizedInputName, id);
        return id;
    }

    // 3. Smart search: Check if the input contains significant keywords from an official name
    // This handles cases where the input name is slightly different or longer
    const inputKeywords = new Set(normalizedInputName.split(' ').filter(w => w.length > 3));
    for (const [officialKeywords, id] of universityKeywordMap.entries()) {
        const officialKeywordArray = officialKeywords.split(' ');
        const allKeywordsMatch = officialKeywordArray.every(kw => inputKeywords.has(kw));
        if (allKeywordsMatch) {
            foundIdsCache.set(normalizedInputName, id);
            return id;
        }
    }
    
    // 4. Fallback: Check if the input name *contains* a shorter official name
    // This helps with "Azərbaycan Texniki Universiteti (ATU)" containing "Azərbaycan Texniki Universiteti"
    for (const [officialName, id] of universityNameToIdMap.entries()) {
        if (normalizedInputName.includes(officialName)) {
             foundIdsCache.set(normalizedInputName, id);
            return id;
        }
    }

    // If still not found, log a warning, but only once per unique name to avoid spam
    if (!foundIdsCache.has('__failed__' + normalizedInputName)) {
       console.warn(`Could not find university ID for: \"${uniName}\" (Normalized: ${normalizedInputName})`);
       foundIdsCache.set('__failed__' + normalizedInputName, 1); // Mark as failed
    }

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
    
    if ((item.dovlet_sifarisli === null || item.dovlet_sifarisli === "" || item.dovlet_sifarisli === "-") && 
        (item.Odenisli === null || item.Odenisli === "" || item.Odenisli === "-")) {
        
        const educationType = (baseSpecialty.cost === 'YDS' || baseSpecialty.cost === 'DH') ? 'Dövlət sifarişli' : 'Ödənişli';

        finalSpecialties.push({
            ...baseSpecialty,
            id: `${facultyCode}_${educationType.replace(/\s+/g, '_')}`,
            educationType: educationType,
            score: null,
        });
    } else {
        processEntry(item.dovlet_sifarisli, 'Dövlət sifarişli');
        processEntry(item.Odenisli, 'Ödənişli');
    }
  });

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
        const uniNameKey = normalizeString(note.ali_tehsil_muessisesi || '');
        if(uniNameKey) {
            if (!notesMap.has(uniNameKey)) {
                notesMap.set(uniNameKey, []);
            }
            notesMap.get(uniNameKey)!.push(note);
        }
    });
    
    const processList = async (list: any[]) => {
        const infoList: UniversityInfo[] = await Promise.all(list.map(async (item) => {
            const uniNameKey = normalizeString(item.name);
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
