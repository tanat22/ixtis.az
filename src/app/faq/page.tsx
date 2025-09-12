'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const admissionRules = [
    {
        title: '1. Ümumi müddəalar',
        content: (
            <ul className="list-disc space-y-3 pl-5">
                <li>Ali təhsil müəssisələrinə qəbul olmaq hüququna tam orta, yüksək texniki peşə, orta ixtisas və ya ali təhsili başa vurmaq haqqında müvafiq dövlət nümunəli sənəd almış şəxslər malikdirlər.</li>
                <li>Ali və orta ixtisas təhsil pilləsi, habelə yüksək texniki peşə təhsili səviyyəsi üzrə təhsil müəssisələrinin tələbələri (buraxılış kurslarında təhsil alanlar istisna olmaqla) ali təhsil müəssisələrinə qəbul olmaq üçün müsabiqədə iştirak edə bilməzlər.</li>
                <li>Bakalavriat (əsas (baza ali) tibb təhsili) səviyyəsində təhsil dövlət sifarişi əsasında (dövlət büdcəsinin vəsaiti hesabına) və ya ödənişli əsaslarla həyata keçirilir.</li>
                <li>“Təhsil haqqında” Azərbaycan Respublikası Qanununun 5.4-cü maddəsinə əsasən, dövlət ali təhsilin hər bir səviyyəsində təhsilalanların yalnız bir dəfə pulsuz təhsil almaq hüququnu təmin edir.</li>
                <li>Tələbə qəbulu DİM tərəfindən mərkəzləşdirilmiş qaydada iki mərhələdə keçirilən imtahanda əldə edilən nəticələrə əsasən həyata keçirilir. Müsabiqədə iştirak ödənişlidir.</li>
            </ul>
        )
    },
    {
        title: '2. Ərizələrin qəbul edilməsi',
        content: (
             <p>Abituriyentlər tələbə qəbulu üzrə müsabiqədə iştirak etmək üçün DİM-in rəsmi internet saytında “Abituriyentin elektron ərizəsi”ni doldurmalıdırlar. Cari ilin məzunları ərizəni özləri təsdiq edir, əvvəlki illərin məzunları isə sənədlərini Sənəd Qəbulu Komissiyalarına təqdim etməklə ərizələrini təsdiqlətməlidirlər.</p>
        )
    },
    {
        title: '3. Qəbul imtahanı',
        content: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Birinci mərhələ (Buraxılış imtahanı):</h4>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>Fənlər: Tədris dilinə uyğun olaraq Azərbaycan (rus) dili, xarici dil və riyaziyyat.</li>
                        <li>Maksimal bal: 300 (hər fənn üzrə 100 bal).</li>
                        <li>Qüvvədə olma müddəti: 2 il.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold">İkinci mərhələ (İxtisas qrupları üzrə):</h4>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>İxtisas qruplarına uyğun fənlərdən keçirilir.</li>
                        <li>Maksimal bal: 400.</li>
                        <li>Qüvvədə olma müddəti: 1 il (yalnız cari tədris ili üçün).</li>
                        <li>İmtahanlar ildə iki dəfə (yaz və yay) keçirilir.</li>
                    </ul>
                </div>
            </div>
        )
    },
     {
        title: '4. İxtisas seçimi və müsabiqə',
        content: (
             <div className="space-y-4">
                <p>İmtahan nəticələri müəyyən edilmiş müsabiqə şərtlərinə uyğun olan abituriyentlər ixtisas seçiminə buraxılırlar. Abituriyentlər imtahan verdikləri qrupa aid ixtisasları istədikləri ardıcıllıqla seçirlər. Yerləşdirmə abituriyentin topladığı ümumi bal əsasında, seçdiyi ixtisasların ardıcıllığı nəzərə alınmaqla aparılır.</p>
                <div>
                    <h4 className="font-semibold">Bərabər ballar olduqda üstünlük:</h4>
                     <ul className="list-disc space-y-2 pl-5">
                        <li>Attestat qiymətlərinin ədədi ortasına;</li>
                        <li>Qabiliyyət imtahanının nəticəsinə (əgər varsa);</li>
                        <li>İkinci mərhələnin ümumi balına və digər göstəricilərə verilir.</li>
                    </ul>
                </div>
            </div>
        )
    },
];


