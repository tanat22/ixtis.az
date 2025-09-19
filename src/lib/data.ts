'use server';

import type { Specialty, UniversityInfo, FacultyDetails } from '@/lib/types';
import { allInstitutions, universities, colleges } from './data/universities';
import masterDataSource from '@/../elmir/magistr_az_2025.json';
import uniInfoNotes from '@/../elmir/uni_info.json';
import bachelorDataSource from '@/../elmir/2025_bakalavr_az.json';
import subgroupDataSource from '@/../elmir/subgroup_faculty.json';
import costDataSource from '@/../elmir/cost_data.json';

const normalizeString = (str: string) => str.trim().toLowerCase().replace(/[“”"()]/g, '');

const costMap = new Map<number, { cost: any; planned_places: any; paymentType: string }>();
(costDataSource as any[]).forEach(item => {
    const facultyCode = Number(item.Fakulte_kodu);
    if (!isNaN(facultyCode)) {
        costMap.set(facultyCode, {
            cost: item.cost,
            planned_places: !isNaN(parseInt(item.planned_places)) ? parseInt(item.planned_places) : null,
            paymentType: item['odenis usulu']?.trim() || ''
        });
    }
});

const subgroupMap = new Map<string, string>();
(subgroupDataSource as { ixtisas: string; ixtisas_alt_qrupu: string }[]).forEach(item => {
    const cleanSpecialtyName = item.ixtisas.replace(/\*/g, '').trim();
    subgroupMap.set(normalizeString(cleanSpecialtyName), item.ixtisas_alt_qrupu);
});

const universityNameToIdMap = new Map(allInstitutions.map(u => [normalizeString(u.name), u.id]));
const universityKeywordMap = new Map<string, number>();
allInstitutions.forEach(u => {
    const normalizedName = normalizeString(u.name);
    const keywords = normalizedName.split(' ').filter(word => word.length > 3 && !['adına', 'respublikası', 'universiteti', 'akademiyası'].includes(word));
    const primaryKey = keywords.slice(0, 3).join(' ');
    if (primaryKey && !universityKeywordMap.has(primaryKey)) {
        universityKeywordMap.set(primaryKey, u.id);
    }
    if (!primaryKey && normalizedName && !universityKeywordMap.has(normalizedName)) {
         universityKeywordMap.set(normalizedName, u.id);
    }
});
const foundIdsCache = new Map<string, number>();
function getUniversityId(uniName: string): number | undefined {
    if (!uniName) return undefined;
    const normalizedInputName = normalizeString(uniName);
    if (foundIdsCache.has(normalizedInputName)) return foundIdsCache.get(normalizedInputName);
    if (universityNameToIdMap.has(normalizedInputName)) {
        const id = universityNameToIdMap.get(normalizedInputName)!;
        foundIdsCache.set(normalizedInputName, id);
        return id;
    }
    const inputKeywords = new Set(normalizedInputName.split(' ').filter(w => w.length > 3));
    for (const [officialKeywords, id] of universityKeywordMap.entries()) {
        const officialKeywordArray = officialKeywords.split(' ');
        const allKeywordsMatch = officialKeywordArray.every(kw => inputKeywords.has(kw));
        if (allKeywordsMatch) {
            foundIdsCache.set(normalizedInputName, id);
            return id;
        }
    }
    for (const [officialName, id] of universityNameToIdMap.entries()) {
        if (normalizedInputName.includes(officialName)) {
             foundIdsCache.set(normalizedInputName, id);
            return id;
        }
    }
    if (!foundIdsCache.has('__failed__' + normalizedInputName)) {
       console.warn(`Could not find university ID for: \"${uniName}\" (Normalized: ${normalizedInputName})`);
       foundIdsCache.set('__failed__' + normalizedInputName, 1);
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

    if (isNaN(facultyCode) || !universityId || !specialtyNameRaw) return;

    const specialtyName = String(specialtyNameRaw).trim();
    const subGroupId = subgroupMap.get(normalizeString(specialtyName));
    const costInfo = costMap.get(facultyCode);
    const paymentType = costInfo?.paymentType;

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
      cost: costInfo?.cost, 
    };

    // Rule-based row creation
    const dsScore = parseFloat(String(item.dovlet_sifarisli));
    const paidScore = parseFloat(String(item.Odenisli));

    if (paymentType === 'YDS' || paymentType === 'DH') {
        finalSpecialties.push({
            ...baseSpecialty,
            id: `${facultyCode}_${paymentType}`,
            educationType: paymentType,
            score: !isNaN(dsScore) ? dsScore : null,
            cost: '', // Cost is empty for YDS and DH
        });
    } else if (paymentType === 'YÖ') {
        finalSpecialties.push({
            ...baseSpecialty,
            id: `${facultyCode}_${paymentType}`,
            educationType: paymentType,
            score: !isNaN(paidScore) ? paidScore : null,
            cost: baseSpecialty.cost, // Use cost from file
        });
    } else {
        // Default rule: create separate rows if scores exist
        if (!isNaN(dsScore)) {
            finalSpecialties.push({
                ...baseSpecialty,
                id: `${facultyCode}_Dovlet_sifarisli`,
                educationType: 'Dövlət sifarişli',
                score: dsScore,
                cost: '', // State-funded has no cost to display
            });
        }
        if (!isNaN(paidScore)) {
            finalSpecialties.push({
                ...baseSpecialty,
                id: `${facultyCode}_Odenisli`,
                educationType: 'Ödənişli',
                score: paidScore,
                cost: baseSpecialty.cost,
            });
        }
        // Handle case with no scores at all for this faculty code
        if (isNaN(dsScore) && isNaN(paidScore)) {
             finalSpecialties.push({
                ...baseSpecialty,
                id: `${facultyCode}_main`,
                educationType: 'Ödənişli', // Default assumption
                score: null,
                cost: baseSpecialty.cost,
            });
        }
    }
  });

  // Master's data processing remains unchanged for now
  (masterDataSource as any[]).forEach((item) => {
    const facultyCode = parseInt(item.Fakulte_kodu, 10);
    const universityId = getUniversityId(item.Uni_ad);
    const specialtyName = item['Fakulte adi']?.trim();

    if (isNaN(facultyCode) || !universityId || !specialtyName) return;

    const costInfo = costMap.get(facultyCode);
    
    const baseSpecialty = {
        facultyCode: facultyCode,
        year: item.il || 2025,
        name: specialtyName,
        slug: slugify(specialtyName),
        universityId: universityId,
        groupId: `group-master`,
        subGroupId: undefined,
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
