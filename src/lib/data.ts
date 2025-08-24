import type { University, Group, Level, EducationForm } from './types';
import { specialties as specialtiesG1 } from './data/2024/group1';
import { specialties as specialtiesG2 } from './data/2024/group2';
import { specialties as specialtiesG3 } from './data/2024/group3';
import { specialties as specialtiesG4 } from './data/2024/group4';


export const years: number[] = [2024, 2023, 2022];

export const universities: University[] = [
    { id: 'uni-bdu', name: 'Bakı Dövlət Universiteti' },
    { id: 'uni-adnsu', name: 'Azərbaycan Dövlət Neft və Sənaye Universiteti' },
    { id: 'uni-aztu', name: 'Azərbaycan Texniki Universiteti' },
    { id: 'uni-azmiu', name: 'Azərbaycan Memarlıq və İnşaat Universiteti' },
    { id: 'uni-adpu', name: 'Azərbaycan Dövlət Pedaqoji Universiteti' },
    { id: 'uni-unec', name: 'Azərbaycan Dövlət İqtisad Universiteti' },
    { id: 'uni-bmu', name: 'Bakı Mühəndislik Universiteti' },
    { id: 'uni-dia', name: 'Azərbaycan Respublikası Prezidenti yanında Dövlət İdarəçilik Akademiyası' },
    { id: 'uni-ada', name: 'ADA Universiteti' },
    { id: 'uni-iaau', name: 'İtaliya-Azərbaycan Universiteti' },
    { id: 'uni-adra', name: 'Azərbaycan Dövlət Rəssamlıq Akademiyası' },
    { id: 'uni-atmu', name: 'Azərbaycan Turizm və Menecment Universiteti' },
    { id: 'uni-maa', name: 'Milli Aviasiya Akademiyası' },
    { id: 'uni-adda', name: 'Azərbaycan Dövlət Dəniz Akademiyası' },
    { id: 'uni-banm', name: 'Bakı Ali Neft Məktəbi' },
    { id: 'uni-dgka', name: 'Dövlət Gömrük Komitəsinin Akademiyası' },
    { id: 'uni-ndu', name: 'Naxçıvan Dövlət Universiteti' },
    { id: 'uni-nmi', name: 'Naxçıvan Müəllimlər İnstitutu' },
    { id: 'uni-adau', name: 'Azərbaycan Dövlət Aqrar Universiteti' },
    { id: 'uni-gdu', name: 'Gəncə Dövlət Universiteti' },
    { id: 'uni-atu', name: 'Azərbaycan Texnologiya Universiteti' },
    { id: 'uni-sdu', name: 'Sumqayıt Dövlət Universiteti' },
    { id: 'uni-mdu', name: 'Mingəçevir Dövlət Universiteti' },
    { id: 'uni-ldu', name: 'Lənkəran Dövlət Universiteti' },
    { id: 'uni-qu', name: 'Qarabağ Universiteti' },
    { id: 'uni-tau', name: 'Türkiyə-Azərbaycan Universiteti' },
    { id: 'uni-aku', name: 'Azərbaycan Kooperasiya Universiteti' },
    { id: 'uni-au', name: '“Azərbaycan ” Universiteti' },
    { id: 'uni-qku', name: 'Qərbi Kaspi Universiteti' },
    { id: 'uni-xu', name: 'Xəzər Universiteti' },
    { id: 'uni-baau', name: 'Bakı Avrasiya Universiteti' },
    { id: 'uni-bqu', name: 'Bakı Qızlar Universiteti' },
    { id: 'uni-oyu', name: '“Odlar Yurdu ” Universiteti' },
    { id: 'uni-bbu', name: 'Bakı Biznes Universiteti' },
    { id: 'uni-adim', name: 'Azərbaycan Dövlət Mədəniyyət və İncəsənət Universiteti' },
    { id: 'uni-idman', name: 'Azərbaycan İdman Akademiyası' },
    { id: 'uni-aesma', name: 'Azərbaycan Əmək və Sosial Münasibətlər Akademiyası' },
    { id: 'uni-adu', name: 'Azərbaycan Dillər Universiteti' },
    { id: 'uni-bsu', name: 'Bakı Slavyan Universiteti' },
    { id: 'uni-ai', name: 'Azərbaycan İlahiyyat İnstitutu' },
    { id: 'uni-atu-gəncə', name: 'Azərbaycan Texnologiya Universiteti (Gəncə şəhəri)' },
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

export const specialties = [
    ...specialtiesG1,
    ...specialtiesG2,
    ...specialtiesG3,
    ...specialtiesG4,
];