const specialtyGroupsTable = [
    { group: 'I (RK)', specialties: ['Fizika müəllimliyi', 'Riyaziyyat müəllimliyi', 'Texnologiya müəllimliyi', 'Fizika', 'Geologiya', 'Mexanika', 'Riyaziyyat', 'Riyaziyyat və fizika müəllimliyi', 'Aerokosmik mühəndislik', 'Aqromühəndislik', 'Aviasiya təhlükəsizliyi mühəndisliyi', 'Cihaz mühəndisliyi', 'Dəniz naviqasiyası mühəndisliyi', 'Ekologiya mühəndisliyi', 'Elektrik və elektronika mühəndisliyi', 'Energetika mühəndisliyi', 'Geologiya və geofizika mühəndisliyi', 'Geomatika və geodeziya mühəndisliyi', 'Gəmi energetik qurğularının istismarı mühəndisliyi', 'Gəmiqayırma və gəmi təmiri mühəndisliyi', 'Hava nəqliyyatının hərəkətinin təşkili', 'Həyat fəaliyyətinin təhlükəsizliyi mühəndisliyi', 'İnşaat mühəndisliyi', 'Kənd təsərrüfatı texnologiyaları', 'Kimya mühəndisliyi', 'Kommunikasiya sistemləri mühəndisliyi', 'Qida mühəndisliyi', 'Qida texnologiyaları', 'Logistika və nəqliyyat texnologiyaları mühəndisliyi', 'Maşın mühəndisliyi', 'Materiallar mühəndisliyi', 'Mexanika mühəndisliyi', 'Meliorasiya mühəndisliyi', 'Memarlıq*', 'Metallurgiya mühəndisliyi', 'Mədən mühəndisliyi', 'Mühəndislik fizikası', 'Neft-qaz mühəndisliyi', 'Nəqliyyat mühəndisliyi', 'Nəqliyyat tikintisi mühəndisliyi', 'Radiotexnika və telekommunikasiya mühəndisliyi', 'Sənaye mühəndisliyi', 'Şəhərsalma', 'Şərabçılıq', 'Uçuş mühəndisliyi', 'Yanğın təhlükəsizliyi mühəndisliyi', 'Aqronomluq', 'Balıqçılıq', 'Heyvandarlıq', 'Meşəçilik', 'Torpaqşünaslıq və aqrokimya', 'Yerquruluşu və daşınmaz əmlakın kadastrı', 'Zoomühəndislik', 'Xüsusi rabitə vasitələri mühəndisliyi', 'Sərhəd təhlükəsizliyi və idarəetmə', 'Silah sistemləri mühəndisliyi'] },
    { group: 'I (Rİ)', specialties: ['İnformatika (rəqəmsal bacarıqlar) müəllimliyi', 'Riyaziyyat və informatika (rəqəmsal bacarıqlar) müəllimliyi', 'Kompüter elmləri', 'Data analitikası', 'İnformasiya texnologiyaları', 'İnformasiya təhlükəsizliyi', 'Kompüter mühəndisliyi', 'Mexatronika və robototexnika mühəndisliyi', 'Proqram təminatı mühəndisliyi', 'Proseslərin avtomatlaşdırılması mühəndisliyi', 'Sistemlər mühəndisliyi'] },
    { group: 'II', specialties: ['Coğrafiya müəllimliyi', 'Tarix və coğrafiya müəllimliyi', 'Sosiologiya', 'Davamlı inkişaf', 'Beynəlxalq ticarət və logistika', 'Biznesin idarə edilməsi', 'Dövlət və bələdiyyə idarəetməsi', 'İqtisadiyyat', 'Maliyyə', 'Marketinq', 'Menecment', 'Mühasibat', 'Coğrafiya', 'Hidrometeorologiya', 'Statistika', 'İdman menecmenti və kommunikasiya', 'Nəqliyyatda servis (nəqliyyat növləri üzrə)', 'Turizm bələdçiliyi', 'Turizm işinin təşkili'] },
    { group: 'III (DT)', specialties: ['Azərbaycan dili və ədəbiyyatı müəllimliyi', 'Dil və ədəbiyyat müəllimliyi (dillər üzrə)', 'Xarici dil müəllimliyi (dillər üzrə)', 'Xüsusi pedaqogika', 'İbtidai sinif müəllimliyi', 'Məktəbəqədər təhsil', 'Tarix müəllimliyi', 'Təhsildə sosial-psixoloji xidmət', 'Dinşünaslıq', 'Dövlət və ictimai münasibətlər', 'Fəlsəfə', 'Filologiya (dil və ədəbiyyat göstərilməklə)', 'Hüquqşünaslıq', 'İslamşünaslıq', 'Jurnalistika *', 'Kitabxanaçılıq və informasiya fəaliyyəti', 'Kommunikasiya və rəqəmsal media', 'Politologiya', 'Tarix', 'Tərcümə (dillər üzrə)', 'Ədəbi yaradıcılıq və ekran dramaturgiyası', 'Muzey, arxiv işi və abidələrin qorunması', 'Sənətşünaslıq (sahələr üzrə)', 'Sosial iş', 'Dövlət təhlükəsizliyi və idarəetmə', 'İctimai təhlükəsizlik və idarəetmə'] },
    { group: 'III (TC)', specialties: ['Beynəlxalq münasibətlər', 'Regionşünaslıq (regionlar və ya ölkələr üzrə)'] },
    { group: 'IV', specialties: ['Biologiya müəllimliyi', 'Kimya müəllimliyi', 'Kimya və biologiya müəllimliyi', 'Psixologiya', 'Biologiya', 'Biotexnologiya', 'Ekologiya', 'Kimya', 'Su bioehtiyatları və akvakultura', 'Bağçılıq və tərəvəzçilik', 'Baytarlıq təbabəti', 'Bitki mühafizəsi', 'Əczaçılıq', 'Fizioterapiya', 'İctimai səhiyyə', 'Qidalanma və diyetologiya', 'Tibb bacısı (qardaşı) işi', 'Hərbi tibb', 'Stomatologiya', 'Tibb'] },
    { group: 'V', specialties: ['Fiziki tərbiyə və çağırışaqədərki hazırlıq müəllimliyi*', 'Musiqi müəllimliyi*', 'Təsviri incəsənət müəllimliyi*', 'Aktyor sənəti (sahələr üzrə)*', 'Bəstəkarlıq*', 'Dekorativ-tətbiqi sənət (sahələr üzrə)*', 'Dirijorluq (sahələr üzrə)*', 'Dizayn (sahələr üzrə)*', 'Heykəltəraşlıq*', 'Xoreoqrafiya sənəti (sahələr üzrə)*', 'İnstrumental ifaçılıq (sahələr üzrə)*', 'Musiqişünaslıq*', 'Operator sənəti*', 'Qrafika*', 'Populyar musiqi və caz ifaçılığı (sahələr üzrə)*', 'Rejissorluq (sahələr üzrə)*', 'Rəngkarlıq*', 'Vokal sənəti (sahələr üzrə)*', 'Adaptiv bədən tərbiyəsi*', 'Kütləvi-sağlamlaşdırıcı idman*', 'Məşqçilik*', 'Ümumi fiziki hazırlıq*'] },
];

