
export interface UniversityInfo {
  description: string;
  website?: string;
}

export const universityInfo: Record<string, UniversityInfo> = {
  'uni-bdu': {
    description: 'Bakı Dövlət Universiteti Azərbaycanın ilk və aparıcı ali təhsil müəssisələrindən biridir. Geniş spektrli fundamental və tətbiqi elmlər üzrə mütəxəssis hazırlığı ilə tanınır. Universitetin güclü elmi-tədqiqat bazası və zəngin tarixi vardır.',
    website: 'http://bsu.edu.az/'
  },
  'uni-adnsu': {
    description: 'Azərbaycan Dövlət Neft və Sənaye Universiteti neft-qaz, kimya mühəndisliyi və informasiya texnologiyaları sahəsində yüksək ixtisaslı kadr hazırlığı üzrə ixtisaslaşmışdır. Ölkənin sənaye inkişafında mühüm rol oynayan tarixi bir ali məktəbdir.',
    website: 'https://asoiu.edu.az/'
  },
  'uni-unec': {
    description: 'Azərbaycan Dövlət İqtisad Universiteti (UNEC) iqtisadiyyat, maliyyə, menecment və biznesin idarə edilməsi üzrə regionun ən böyük təhsil mərkəzlərindən biridir. Beynəlxalq standartlara uyğun təhsil proqramları və ikili diplom imkanları təklif edir.',
    website: 'http://unec.edu.az/'
  },
  'uni-ada': {
    description: 'ADA Universiteti müasir təhsil proqramları və beynəlxalq mühiti ilə seçilən, əsasən ingilis dilində tədris aparan bir ali təhsil ocağıdır. Diplomatiya, beynəlxalq münasibətlər, biznes və informasiya texnologiyaları sahələrində güclü mütəxəssislər hazırlayır.',
    website: 'https://www.ada.edu.az/'
  },
  'uni-azmiu': {
    description: 'Azərbaycan Memarlıq və İnşaat Universiteti memarlıq, dizayn, inşaat mühəndisliyi və nəqliyyat sistemləri sahəsində ölkənin əsas ali təhsil müəssisəsidir. Yaradıcı və texniki bilikləri birləşdirən proqramları ilə tanınır.',
    website: 'https://azmiu.edu.az/'
  },
   'uni-adpu': {
    description: 'Azərbaycan Dövlət Pedaqoji Universiteti ölkənin ən qocaman ali təhsil ocaqlarından biridir və əsasən müəllim kadrlarının hazırlanması üzrə ixtisaslaşmışdır. Universitet müxtəlif pedaqoji sahələr üzrə geniş proqramlar təklif edir.',
    website: 'https://adpu.edu.az/'
  },
  'uni-bmu': {
    description: 'Bakı Mühəndislik Universiteti mühəndislik, iqtisadiyyat və memarlıq sahələrində müasir standartlara cavab verən kadrlar hazırlayır. Tədrisin əksəriyyəti ingilis dilində aparılır və beynəlxalq əməkdaşlığa xüsusi önəm verilir.',
    website: 'https://beu.edu.az/'
  }
};
