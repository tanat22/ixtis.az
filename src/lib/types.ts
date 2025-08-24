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

export interface EducationForm {
    id: 'əyani' | 'qiyabi';
    name: 'Əyani' | 'Qiyabi';
}

export interface Specialty {
    id: string;
    year: number;
    name: string;
    universityId: string;
    groupId: string;
    level: string; // e.g., 'bachelor', 'master'
    educationForm: 'əyani' | 'qiyabi';
    educationLanguage: 'az' | 'ru' | 'en' | 'tr';
    paymentType: 'dövlət sifarişli' | 'ödənişli';
    planCount: number;
    score: number | null; // Null if admission is based on competition (e.g., arts)
}