const feeFaqs = [
  {
    service: 'Orta ixtisas təhsili müəssisələrinə ümumi orta təhsil bazasında qəbul imtahanı',
    price: '45 AZN',
  },
  {
    service: 'Orta ixtisas təhsili müəssisələrinin xüsusi qabiliyyət tələb edən ixtisaslarına qabiliyyət imtahanı',
    price: '40 AZN',
  },
  {
    service: 'Orta ixtisas təhsili müəssisələrinə tam orta təhsil bazasında qəbul imtahanı',
    price: '45 AZN',
  },
  {
    service: 'Bakalavriat (əsas tibb təhsili) səviyyəsinə qəbul imtahanı (I mərhələ)',
    price: '45 AZN',
  },
  {
    service: 'Bakalavriat (əsas tibb təhsili) səviyyəsinə qəbul imtahanı (II mərhələ)',
    price: '50 AZN',
  },
  {
    service: 'Magistratura səviyyəsinə qəbul imtahanı',
    price: '50 AZN',
  },
  {
    service: 'Rezidenturaya qəbul imtahanı (I mərhələ)',
    price: '60 AZN',
  },
  {
    service: 'Rezidenturaya qəbul imtahanı (II mərhələ)',
    price: '100 AZN',
  },
  {
    service: 'Ali təhsil müəssisələrinin xüsusi qabiliyyət tələb edən ixtisaslarına qabiliyyət imtahanı',
    price: '40 AZN',
  },
  {
    service: 'Azərbaycan dili (dövlət dili kimi) fənnindən imtahan',
    price: '30 AZN',
  },
  {
    service: 'Orta ixtisas təhsili və bakalavriat səviyyəsinə bir fəndən qəbul imtahanı',
    price: '30 AZN',
  },
];

const civilServiceFeeFaqs = [
    {
        category: 'A növü - inzibati rəhbər (idarəetmə) vəzifələr üzrə',
        service: 'AB vəzifə qrupu üzrə test imtahanı',
        price: '118 AZN',
    },
    {
        category: 'A növü - inzibati rəhbər (idarəetmə) vəzifələr üzrə',
        service: 'AC vəzifə qrupu üzrə test imtahanı',
        price: '106 AZN',
    },
    {
        category: 'B növü - inzibati icraçı vəzifələr üzrə',
        service: 'BA vəzifə qrupu üzrə test imtahanı',
        price: '94 AZN',
    },
    {
        category: 'B növü - inzibati icraçı vəzifələr üzrə',
        service: 'BB vəzifə qrupu üzrə test imtahanı',
        price: '82 AZN',
    },
];

const schoolTypes = [
  { no: 1, type: 'İbtidai ümumtəhsil məktəbi' },
  { no: 2, type: 'Ümumi orta ümumtəhsil məktəbi' },
  { no: 3, type: 'Tam orta ümumtəhsil məktəbi' },
  { no: 4, type: 'Lisey' },
  { no: 5, type: 'Gimnaziya' },
  { no: 6, type: 'Ümumi təyinatlı internat tipli ümumtəhsil məktəbi' },
  { no: 7, type: 'İnternat tipli lisey' },
  { no: 8, type: 'İnternat tipli gimnaziya' },
  { no: 9, type: 'İnteqrasiya təlimli internat tipli ümumtəhsil məktəbi' },
  { no: 10, type: 'İnteqrasiya təlimli ümumtəhsil məktəbi' },
  { no: 11, type: 'Xüsusi ümumtəhsil məktəbi' },
  { no: 12, type: 'İnternat tipli xüsusi ümumtəhsil məktəbi' },
  { no: 13, type: 'İnternat tipli sanator ümumtəhsil məktəbi' },
];

