import type { Group } from '@/lib/types';
import staticGroups from '@/../elmir/groups.json';

/**
 * Fetches all specialty groups from the local JSON file.
 * @returns A promise that resolves to an array of groups.
 */
export async function getAllGroups(): Promise<Group[]> {
    // For now, we are returning static data directly from the imported JSON file.
    // In the future, this could be adapted to fetch from a live API.
    return staticGroups as Group[];
}
