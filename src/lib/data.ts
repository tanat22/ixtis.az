import type { University, Group, Level, Specialty, EducationForm } from './types';

export const years: number[] = [2024, 2023, 2022];

export const universities: University[] = [
    { id: 'uni-1', name: 'Bakı Ali Neft Məktəbi (BANM)' },
    { id: 'uni-2', name: 'Azərbaycan Tibb Universiteti (ATU)' },
    { id: 'uni-3', name: 'Azərbaycan Dövlət Neft və Sənaye Universiteti (ADNSU)' },
    { id: 'uni-4', name: 'Bakı Dövlət Universiteti (BDU)' },
    { id: 'uni-5', name: 'Azərbaycan Dövlət İqtisad Universiteti (UNEC)' },
    { id: 'uni-6', name: 'ADA Universiteti' },
    { id: 'uni-7', name: 'Azərbaycan Memarlıq və İnşaat Universiteti (AzMİU)'},
    { id: 'uni-8', name: 'Bakı Mühəndislik Universiteti (BMU)'},
    { id: 'uni-9', name: 'Azərbaycan Dövlət Pedaqoji Universiteti (ADPU)'},
    { id: 'uni-10', name: 'Azərbaycan Dillər Universiteti (ADU)'}
];

export const groups: Group[] = [
    { id: 'grp-1', name: 'I Qrup' },
    { id: 'grp-2', name: 'II Qrup' },
    { id: 'grp-3', name: 'III Qrup' },
    { id: 'grp-4', name: 'IV Qrup' },
    { id: 'grp-5', name: 'V Qrup' },
];

export const levels: Level[] = [
    { id: 'bachelor', name: 'Bakalavr' },
    { id: 'master', name: 'Magistratura' },
    { id: 'college', name: 'Kollec (Subbakalavr)' },
];

export const educationForms: EducationForm[] = [
    { id: 'əyani', name: 'Əyani' },
    { id: 'qiyabi', name: 'Qiyabi' },
];

export const specialties: Specialty[] = [
    // BANM - 2024
    { id: 'spec-1', year: 2024, name: 'İnformasiya təhlükəsizliyi', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 687.1, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 20 },
    { id: 'spec-2', year: 2024, name: 'Kimya mühəndisliyi', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 678.0, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 25 },
    { id: 'spec-3', year: 2024, name: 'Kompüter elmləri', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 673.5, educationForm: 'əyani', educationLanguage: 'en', paymentType: 'ödənişli', planCount: 30 },
    
    // ATU - 2024
    { id: 'spec-4', year: 2024, name: 'Müalicə işi', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 655.0, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 150 },
    { id: 'spec-5', year: 2024, name: 'Stomatologiya', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 648.2, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 50 },
    { id: 'spec-6', year: 2024, name: 'Əczaçılıq', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 631.0, educationForm: 'qiyabi', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 40 },
    
    // BDU - 2024
    { id: 'spec-7', year: 2024, name: 'Hüquqşünaslıq', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 645.8, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 75 },
    { id: 'spec-8', year: 2024, name: 'Jurnalistika', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 580.4, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 25 },
    { id: 'spec-9', year: 2024, name: 'Hüquqşünaslıq', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 599.0, educationForm: 'əyani', educationLanguage: 'ru', paymentType: 'ödənişli', planCount: 50 },

    // UNEC - 2023
    { id: 'spec-10', year: 2023, name: 'Beynəlxalq ticarət və logistika', universityId: 'uni-5', groupId: 'grp-2', level: 'bachelor', score: 640.1, educationForm: 'əyani', educationLanguage: 'en', paymentType: 'dövlət sifarişli', planCount: 40 },
    { id: 'spec-11', year: 2023, name: 'Maliyyə', universityId: 'uni-5', groupId: 'grp-2', level: 'bachelor', score: 635.0, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 120 },
    { id: 'spec-12', year: 2023, name: 'Marketinq', universityId: 'uni-5', groupId: 'grp-2', level: 'bachelor', score: 589.5, educationForm: 'qiyabi', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 60 },

    // ADA - 2023
    { id: 'spec-13', year: 2023, name: 'Kompüter mühəndisliyi', universityId: 'uni-6', groupId: 'grp-1', level: 'bachelor', score: 670.0, educationForm: 'əyani', educationLanguage: 'en', paymentType: 'ödənişli', planCount: 50 },
    { id: 'spec-14', year: 2023, name: 'Biznesin idarə edilməsi', universityId: 'uni-6', groupId: 'grp-2', level: 'bachelor', score: 660.0, educationForm: 'əyani', educationLanguage: 'en', paymentType: 'ödənişli', planCount: 80 },

    // AzMİU - 2022
    { id: 'spec-15', year: 2022, name: 'Memarlıq', universityId: 'uni-7', groupId: 'grp-1', level: 'bachelor', score: null, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 40 },
    { id: 'spec-16', year: 2022, name: 'Dizayn', universityId: 'uni-7', groupId: 'grp-5', level: 'bachelor', score: null, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 30 },

    // ADPU - 2022
    { id: 'spec-17', year: 2022, name: 'Riyaziyyat və informatika müəllimliyi', universityId: 'uni-9', groupId: 'grp-1', level: 'bachelor', score: 550.2, educationForm: 'əyani', educationLanguage: 'az', paymentType: 'dövlət sifarişli', planCount: 100 },
    { id: 'spec-18', year: 2022, name: 'Tarix müəllimliyi', universityId: 'uni-9', groupId: 'grp-3', level: 'bachelor', score: 480.7, educationForm: 'qiyabi', educationLanguage: 'ru', paymentType: 'ödənişli', planCount: 25 },
];