const advisoryCenters = [
    {
        city: 'Bakı şəhəri',
        centers: [
            { name: 'Azərbaycan Universiteti', address: 'Bakı şəhəri, Nəsimi rayonu, Ceyhun Hacıbəyli küç., 71.', phone: '+994 12 431 41 17' },
            { name: 'Bakı Biznes Universiteti', address: 'Bakı şəhəri, Yasamal rayonu, H. Zərdabi küç., 88a.', phone: '+994 12 431 79 51 (daxili nömrə: 226)' },
            { name: 'Qərbi Kaspi Universiteti', address: 'Bakı şəhəri, Səbail rayonu, İstiqlaliyyət küç, 27.', phone: '+994 12 492 61 63' },
            { name: 'Qərbi Kaspi Universiteti', address: 'Bakı şəhəri, Nərimanov rayonu, Əhməd Rəcəbli küç, 17. ("Prime" hospitalın yanı)', phone: '+994 12 565 39 76' },
            { name: 'Odlar Yurdu Universiteti', address: 'Bakı şəhəri, Nərimanov rayonu, Koroğlu Rəhimov küç., 13.', phone: '+994 12 465 85 27' },
            { name: 'Memarlıq və İnşaat Universiteti', address: 'Bakı şəhəri, Yasamal rayonu, A.Sultanova küç., 11', phone: '+994 12 538 94 63' },
            { name: 'Azərbaycan Texniki Universiteti', address: 'Bakı şəhəri, Yasamal rayonu, H.Cavid prospekti 25', phone: '+99412 538 15 96' },
            { name: 'Bakı Mühəndislik Universiteti', address: 'Xırdalan şəhəri, Həsən Əliyev küç., 120.', phone: '+994 12 349 99 95' },
        ]
    },
    {
        city: 'Sumqayıt şəhəri',
        centers: [
            { name: 'Sumqayıt Dövlət Universiteti', address: 'Sumqayıt şəhəri, 43-cü məhəllə, Bakı küç.,1', phone: '+994 18 642 20 33' }
        ]
    },
    {
        city: 'Gəncə şəhəri',
        centers: [
            { name: 'Azərbaycan Dövlət Aqrar Universiteti', address: 'Aqronomluq və Zoomühəndislik tədris binası Ünvan: Ozan küç., 102', phone: '(022) 266 00 47' }
        ]
    },
    {
        city: 'DİM Regional Bölmələri',
        centers: [
            { name: 'Naxçıvan MR Regional Bölməsi', address: 'Naxçıvan şəhəri, Atatürk küç., 10', phone: '+994 36 544 04 02' },
            { name: 'Göyçay Regional Bölməsi', address: 'Göyçay şəhəri, Rauf İsayev küç., 43', phone: '+994 20 274 66 74' },
            { name: 'Şəki Regional Bölməsi', address: 'Şəki şəhəri, M.Rəsulzadə prospekti, 182.', phone: '+994 24 244 66 14' },
            { name: 'Xaçmaz Regional Bölməsi', address: 'Xaçmaz şəhəri, M.Rəsulzadə küç., 7b.', phone: '+994 23 325 01 21' },
            { name: 'Lənkəran Regional Bölməsi', address: 'Lənkəran şəhəri, H.Aslanov xiyabanı 52', phone: '+994 25 255 24 82' },
            { name: 'Gəncə Regional Bölməsi', address: 'Gəncə şəhəri, H.Əliyev meydanı, İnzibati bina.', phone: '+994 22 266 50 67' },
            { name: 'Şirvan Regional Bölməsi', address: 'Şirvan şəhəri, Rəsulzadə küç, 19', phone: '+994 21 215 15 23' },
            { name: 'Bərdə Regional Bölməsi', address: 'Bərdə ş., H.Əliyev prospekti, 100', phone: '+994 20 205-01-86' },
            { name: 'Şəmkir Regional Bölməsi', address: 'Şəmkir, Bakı-Qazax şosesi, İnzibati bina “West gate”', phone: '+994 55 214 97 00' },
        ]
    }
]

