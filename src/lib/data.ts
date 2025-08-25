import type { University, Group, Subgroup, Level, EducationForm } from './types';
import { specialties as specialtiesG1_2024 } from './data/2024/group1';
import { specialties as specialtiesG2_2024 } from './data/2024/group2';
import { specialties as specialtiesG3_2024 } from './data/2024/group3';
import { specialties as specialtiesG4_2024 } from './data/2024/group4';
import { specialties as specialtiesG5_2024 } from './data/2024/group5';
import { specialties as specialtiesCollege11_2024 } from './data/2024/college11';
import { specialties as specialtiesMaster_2024 } from './data/2024/master';

import { specialties as specialtiesG1_2023 } from './data/2023/group1';
import { specialties as specialtiesG2_2023 } from './data/2023/group2';
import { specialties as specialtiesG3_2023 } from './data/2023/group3';
import { specialties as specialtiesG4_2023 } from './data/2023/group4';
import { specialties as specialtiesG5_2023 } from './data/2023/group5';
import { specialties as specialtiesCollege11_2023 } from './data/2023/college11';

import { specialties as specialtiesG1_2022 } from './data/2022/group1';
import { specialties as specialtiesG2_2022 } from './data/2022/group2';


export const years: number[] = [2022, 2023, 2024];

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
    { id: 'uni-atu-gence', name: 'Azərbaycan Texnologiya Universiteti (Gəncə şəhəri)' },
    { id: 'uni-sdu', name: 'Sumqayıt Dövlət Universiteti' },
    { id: 'uni-mdu', name: 'Mingəçevir Dövlət Universiteti' },
    { id: 'uni-ldu', name: 'Lənkəran Dövlət Universiteti' },
    { id: 'uni-qu', name: 'Qarabağ Universiteti' },
    { id: 'uni-tau', name: 'Türkiyə-Azərbaycan Universiteti' },
    { id: 'uni-aku', name: 'Azərbaycan Kooperasiya Universiteti' },
    { id: 'uni-au', name: '“Azərbaycan” Universiteti' },
    { id: 'uni-qku', name: 'Qərbi Kaspi Universiteti' },
    { id: 'uni-xu', name: 'Xəzər Universiteti' },
    { id: 'uni-baau', name: 'Bakı Avrasiya Universiteti' },
    { id: 'uni-bqu', name: 'Bakı Qızlar Universiteti' },
    { id: 'uni-oyu', name: '“Odlar Yurdu” Universiteti' },
    { id: 'uni-bbu', name: 'Bakı Biznes Universiteti' },
    { id: 'uni-adim', name: 'Azərbaycan Dövlət Mədəniyyət və İncəsənət Universiteti' },
    { id: 'uni-adbtia', name: 'Azərbaycan Dövlət Bədən Tərbiyəsi və İdman Akademiyası' },
    { id: 'uni-aesma', name: 'Azərbaycan Əmək və Sosial Münasibətlər Akademiyası' },
    { id: 'uni-adu', name: 'Azərbaycan Dillər Universiteti' },
    { id: 'uni-bsu', name: 'Bakı Slavyan Universiteti' },
    { id: 'uni-ai', name: 'Azərbaycan İlahiyyat İnstitutu' },
    { id: 'uni-bma', name: 'Hacıbəyov adına Bakı Musiqi Akademiyası' },
    { id: 'uni-amk', name: 'Azərbaycan Milli Konservatoriyası' },
    { id: 'uni-bxa', name: 'Bakı Xoreoqrafiya Akademiyası' },
    { id: 'uni-amu', name: 'Azərbaycan Tibb Universiteti' },
    { id: 'uni-fhna', name: 'Fövqəladə Hallar Nazirliyinin Akademiyası' },
    { id: 'uni-naxcivan-uni', name: '“Naxçıvan” Universiteti' },
    { id: 'uni-azmaliyyekollec', name: 'Azərbaycan Dövlət İqtisad Universitetinin nəznində Azərbaycan Maliyyə-iqtisad Kolleci'},
    { id: 'uni-bduiqtisadiyyathumanitar', name: 'Bakı Dövlət Universitetinin nəznində İqtisadiyyat və Humanitar Kollec'},
    { id: 'uni-unecqida', name: 'Azərbaycan Dövlət İqtisad Universitetinin nəznində Qida Sənayesi Kolleci'},
    { id: 'uni-unecsosialiqtisadi', name: 'Azərbaycan Dövlət İqtisad Universitetinin nəznində Sosial-İqtisadi Kollec'},
    { id: 'uni-adnsusenayetexnologiya', name: 'Azərbaycan Dövlət Neft və Sənaye Universitetinin nəznində Sənaye və Texnologiya Kolleci'},
    { id: 'uni-adpupedkollec', name: 'Azərbaycan Dövlət Pedaqoji Universiteti nəznində Azərbaycan Dövlət Pedaqoji Kolleci'},
    { id: 'uni-azturabitetransport', name: 'Azərbaycan Texniki Universitetinin nəzdində Bakı Dövlət Rabitə və Nəqliyyat Kolleci'},
    { id: 'uni-baki1tibb', name: '1 nömrəli Bakı Tibb Kolleci'},
    { id: 'uni-baki2tibb', name: '2 nömrəli Bakı Baza Tibb Kolleci'},
    { id: 'uni-bxa-kollec', name: 'Bakı Xoreoqrafiya Akademiyasının orta ixtisas təhsili pilləsi'},
    { id: 'uni-adimhumanitar', name: 'Azərbaycan Dövlət Mədəniyyət və İncəsənət Universitetinin nəzdində Humanitar Kollec'},
    { id: 'uni-adraincesenet', name: 'Azərbaycan Dövlət Rəssamlıq Akademiyası nəznində İncəsənət Kolleci'},
    { id: 'uni-amk-kollec', name: 'Azərbaycan Milli Konservatoriyası nəznində Musiqi Kolleci'},
    { id: 'uni-aztutexnikikollec', name: 'Azərbaycan Texniki Universitetinin nəznində Bakı Texniki Kolleci'},
    { id: 'uni-adnsubakineftenergetika', name: 'Azərbaycan Dövlət Neft və Sənaye Universitetinin nəznində Bakı Neft-Energetika Kolleci'},
    { id: 'uni-azmiuinsaatkollec', name: 'Azərbaycan Memarlıq və İnşaat Universitetinin nəznində İnşaat Kolleci'},
    { id: 'uni-addadənizçilik', name: 'Azərbaycan Dövlət Dəniz Akademiyasının nəznində Azərbaycan Dənizçilik Kolleci'},
    { id: 'uni-naxtibb', name: 'Naxçıvan Tibb Kolleci'},
    { id: 'uni-naxtexnik', name: 'Naxçıvan Dövlət Texniki Kolleci'},
    { id: 'uni-gencetibb', name: 'Gəncə Tibb Kolleci'},
    { id: 'uni-gduregionalkollec', name: 'Gəncə Dövlət Universitetinin nəznində Regional Kollec'},
    { id: 'uni-qazaxsosialiqtisadi', name: 'Qazax Dövlət Sosial-İqtisadi Kolleci'},
    { id: 'uni-tovuzsosialiqtisadi', name: 'Tovuz Dövlət Sosial-İqtisadi Kolleci'},
    { id: 'uni-sumqayittibb', name: 'Ə.Əliyev adına Sumqayıt Tibb Kolleci'},
    { id: 'uni-sdusumqayitdovlettexniki', name: 'Sumqayıt Dövlət Universitetinin nəznində Sumqayıt Dövlət Texniki Kolleci'},
    { id: 'uni-amksumqayitmusiqi', name: 'Azərbaycan Milli Konservatoriyası nəznində Sumqayıt Musiqi Kolleci'},
    { id: 'uni-qubasosialiqtisadi', name: 'Quba Dövlət Sosial-İqtisadi Kolleci'},
    { id: 'uni-qubatibb', name: 'Quba Tibb Kolleci'},
    { id: 'uni-samaxiregional', name: 'Şamaxı Dövlət Regional Kolleci'},
    { id: 'uni-mingecevirtibb', name: 'Mingəçevir Tibb Kolleci'},
    { id: 'uni-mingecevirturizm', name: 'Mingəçevir Turizm Kolleci'},
    { id: 'uni-sekitibb', name: 'Şəki Tibb Kolleci'},
    { id: 'uni-sekiregional', name: 'Şəki Dövlət Regional Kolleci'},
    { id: 'uni-susahumanitar', name: 'Şuşa Humanitar Kolleci'},
    { id: 'uni-agdamsosialiqtisadi', name: 'Ağdam Dövlət Sosial-İqtisadi Kolleci'},
    { id: 'uni-agdammusiqi', name: 'Ağdam Musiqi Kolleci'},
    { id: 'uni-agdashumanitar', name: 'Ağdaş Dövlət Humanitar Kolleci'},
    { id: 'uni-agcabedipedaqoji', name: 'Ağcabədi Pedaqoji Kolleci'},
    { id: 'uni-sirvansosialiqtisadi', name: 'Şirvan Dövlət İqtisadiyyat və Humanitar Kolleci'},
    { id: 'uni-berdeidareetmetexnologiya', name: 'Bərdə Dövlət İdarəetmə və Texnologiya Kolleci'},
    { id: 'uni-sabirabadsosialiqtisadi', name: 'Sabirabad Dövlət Sosial-İqtisadi Kolleci'},
    { id: 'uni-goycayidareetmetexnologiya', name: 'Göyçay Dövlət İdarəetmə və Texnologiya Kolleci'},
    { id: 'uni-lenkerantibb', name: 'Lənkəran Tibb Kolleci'},
    { id: 'uni-ldusosialaqrartexnoloji', name: 'Lənkəran Dövlət Universitetinin nəznində Sosial və Aqrar-Texnoloji Kollec'},
    { id: 'uni-astarapedaqoji', name: 'Astara Pedaqoji Kolleci'},
    { id: 'uni-ismayillihumanitartexnologiya', name: 'İsmayıllı Dövlət Humanitar və Texnologiya Kolleci'},
    { id: 'uni-saatlitibb', name: 'Saatlı Tibb Kolleci'},
    { id: 'uni-celilabadtibb', name: 'Cəlilabad Tibb Kolleci'},
    { id: 'uni-masalliregional', name: 'Masallı Dövlət Regional Kolleci'},
    { id: 'uni-bakıilahiyyatkollec', name: 'Azərbaycan Respublikası Dini Qurumlarla İş üzrə Dövlət Komitəsinin Bakı ilahiyyat institutunun yanında Bakı ilahiyyat Kolleci'},
    { id: 'uni-adauagrar', name: 'Azərbaycan Dövlət Aqrar Universitetinin nəznində Gəncə Dövlət Aqrar Kolleci'},
    { id: 'uni-bakibizneskooperasiya', name: 'Bakı Biznes və Kooperasiya Kolleci'},
    { id: 'uni-odlaryurdukollec', name: 'Odlar Yurdu Kolleci'},
    { id: 'uni-bakiavrasyakollec', name: 'Bakı Avrasiya Kolleci'},
];

