export interface University {
    id: string;
    name: string;
}

export interface Group {
    id: string;
    name: string;
}

export interface Level {
    id: string;
    name: string;
}

export interface Specialty {
    id: string;
    name: string;
    universityId: string;
    groupId: string;
    level: string; // e.g., 'bachelor', 'master'
    score: number;
}