export default function FaqPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 sm:px-8 py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Qəbul Qaydaları və Məlumat</CardTitle>
          <CardDescription>
            Tələbə qəbulu prosesi, qaydalar, elanlar və ödənişli xidmətlərlə bağlı ətraflı məlumat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-main-rules">
              <AccordionTrigger className="text-xl font-semibold">
                Ali Təhsil Müəssisələrinə Tələbə Qəbulu Qaydaları (Rəsmi)
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                 <Accordion type="single" collapsible className="w-full">
                    {admissionRules.map((rule, index) => (
                         <AccordionItem value={`rule-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-medium">{rule.title}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {rule.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-announcement">
                <AccordionTrigger className="text-xl font-semibold">
                    2025-ci il üzrə Tələbə Qəbulu Elanı (Bakalavriat)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Ərizə qəbulu</h3>
                        <p>Ali təhsil müəssisələrinə qəbul olmaq hüququna tam orta, yüksək texniki peşə, orta ixtisas və ya ali təhsili başa vurmaq haqqında müvafiq dövlət nümunəli sənəd almış şəxslər malikdirlər. Yüksək texniki peşə, orta ixtisas və ali təhsil müəssisələrinin tələbələri (buraxılış kurslarında təhsil alanlar istisna olmaqla) ali təhsil müəssisələrinə qəbul olmaq üçün müsabiqədə iştirak edə bilməzlər.</p>
                        <p>Ali təhsil müəssisələrinə tələbə qəbulu ilə bağlı ərizələrin qəbulu iki mərhələdə (yalnız V ixtisas qrupu üzrə müsabiqədə iştirak etmək istəyən abituriyentlər üçün bir mərhələdə) olmaqla internet vasitəsilə aparılır.</p>
                    </div>
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold text-foreground">Ərizə qəbulunun 1-ci mərhələsi (bütün abituriyentlər üçün)</h4>
                        <p>Ərizə qəbulunun birinci mərhələsi <strong>2025-ci il fevralın 20-dən martın 5-dək</strong> həyata keçirilir. Bu mərhələdə bütün abituriyentlər DİM-in internet saytının ekabinet.dim.gov.az səhifəsində “Şəxsi kabinet” yaratdıqdan sonra, “Abituriyentin elektron ərizəsi” formasını doldurur və təsdiq edirlər (etdirirlər).</p>
                        <p>Müsabiqədə iştirak ödənişlidir. Abituriyentlər tələb olunan məbləği şəxsi kabinetlərindəki hesablarına əlavə edirlər və həmin məbləğ ərizə təsdiq olunduqda hesabdan çıxılır.</p>
                    </div>
                     <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-foreground">İmtahanların Keçirilməsi</h3>
                         <p>Hər bir imtahanın yeri və vaxtı barədə məlumat “İmtahana buraxılış vərəqəsi”ndə qeyd olunur və imtahandan azı 5 gün əvvəl DİM-in internet saytında yerləşdirilir.</p>
                         <p>Qəbul imtahanının birinci mərhələsində abituriyentlərə tədris dilinə uyğun olaraq Azərbaycan (rus) dili, xarici dil və riyaziyyat fənlərindən ümumilikdə 85 tapşırıq təqdim olunur. İmtahan müddəti 3 saatdır və maksimal bal 300-dür.</p>
                     </div>
                      <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-foreground">Subbakalavrların Nəzərinə</h3>
                         <p>Orta ixtisas təhsili pilləsi və ya yüksək texniki peşə təhsili səviyyəsi üzrə “subbakalavr” peşə-ixtisas dərəcəsi almış şəxslər qəbul imtahanlarında iştirak etmədən ali təhsil müəssisələrinə müsabiqə yolu ilə qəbul olmaq hüququna malikdirlər.</p>
                         <p>Ərizə qəbulu DİM tərəfindən elan olunacaq müddətdə internet vasitəsilə aparılır və müsabiqədə iştirak ödənişsizdir.</p>
                     </div>
                     <Alert variant="default" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Qəbul imtahanını Azərbaycan dilindən fərqli dildə verən abituriyentlərin nəzərinə:</AlertTitle>
                        <AlertDescription>
                            <p>“Azərbaycan dili (dövlət dili kimi)” fənni imtahanından “məqbul” ala bilməyən abituriyentlər ali və tam orta təhsil bazasında orta ixtisas təhsili müəssisələrinə qəbul üçün keçirilən müsabiqəyə buraxılmırlar.</p>
                            <p>“Azərbaycan dili (dövlət dili kimi)” fənni üzrə imtahanın nəticələri iki il qüvvədə olduğundan, 2024-cü ildə bu imtahandan “məqbul” alan abituriyentlər cari ildə bu imtahanda iştirak etmirlər.</p>
                        </AlertDescription>
                    </Alert>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-college-announcement">
              <AccordionTrigger className="text-xl font-semibold">
                Orta İxtisas Təhsili Müəssisələrinə Tələbə Qəbulu Elanı (11 illik baza)
              </AccordionTrigger>
              <AccordionContent className="space-y-6 text-muted-foreground">
                <div className="space-y-2">
                  <p>Tam (11 illik) orta təhsil bazasında orta ixtisas təhsili müəssisələrinə qəbul olmaq hüququna tam orta, orta ixtisas və ya ali təhsili başa vurması haqqında müvafiq dövlət nümunəli sənəd almış şəxslər malikdirlər.</p>
                  <p>Orta ixtisas və ali təhsil müəssisələrinin tələbələri (buraxılış kurslarında təhsil alanlar istisna olmaqla) orta ixtisas təhsili müəssisələrinə qəbul olmaq üçün müsabiqədə iştirak edə bilməzlər.</p>
                </div>
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold text-foreground">Ərizə Qəbulu</h4>
                  <p>Orta ixtisas təhsili müəssisələrinə ərizələrin qəbulu <strong>2025-ci il fevralın 20-dən martın 5-dək</strong> internet vasitəsilə aparılır. Abituriyentlər DİM-in ekabinet.dim.gov.az saytında "Şəxsi kabinet" yaratdıqdan sonra "Abituriyentin elektron ərizəsi" formasını doldurub təsdiq etməlidirlər. Müsabiqədə iştirak ödənişlidir.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">İmtahanlar</h4>
                  <p>İmtahan 6 aprel 2025-ci il tarixində keçirilməsi nəzərdə tutulur. Abituriyentlər tədris dilinə uyğun olaraq Azərbaycan (rus) dili, riyaziyyat və xarici dil fənlərindən imtahan verirlər. Ümumilikdə 85 tapşırıq təqdim olunur və maksimal bal 300-dür. İmtahan müddəti 3 saatdır.</p>
                   <p>Tam orta təhsil səviyyəsini cari ildə bitirən abituriyentlər qəbul imtahanı vermirlər və müsabiqədə buraxılış imtahanı nəticələri əsasında iştirak edirlər. Qəbul (buraxılış) imtahanlarının nəticələri 2 il qüvvədə olur.</p>
                </div>
                <div className="space-y-4">
                   <h4 className="font-semibold text-foreground">İxtisas Seçimi və Müsabiqə Şərtləri</h4>
                   <p>İxtisas seçiminə ümumi balı 50-dən, Azərbaycan (rus) dili və riyaziyyat fənlərinin hər biri üzrə balı 10-dan az olmayan abituriyentlər buraxılır (xarici dil üzrə məhdudiyyət yoxdur).</p>
                   <p>Xüsusi qabiliyyət tələb edən ixtisasların müsabiqəsinə isə ümumi balı 40-dan ("Xoreoqrafiya sənəti" və "Rəqs müəllimliyi" üçün 30-dan) az olmayan və qabiliyyət imtahanından "məqbul" alanlar buraxılır.</p>
                </div>
                <Alert variant="default" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Qəbul imtahanını Azərbaycan dilindən fərqli dildə verən abituriyentlərin nəzərinə:</AlertTitle>
                    <AlertDescription>
                        <p>“Azərbaycan dili (dövlət dili kimi)” fənni imtahanından “məqbul” ala bilməyən abituriyentlər ali və tam orta təhsil bazasında orta ixtisas təhsili müəssisələrinə qəbul üçün keçirilən müsabiqəyə buraxılmırlar.</p>
                        <p>“Azərbaycan dili (dövlət dili kimi)” fənni üzrə imtahanın nəticələri iki il qüvvədə olduğundan, 2024-cü ildə bu imtahandan “məqbul” alan abituriyentlər cari ildə bu imtahanda iştirak etmirlər.</p>
                    </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-out-of-competition">
                <AccordionTrigger className="text-xl font-semibold">
                    Ali Məktəblərə Müsabiqədənkənar Qəbul
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-foreground">Bakalavrlar və Subbakalavrlar üçün Keçid</h4>
                        <p>2019-2020-ci tədris ilindən etibarən bakalavrlar ali təhsil pilləsi üzrə aldıqları ixtisasdan asılı olmayaraq, orta ixtisas təhsili müəssisələrinə ödənişli əsaslarla müsabiqədənkənar qəbul ola bilərlər. Eyni zamanda, subbakalavrlar (kollec məzunları) da qəbul imtahanlarında iştirak etmədən, müvafiq şərtlər daxilində ali təhsil müəssisələrinin bakalavriat səviyyəsinə qəbul olmaq imkanı əldə edirlər.</p>
                        <p>Subbakalavrların ali təhsil müəssisələrinə qəbulu zamanı onların orta müvəffəqiyyət göstəricisi (ÜOMG) nəzərə alınır və ixtisas uyğunluğu Təhsil Nazirliyi ilə razılaşdırılmaqla DİM tərəfindən müəyyən edilir. Müsabiqə zamanı abituriyentlər yerləşdirildikdən sonra boş qalan yerlərə subbakalavrlar yerləşdirilir.</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-foreground">Beynəlxalq Təhsil Proqramları üzrə Qəbul</h4>
                        <p>IB Diploma Programme, Advanced Level of General Certificate of Education (A-Level) və Advanced Placement (AP) kimi beynəlxalq səviyyədə akkreditasiya olunmuş proqramlar üzrə təhsil almış abituriyentlər, DİM tərəfindən müəyyən edilmiş şərtlər və keçid balları əsasında ali təhsil müəssisələrinə müsabiqədənkənar qəbul oluna bilərlər. Bu zaman onların proqram çərçivəsində topladıqları ballar və müvafiq fənlər nəzərə alınır.</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-foreground">Olimpiada və Müsabiqə Qaliblərinin Qəbulu</h4>
                        <p>Beynəlxalq və respublika fənn olimpiadalarının, beynəlxalq müsabiqələrin və yarışların qalibləri DİM tərəfindən keçirilən tələbə qəbulu üzrə müsabiqədə iştirak etmədən, müvafiq ixtisaslar üzrə birbaşa ali təhsil müəssisələrinə qəbul olunurlar. Bu hüquq müəyyən müddət ərzində (fənn olimpiadaları üçün 2 il, digər yarışlar üçün 5 il) və yalnız bir dəfə istifadə edilə bilər.</p>
                        
                        <div className="p-4 border rounded-lg">
                            <h5 className="font-semibold text-foreground mb-2">Respublika Fənn Olimpiadaları qalibləri üçün ixtisaslar:</h5>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li><strong>Azərbaycan dili və ədəbiyyat:</strong> Azərbaycan dili və ədəbiyyatı müəllimliyi, məktəbəqədər təlim və tərbiyə, ibtidai sinif müəllimliyi, korreksiyaedici təlim, filologiya, jurnalistika, kitabşünaslıq.</li>
                                <li><strong>Tarix:</strong> Tarix, tarix müəllimliyi, tarix və coğrafiya müəllimliyi, antropologiya, politologiya, fəlsəfə, kitabşünaslıq, sosiologiya, muzeyşünaslıq, arxiv işi və abidələrin qorunması.</li>
                                <li><strong>Coğrafiya:</strong> Coğrafiya, coğrafiya müəllimliyi, tarix və coğrafiya müəllimliyi, regionşünaslıq, ekologiya, hidrometeorologiya.</li>
                                <li><strong>Riyaziyyat:</strong> Riyaziyyat, riyaziyyat müəllimliyi, riyaziyyat və informatika müəllimliyi, mexanika, kompüter elmləri, müxtəlif mühəndislik ixtisasları, statistika.</li>
                                <li><strong>Fizika:</strong> Fizika, fizika müəllimliyi, mexanika, geofizika mühəndisliyi, elektroenergetika mühəndisliyi, elektrik mühəndisliyi, materialşünaslıq mühəndisliyi.</li>
                                <li><strong>Kimya:</strong> Kimya, kimya müəllimliyi, kimya və biologiya müəllimliyi, ekologiya, qida məhsulları mühəndisliyi.</li>
                                <li><strong>Biologiya:</strong> Biologiya, biologiya müəllimliyi, kimya və biologiya müəllimliyi, ekologiya, balıqçılıq, aqronomluq, baytarlıq, psixologiya, qida məhsulları mühəndisliyi.</li>
                                <li><strong>İnformatika:</strong> Riyaziyyat və informatika müəllimliyi, informatika müəllimliyi, kompüter elmləri, kompüter mühəndisliyi, proseslərin avtomatlaşdırılması mühəndisliyi, informasiya texnologiyaları, sistem mühəndisliyi, mexatronika və robototexnika mühəndisliyi.</li>
                            </ul>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-specialty-groups">
                 <AccordionTrigger className="text-xl font-semibold">
                    İxtisas Qrupları və İxtisaslar
                 </AccordionTrigger>
                 <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Aşağıdakı cədvəldə bakalavriat səviyyəsi üzrə ixtisasların qruplar və altqruplar üzrə bölgüsü verilmişdir. Ulduz (*) ilə işarələnmiş ixtisaslar xüsusi qabiliyyət tələb edir.
                    </p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">İxtisas Qrupu (Altqrupu)</TableHead>
                                <TableHead className="font-bold">İxtisaslar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {specialtyGroupsTable.map((group, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium align-top">{group.group}</TableCell>
                                    <TableCell>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {group.specialties.map((specialty, sIndex) => (
                                                <li key={sIndex}>{specialty}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-attestation-form">
              <AccordionTrigger className="text-xl font-semibold">
                Attestat Qiymətləri Haqqında Arayış Forması
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <div className="p-4 border rounded-lg bg-background/50">
                  <h4 className="text-center font-bold text-foreground mb-4">ARAYIŞ №</h4>
                  <p className="text-center text-sm mb-4">(Ali və orta ixtisas təhsili müəssisələrinin məzunlarının attestat qiymətləri haqqında)</p>
                  <p className="mb-2">Verilir _____________________________________________________________</p>
                  <p className="text-xs text-center -mt-2 mb-2">(arayışı verən təhsil müəssisəsinin adı)</p>
                  <p className="mb-2">məzunu ____________________________________________________</p>
                  <p className="text-xs text-center -mt-2 mb-2">(soyadı, adı, atasının adı)</p>
                  <p className="mb-4">ondan ötrü ki, həqiqətən onun qeyd olunan fənlər üzrə attestat qiymətləri aşağıdakı kimidir:</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <p>Tədris (____________) dili ____</p>
                    <p>Ədəbiyyat ____</p>
                    <p>Xarici dil ____</p>
                    <p>Riyaziyyat ____</p>
                    <p>Azərbaycan tarixi ____</p>
                    <p>Ümumi tarix ____</p>
                    <p>Fizika ____</p>
                    <p>Kimya ____</p>
                    <p>Biologiya ____</p>
                    <p>Coğrafiya ____</p>
                  </div>
                  <p className="mt-4">Arayış Sənəd Qəbulu Komissiyasına təqdim edilmək üçün verilir.</p>
                  <div className="flex justify-between items-end mt-6">
                    <div>
                        <p>Tarix: _____ ___________ 20__-ci il</p>
                    </div>
                    <div className="text-center">
                        <p>Məsul şəxs _____________ _________________________ M.Y.</p>
                        <p className="text-xs">(İmza) (soyadı, adı, atasının adı)</p>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link href="https://eservices.dim.gov.az/erizebak/erize/App_Docs/F2.doc" target="_blank">
                    Arayış formasını yüklə (.doc)
                  </Link>
                </Button>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-education-type-form">
              <AccordionTrigger className="text-xl font-semibold">
                Təhsilin Dövlət Hesabına və ya Ödənişli Əsaslarla Olması Haqqında Arayış Forması
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <div className="p-4 border rounded-lg bg-background/50">
                  <h4 className="text-center font-bold text-foreground mb-4">ARAYIŞ №</h4>
                   <p className="mb-2">Verilir ______________________________________________________________</p>
                  <p className="text-xs text-center -mt-2 mb-2">(təhsil müəssisəsinin adı)</p>
                  <p className="mb-2">_____________________________________________________________________</p>
                   <p className="text-xs text-center -mt-2 mb-2">(təhsil aldığı ixtisasın adı)</p>
                  <p className="mb-4">_____________________________üzrə _______________ təhsilini ______-___ ildə başa vuran ________________________________________________ ondan ötrü ki, həqiqətən, o, ________________ təhsilini ___________________________ almışdır.</p>
                   <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs -mt-4 mb-4 text-center">
                        <p>(bakalavr, orta ixtisas)</p>
                        <p>(soyadı, adı, atasının adı)</p>
                        <p>(bakalavr, orta ixtisas)</p>
                        <p>(dövlət hesabına, ödənişli əsaslarla)</p>
                   </div>
                  <p>Arayış Sənəd Qəbulu Komissiyasına təqdim edilmək üçün verilir.</p>
                  <div className="flex justify-between items-end mt-6">
                    <div>
                        <p>Tarix: _____ ___________ 20__-ci il</p>
                    </div>
                    <div className="text-center">
                        <p>Məsul şəxs _____________ _________________________ M.Y.</p>
                        <p className="text-xs">(İmza) (soyadı, adı, atasının adı)</p>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link href="https://eservices.dim.gov.az/erizebak/erize/App_Docs/F3.doc" target="_blank">
                    Arayış formasını yüklə (.doc)
                  </Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-advisory-centers">
                <AccordionTrigger className="text-xl font-semibold">
                    “Abituriyent Məsləhət Mərkəzləri”nin ünvanları
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                    <p className="text-sm">İmtahan iştirakçıları DİM-in təqdim etdiyi xidmətlərlə bağlı Qərbi Kaspi, Azərbaycan, Bakı Biznes, Odlar Yurdu, Memarlıq və İnşaat, Texniki Universitet, Bakı Mühəndislik Universitetlərində, Azərbaycan Dövlət Aqrar Universitetində, Sumqayıt Dövlət Universitetində və DİM-in regional bölmələrində ödənişsiz əsaslarla fəaliyyət göstərən “Abituriyent Məsləhət Mərkəzləri”nə müraciət edə bilərlər. Mərkəzlər həftənin 5 günü (şənbə və bazar günləri istisna olmaqla) saat 10:00-dan 17:00-dək fəaliyyət göstərir.</p>
                    {advisoryCenters.map((region, index) => (
                        <div key={index} className="space-y-4">
                            <h4 className="font-semibold text-foreground text-lg">{region.city}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {region.centers.map((center, cIndex) => (
                                    <div key={cIndex} className="p-3 border rounded-md space-y-1">
                                        <p className="font-medium text-foreground">{center.name}</p>
                                        <p className="text-sm"><strong>Ünvan:</strong> {center.address}</p>
                                        <p className="text-sm"><strong>Telefon:</strong> {center.phone}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-fees">
              <AccordionTrigger className="text-xl font-semibold">
                Tələbə Qəbulu ilə Bağlı Bəzi Ödənişli Xidmətlərin Tarifləri
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Xidmətin adı</TableHead>
                      <TableHead className="text-right">Qiymət</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeFaqs.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell>{fee.service}</TableCell>
                        <TableCell className="text-right font-medium">
                          {fee.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 <p className="text-xs text-muted-foreground mt-2">Son yenilənmə tarixi: 22.01.2025</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-civil-service-fees">
              <AccordionTrigger className="text-xl font-semibold">
                Dövlət Qulluğu ilə Bağlı Ödənişli Xidmətlərin Tarifləri
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kateqoriya</TableHead>
                      <TableHead>Xidmətin adı</TableHead>
                      <TableHead className="text-right">Qiymət</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {civilServiceFeeFaqs.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell className="align-top">{fee.category}</TableCell>
                        <TableCell>{fee.service}</TableCell>
                        <TableCell className="text-right font-medium align-top">
                          {fee.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2">Son yenilənmə tarixi: 22.01.2025</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-school-types">
              <AccordionTrigger className="text-xl font-semibold">
                Ümumi Təhsil Müəssisələrinin Növləri
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Növü</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolTypes.map((school) => (
                      <TableRow key={school.no}>
                        <TableCell className="font-medium">{school.no}</TableCell>
                        <TableCell>{school.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
