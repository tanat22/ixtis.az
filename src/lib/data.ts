import type { University, Group, Level, Specialty } from './types';

export const universities: University[] = [
    { id: 'uni-1', name: 'Bakı Ali Neft Məktəbi' },
    { id: 'uni-2', name: 'Azərbaycan Tibb Universiteti' },
    { id: 'uni-3', name: 'ADNSU' },
    { id: 'uni-4', name: 'Bakı Dövlət Universiteti' },
    { id: 'uni-5', name: 'Azərbaycan Dövlət İqtisad Universiteti (UNEC)' },
    { id: 'uni-6', name: 'ADA Universiteti' },
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

export const specialties: Specialty[] = [
    { id: 'spec-1', name: 'İnformasiya təhlükəsizliyi (tədris ingilis dilində)', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 687.1 },
    { id: 'spec-2', name: 'Tibb (tədris ingilis dilində)', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 681.4 },
    { id: 'spec-3', name: 'Kimya mühəndisliyi (tədris ingilis dilində)', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 678.0 },
    { id: 'spec-4', name: 'Kompüter elmləri (tədris ingilis dilində)', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 673.5 },
    { id: 'spec-5', name: 'Proseslərin avtomatlaşdırılması mühəndisliyi (tədris ingilis dilində)', universityId: 'uni-1', groupId: 'grp-1', level: 'bachelor', score: 665.2 },
    { id: 'spec-6', name: 'Müalicə işi', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 655.0 },
    { id: 'spec-7', name: 'Hüquqşünaslıq', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 645.8 },
    { id: 'spec-8', name: 'Beynəlxalq ticarət və logistika', universityId: 'uni-5', groupId: 'grp-2', level: 'bachelor', score: 640.1 },
    { id: 'spec-9', name: 'Kompüter mühəndisliyi', universityId: 'uni-6', groupId: 'grp-1', level: 'bachelor', score: 670.0 },
    { id: 'spec-10', name: 'İqtisadiyyat', universityId: 'uni-6', groupId: 'grp-2', level: 'bachelor', score: 660.0 },
    { id: 'spec-11', name: 'Beynəlxalq münasibətlər', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 630.5 },
    { id: 'spec-12', name: 'Stomatologiya', universityId: 'uni-2', groupId: 'grp-4', level: 'bachelor', score: 648.2 },
    { id: 'spec-13', name: 'Neft-qaz mühəndisliyi', universityId: 'uni-3', groupId: 'grp-1', level: 'bachelor', score: 621.7 },
    { id: 'spec-14', name: 'Maliyyə', universityId: 'uni-5', groupId: 'grp-2', level: 'bachelor', score: 635.0 },
    { id: 'spec-15', name: 'Tarix müəllimliyi', universityId: 'uni-4', groupId: 'grp-3', level: 'bachelor', score: 580.4 },
    { id: 'spec-16', name: 'Biologiya', universityId: 'uni-4', groupId: 'grp-4', level: 'bachelor', score: 550.9 },
    { id: 'spec-17', name: 'Memarlıq', universityId: 'uni-3', groupId: 'grp-5', level: 'bachelor', score: 590.0 },
];