export const groups: Group[] = [
    { id: 'grp-1', name: 'I Qrup' },
    { id: 'grp-2', name: 'II Qrup' },
    { id: 'grp-3', name: 'III Qrup' },
    { id: 'grp-4', name: 'IV Qrup' },
    { id: 'grp-5', name: 'V Qrup' },
    { id: 'none', name: 'Qrup Tətbiq Edilmir' },
];

export const subgroups: Subgroup[] = [
    { id: 'sub-1-ri', groupId: 'grp-1', name: 'Riyaziyyat-İnformatika (Rİ)' },
    { id: 'sub-1-rk', groupId: 'grp-1', name: 'Riyaziyyat-Kimya (RK)' },
    { id: 'sub-3-dt', groupId: 'grp-3', name: 'Dil-Tarix (DT)' },
    { id: 'sub-3-tc', groupId: 'grp-3', name: 'Tarix-Coğrafiya (TC)' },
];

export const levels: Level[] = [
    { id: 'bachelor', name: 'Bakalavr' },
    { id: 'college', name: 'Kollec (Subbakalavr)' },
    { id: 'master', name: 'Magistratura' },
];

export const educationForms: EducationForm[] = [
    { id: 'əyani', name: 'Əyani' },
    { id: 'qiyabi', name: 'Qiyabi' },
];

export const specialties = [
    ...specialtiesG1_2024,
    ...specialtiesG2_2024,
    ...specialtiesG3_2024,
    ...specialtiesG4_2024,
    ...specialtiesG5_2024,
    ...specialtiesCollege11_2024,
    ...specialtiesMaster_2024,
    ...specialtiesG1_2023,
    ...specialtiesG2_2023,
    ...specialtiesG3_2023,
    ...specialtiesG4_2023,
    ...specialtiesG5_2023,
    ...specialtiesCollege11_2023,
    ...specialtiesG1_2022,
    ...specialtiesG2_2022,
];
