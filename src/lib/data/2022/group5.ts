import type { Specialty } from '../../types';

// 2022-2023 V Qrup
export const specialties: Specialty[] = [
  // Bakı Dövlət Universiteti
  { id: 'spec-bdu-g5-1-2022', year: 2022, name: 'Fiziki tərbiyə və çağırışaqədərki hazırlıq müəllimliyi (Qazax filialı)', universityId: 'uni-bdu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 100.1 },

  // Azərbaycan Memarlıq və İnşaat Universiteti
  { id: 'spec-azmiu-g5-1-2022', year: 2022, name: 'Dizayn', universityId: 'uni-azmiu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-azmiu-g5-2-2022', year: 2022, name: 'Dizayn', universityId: 'uni-azmiu', groupId: 'grp-5', level: 'college', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 70.6 },
  { id: 'spec-azmiu-g5-3-2022', year: 2022, name: 'Dizayn (tədris ingilis dilində)', universityId: 'uni-azmiu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'en', paymentType: 'ödənişli', planCount: 0, score: 172.4 },

  // Azərbaycan Dövlət Pedaqoji Universiteti
  { id: 'spec-adpu-g5-1-2022', year: 2022, name: 'Fiziki tərbiyə və çağırışaqədərki hazırlıq müəllimliyi', universityId: 'uni-adpu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 114.7 },
  { id: 'spec-adpu-g5-2-2022', year: 2022, name: 'Musiqi müəllimliyi (fortepiano, violin, qarmon, tar, saz, kamança, qanun, klarnet, vokal, balaban, saksofon, xor dirijorluğu, musiqi nəzəriyyəsi)', universityId: 'uni-adpu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-adpu-g5-3-2022', year: 2022, name: 'Musiqi müəllimliyi (fortepiano, violin, qarmon, tar, saz, kamança, qanun, klarnet, vokal, balaban, saksofon, xor dirijorluğu, musiqi nəzəriyyəsi)', universityId: 'uni-adpu', groupId: 'grp-5', level: 'college', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 75.3 },
  { id: 'spec-adpu-g5-4-2022', year: 2022, name: 'Təsviri incəsənət müəllimliyi', universityId: 'uni-adpu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 107.0 },

  // Azərbaycan Dövlət İqtisad Universiteti
  { id: 'spec-unec-g5-1-2022', year: 2022, name: 'Dizayn', universityId: 'uni-unec', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 173.4 },

  // Bakı Mühəndislik Universiteti
  { id: 'spec-bmu-g5-1-2022', year: 2022, name: 'Dizayn', universityId: 'uni-bmu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 170.3 },
  { id: 'spec-bmu-g5-2-2022', year: 2022, name: 'Dizayn (tədris ingilis dilində)', universityId: 'uni-bmu', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'en', paymentType: 'ödənişli', planCount: 0, score: 184.4 },

  // Bakı Musiqi Akademiyası
  { id: 'spec-bma-g5-1-2022', year: 2022, name: 'Musiqi müəllimliyi (fortepiano, violin, viola, violonçel, kontrabas, arfa, fleyta, qoboy, klarnet, saksofon, faqot, valtoma, truba, trombon, tuba, zərb alətləri)', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 82.9 },
  { id: 'spec-bma-g5-2-2022', year: 2022, name: 'Bəstəkarlıq', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-bma-g5-3-2022', year: 2022, name: 'Dirijorluq (xor dirijorluğu, nəfəs alətləri orkestri dirijorluğu)', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-bma-g5-4-2022', year: 2022, name: 'Dirijorluq (xor dirijorluğu, nəfəs alətləri orkestri dirijorluğu)', universityId: 'uni-bma', groupId: 'grp-5', level: 'college', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 64.8 },
  { id: 'spec-bma-g5-5-2022', year: 2022, name: 'İnstrumental ifaçılıq (fortepiano, orqan, klavesin, violin, viola, violonçel, kontrabas, arfa, fleyta, qoboy, klarnet, saksofon, faqot, valtoma, truba, trombon, tuba, zərb alətləri)', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-bma-g5-6-2022', year: 2022, name: 'İnstrumental ifaçılıq (fortepiano, orqan, klavesin, violin, viola, violonçel, kontrabas, arfa, fleyta, qoboy, klarnet, saksofon, faqot, valtoma, truba, trombon, tuba, zərb alətləri)', universityId: 'uni-bma', groupId: 'grp-5', level: 'college', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 51.0 },
  { id: 'spec-bma-g5-7-2022', year: 2022, name: 'Musiqişünaslıq', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 60.0 },
  { id: 'spec-bma-g5-8-2022', year: 2022, name: 'Populyar musiqi və caz ifaçılığı (fortepiano, saksofon, truba, zərb alətləri, vokal)', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 87.7 },
  { id: 'spec-bma-g5-9-2022', year: 2022, name: 'Vokal sənəti (akademik vokal)', universityId: 'uni-bma', groupId: 'grp-5', level: 'bachelor', educationForm: 'əyani', educationLanguage: 'az', paymentType: 'ödənişli', planCount: 0, score: 85.3 },

  // ... (and so on for all universities for group 5, 2022)
];
