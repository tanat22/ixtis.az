
export interface UniversityInfo {
  description: string;
  website?: string;
  tuitionInfo?: string;
}

export const universityInfo: Record<string, UniversityInfo> = {
  'uni-bdu': {
    description: 'Bakı Dövlət Universiteti Azərbaycanın ilk və aparıcı ali təhsil müəssisələrindən biridir. Geniş spektrli fundamental və tətbiqi elmlər üzrə mütəxəssis hazırlığı ilə tanınır. Universitetin güclü elmi-tədqiqat bazası və zəngin tarixi vardır.',
    website: 'http://bsu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında dəyişiklik gözlənilmir.'
  },
  'uni-adnsu': {
    description: 'Azərbaycan Dövlət Neft və Sənaye Universiteti neft-qaz, kimya mühəndisliyi və informasiya texnologiyaları sahəsində yüksək ixtisaslı kadr hazırlığı üzrə ixtisaslaşmışdır. Ölkənin sənaye inkişafında mühüm rol oynayan tarixi bir ali məktəbdir.',
    website: 'https://asoiu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında dəyişiklik gözlənilmir. Bakalavr pilləsində illik təhsil haqları 2000-2500 AZN, magistr pilləsində isə 2500-3000 AZN arasında dəyişir.'
  },
  'uni-unec': {
    description: 'Azərbaycan Dövlət İqtisad Universiteti (UNEC) iqtisadiyyat, maliyyə, menecment və biznesin idarə edilməsi üzrə regionun ən böyük təhsil mərkəzlərindən biridir. Beynəlxalq standartlara uyğun təhsil proqramları və ikili diplom imkanları təklif edir.',
    website: 'http://unec.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında artım olacağı bildirilib, lakin artımın dəqiq məbləği hələlik açıqlanmayıb.'
  },
  'uni-ada': {
    description: 'ADA Universiteti müasir təhsil proqramları və beynəlxalq mühiti ilə seçilən, əsasən ingilis dilində tədris aparan bir ali təhsil ocağıdır. Diplomatiya, beynəlxalq münasibətlər, biznes və informasiya texnologiyaları sahələrində güclü mütəxəssislər hazırlayır.',
    website: 'https://www.ada.edu.az/'
  },
  'uni-azmiu': {
    description: 'Azərbaycan Memarlıq və İnşaat Universiteti memarlıq, dizayn, inşaat mühəndisliyi və nəqliyyat sistemləri sahəsində ölkənin əsas ali təhsil müəssisəsidir. Yaradıcı və texniki bilikləri birləşdirən proqramları ilə tanınır.',
    website: 'https://azmiu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında dəyişiklik gözlənilmir. İllik ödəniş 2000-2500 AZN arasında dəyişir.'
  },
   'uni-adpu': {
    description: 'Azərbaycan Dövlət Pedaqoji Universiteti ölkənin ən qocaman ali təhsil ocaqlarından biridir və əsasən müəllim kadrlarının hazırlanması üzrə ixtisaslaşmışdır. Universitet müxtəlif pedaqoji sahələr üzrə geniş proqramlar təklif edir.',
    website: 'https://adpu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilindən bütün ixtisaslar üzrə illik təhsil haqları 2000 manatdan 2300 manata qaldırılıb.'
  },
  'uni-bmu': {
    description: 'Bakı Mühəndislik Universiteti mühəndislik, iqtisadiyyat və memarlıq sahələrində müasir standartlara cavab verən kadrlar hazırlayır. Tədrisin əksəriyyəti ingilis dilində aparılır və beynəlxalq əməkdaşlığa xüsusi önəm verilir.',
    website: 'https://beu.edu.az/'
  },
  'uni-aztu': {
    description: 'Azərbaycan Texniki Universiteti (AzTU) ölkənin texniki və texnoloji sahələr üzrə aparıcı ali təhsil müəssisələrindən biridir. Maşınqayırma, metallurgiya, informatika və energetika kimi sahələrdə mühəndis hazırlığı həyata keçirir.',
    website: 'https://aztu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında dəyişiklik gözlənilmir.'
  },
  'uni-dia': {
    description: 'Azərbaycan Respublikası Prezidenti yanında Dövlət İdarəçilik Akademiyası dövlət qulluğu üçün yüksək ixtisaslı menecerlər və idarəçilər hazırlayan ixtisaslaşmış ali təhsil müəssisəsidir.',
    website: 'https://dia.edu.az/'
  },
  'uni-banm': {
    description: 'Bakı Ali Neft Məktəbi neft-qaz mühəndisliyi və kimya mühəndisliyi sahələrində Böyük Britaniyanın Heriot-Vatt Universiteti ilə birgə beynəlxalq standartlara uyğun, tamamilə ingilis dilində tədris aparan müasir ali təhsil ocağıdır.',
    website: 'https://www.bhos.edu.az/'
  },
  'uni-adu': {
    description: 'Azərbaycan Dillər Universiteti dilçilik, tərcümə və beynəlxalq münasibətlər sahəsində ixtisaslaşmışdır. Bir çox xarici dilin tədrisi və filologiyası üzrə güclü ənənələrə malikdir.',
    website: 'https://adu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində bir sıra ixtisaslarda artım gözlənilir. Məsələn, ingilis dili müəllimliyi ixtisasının illik təhsil haqqı 2500 manatdan 2700 manata qaldırılıb.'
  },
  'uni-bsu': {
    description: 'Bakı Slavyan Universiteti humanitar sahədə, xüsusilə rus dili və ədəbiyyatı, həmçinin digər slavyan və Avropa dilləri üzrə mütəxəssis hazırlığı ilə tanınır.',
    website: 'https://bsu.edu.az/'
  },
  'uni-amu': {
    description: 'Azərbaycan Tibb Universiteti ölkənin səhiyyə sistemi üçün həkim, stomatoloq, əczaçı və digər tibb mütəxəssisləri hazırlayan fundamental və ən böyük ali təhsil mərkəzidir.',
    website: 'https://amu.edu.az/'
  },
  'uni-adim': {
    description: 'Azərbaycan Dövlət Mədəniyyət və İncəsənət Universiteti aktyor, rejissor, sənətşünas, dizayner və musiqiçi kimi yaradıcı sahələr üzrə peşəkar kadrlar hazırlayır.',
    website: 'https://admiu.edu.az/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında dəyişiklik gözlənilmir. Bakalavr pilləsində illik təhsil haqqı 1950 AZN, magistratura pilləsində isə 1800-2000 AZN arasında dəyişir.'
  },
  'uni-adra': {
    description: 'Azərbaycan Dövlət Rəssamlıq Akademiyası rəngkarlıq, heykəltəraşlıq, dizayn və memarlıq kimi təsviri sənət sahələri üzrə ali təhsilli mütəxəssislər yetişdirir.',
    website: 'https://www.azra.edu.az/'
  },
  'uni-atmu': {
    description: 'Azərbaycan Turizm və Menecment Universiteti turizm, otelçilik, marketinq və menecment sahələri üzrə ixtisaslaşmışdır və bu sahədə ölkənin aparıcı ali məktəbidir.',
    website: 'https://atmu.edu.az/'
  },
  'uni-sdu': {
    description: 'Sumqayıt Dövlət Universiteti Sumqayıt və ətraf regionlar üçün müxtəlif sahələrdə, o cümlədən mühəndislik, iqtisadiyyat və pedaqogika üzrə kadrlar hazırlayan əsas ali təhsil mərkəzidir.',
    website: 'https://sdu.edu.az/'
  },
  'uni-gdu': {
    description: 'Gəncə Dövlət Universiteti Azərbaycanın qərb bölgəsinin ən böyük elm və təhsil mərkəzidir. Pedaqoji, humanitar və təbiət elmləri üzrə geniş spektrdə ixtisaslar təklif edir.',
    website: 'https://gsu.az/'
  },
  'uni-ldu': {
    description: 'Lənkəran Dövlət Universiteti ölkənin cənub regionu üçün aqrar elmlər, iqtisadiyyat, turizm və humanitar sahələr üzrə mütəxəssislər hazırlayan mühüm regional universitetdir.',
    website: 'https://lsu.edu.az/'
  },
  'uni-qku': {
    description: 'Qərbi Kaspi Universiteti (Western Caspian University) özəl ali təhsil müəssisəsi olaraq geniş spektrdə, o cümlədən iqtisadiyyat, politologiya, dizayn və informasiya texnologiyaları üzrə təhsil proqramları təklif edir.',
    website: 'https://wcu.edu.az/'
  },
  'uni-xu': {
    description: 'Xəzər Universiteti Azərbaycanın ilk özəl universitetlərindən biridir və əsasən ingilis dilində tədris aparır. Yüksək təhsil standartları və beynəlxalq mühiti ilə tanınır.',
    website: 'https://khazar.org/',
    tuitionInfo: '2024/2025-ci tədris ilində təhsil haqlarında artım yoxdur. İllik ödəniş 4000-5000 AZN arasında dəyişir.'
  },
  'uni-aku': {
    description: 'Azərbaycan Kooperasiya Universiteti əsasən iqtisadiyyat, ticarət, gömrük işi və ekspertiza sahələri üzrə mütəxəssis hazırlığı həyata keçirən ali təhsil müəssisəsidir.',
    website: 'https://aku.edu.az/'
  },
  'uni-au': {
    description: '“Azərbaycan” Universiteti tərcümə, filologiya, sosial iş və iqtisadiyyat kimi humanitar və sosial elmlər üzrə ixtisaslaşmış özəl ali təhsil müəssisəsidir.',
    website: 'https://au.edu.az/'
  },
  'uni-maa': {
    description: 'Milli Aviasiya Akademiyası mülki aviasiya sahəsi üçün pilotlar, mühəndislər və hava nəqliyyatının idarə edilməsi üzrə digər yüksək ixtisaslı mütəxəssislər hazırlayır.',
    website: 'https://naa.edu.az/'
  },
  'uni-adau': {
    description: 'Azərbaycan Dövlət Aqrar Universiteti kənd təsərrüfatının bütün sahələri – aqronomluq, zoomühəndislik, baytarlıq, aqromühəndislik üzrə ölkənin əsas ali təhsil və elm mərkəzidir.',
    website: 'https://adau.edu.az/'
  },
  'uni-qu': {
    description: 'Qarabağ Universiteti Azərbaycanın işğaldan azad edilmiş ərazilərində, Xankəndi şəhərində yenidən fəaliyyətə başlamışdır. Universitetin məqsədi regionun sosial-iqtisadi inkişafına təkan vermək üçün müxtəlif sahələr üzrə yüksək ixtisaslı kadrlar hazırlamaqdır.',
    website: 'https://karabakh.edu.az/'
  },
  'uni-bbu': {
    description: 'Bakı Biznes Universiteti biznesin idarə edilməsi, maliyyə və iqtisadiyyatın digər sahələri üzrə kadrlar hazırlayan ixtisaslaşmış özəl ali təhsil müəssisəsidir.',
    website: 'https://bbu.edu.az/'
  }
};
