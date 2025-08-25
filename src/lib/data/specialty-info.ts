
export interface SpecialtyInfo {
  skills: string;
  careers: string;
}

export const specialtyInfo: Record<string, SpecialtyInfo> = {
    'Bank işi': {
        skills: 'Analitik düşüncə, riyazi biliklər, müştərilərlə işləmə bacarığı, məsuliyyət və diqqətlilik.',
        careers: 'Bank mütəxəssisi, kredit mütəxəssisi, valyuta əməliyyatları üzrə mütəxəssis, maliyyə məsləhətçisi, sığorta agenti.',
    },
    'Maliyyə işi': {
        skills: 'Riyazi və analitik qabiliyyət, strateji düşünmə, maliyyə təhlili bacarıqları, detallara diqqət, proqnozlaşdırma.',
        careers: 'Maliyyəçi, maliyyə analitiki, investisiya məsləhətçisi, büdcə planlaşdırma mütəxəssisi, auditor.',
    },
    'Mühasibat uçotu': {
        skills: 'Dəqiqlik, detallara diqqət, riyazi biliklər, qanunvericiliklə işləmə bacarığı, məntiqi düşüncə, məsuliyyət.',
        careers: 'Mühasib, baş mühasib, auditor, vergi müfəttişi, maliyyə nəzarətçisi, daxili nəzarət mütəxəssisi.',
    },
    'Vergi işi': {
        skills: 'Qanunvericiliklə işləmə bacarığı, analitik təhlil, detallara diqqət, məsuliyyət, ünsiyyət qurma bacarığı.',
        careers: 'Vergi müfəttişi, vergi məsləhətçisi, auditor, maliyyə hüquqşünası, mühasib.',
    },
    'Sosial iş': {
        skills: 'Empatiya, ünsiyyət qurma, problem həll etmə, səbir, tolerantlıq, insan psixologiyasını anlama.',
        careers: 'Sosial işçi (dövlət və qeyri-hökumət təşkilatlarında), məktəb psixoloqu, reabilitasiya mərkəzi mütəxəssisi, icma təşkilatçısı.',
    },
    'Ailə və ev təhsili': {
        skills: 'Pedaqoji bacarıqlar, uşaq psixologiyası bilikləri, səbir, kreativlik, təşkilatçılıq.',
        careers: 'Tərbiyəçi, ibtidai sinif müəlliminə köməkçi, uşaq inkişaf mərkəzlərində mütəxəssis, dayə, repetitor.',
    },
    'Məktəbəqədər təhsil': {
        skills: 'Uşaqlarla işləmə sevgisi, səbir, kreativlik, pedaqoji biliklər, ünsiyyət qurma, oyun təşkilatçılığı.',
        careers: 'Uşaq bağçası tərbiyəçisi, məktəbəqədər hazırlıq müəllimi, uşaq inkişaf mərkəzi metodisti, oyun terapevti.',
    },
    'Kitabxana işi': {
        skills: 'Sistemli düşüncə, məlumatların təsnifatı bacarığı, diqqətlilik, oxuma sevgisi, kompüter bacarıqları.',
        careers: 'Kitabxanaçı, arxiv işçisi, biblioqraf, məlumat meneceri, elektron resurslar üzrə mütəxəssis.',
    },
    'Ətraf mühitin mühafizəsi və bərpası': {
        skills: 'Təbiət elmlərinə maraq (biologiya, kimya), analitik düşüncə, problem həll etmə, sahə işlərinə hazırlıq.',
        careers: 'Ekoloq, ekoloji monitorinq mütəxəssisi, tullantıların idarə edilməsi üzrə mütəxəssis, su keyfiyyəti nəzarətçisi.',
    },
    'Fizika müəllimliyi': {
        skills: 'Dərin fizika və riyaziyyat bilikləri, pedaqoji bacarıqlar, izah etmə qabiliyyəti, səbir, analitik düşüncə.',
        careers: 'Orta məktəb müəllimi, repetitor, kollec müəllimi, elmi-tədqiqat laboratoriyalarında assistent.',
    },
    'İnformatika müəllimliyi': {
        skills: 'Alqoritmik düşüncə, proqramlaşdırma dilləri biliyi, pedaqoji bacarıqlar, məntiqi təfəkkür, texnoloji yeniliklərə maraq.',
        careers: 'Orta məktəb müəllimi, İT tədris mərkəzlərində təlimçi, sistem inzibatçısı, proqramçı.',
    },
    'Riyaziyyat müəllimliyi': {
        skills: 'Güclü riyazi biliklər, məntiqi və abstrakt düşüncə, izah etmə və öyrətmə bacarığı, səbir.',
        careers: 'Orta məktəb müəllimi, kollec müəllimi, repetitor, maliyyə və sığorta sahələrində analitik.',
    },
    'Kompüter elmləri': {
        skills: 'Alqoritmik və analitik düşüncə, proqramlaşdırma bacarıqları (Python, Java, C++), problem həll etmə, məntiq.',
        careers: 'Proqram təminatı mühəndisi, sistem analitiki, məlumat bazası inzibatçısı, süni intellekt mütəxəssisi, oyun tərtibatçısı.',
    },
    'İnformasiya təhlükəsizliyi': {
        skills: 'Şəbəkə texnologiyaları biliyi, analitik təfəkkür, diqqətlilik, problem həll etmə, kiberhücumlara qarşı biliklər.',
        careers: 'Kiber təhlükəsizlik mütəxəssisi, informasiya təhlükəsizliyi analitiki, pentester, şəbəkə təhlükəsizliyi mühəndisi.',
    },
    'Kimya mühəndisliyi': {
        skills: 'Dərin kimya və riyaziyyat bilikləri, laboratoriya işi bacarıqları, analitik düşüncə, problem həll etmə.',
        careers: 'Neft-kimya sənayesində mühəndis, qida sənayesi texnoloqu, əczaçılıq şirkətlərində mütəxəssis, keyfiyyətə nəzarət mühəndisi.',
    },
    'Qida mühəndisliyi': {
        skills: 'Kimya və biologiya bilikləri, texnoloji prosesləri anlama, gigiyena və təhlükəsizlik standartlarına riayət etmə.',
        careers: 'Qida texnoloqu, keyfiyyətə nəzarət mütəxəssisi, istehsalat meneceri, yeni məhsul tərtibatçısı.',
    },
    'Coğrafiya müəllimliyi': {
        skills: 'Geniş coğrafi biliklər, xəritə ilə işləmə bacarığı, pedaqoji qabiliyyət, təbiətə maraq, ünsiyyət.',
        careers: 'Orta məktəb müəllimi, turizm bələdçisi, ekoloq, kartoqraf, landşaft planlaşdırıcısı.',
    },
    'Sosiologiya': {
        skills: 'Tənqidi düşüncə, müşahidə və analiz bacarığı, sorğu keçirmə metodları, statistik məlumatlarla işləmə, ünsiyyət.',
        careers: 'Sosioloq-tədqiqatçı, marketinq araşdırmaları üzrə mütəxəssis, İnsan Resursları mütəxəssisi, ictimai rəy analitiki.',
    },
    'Beynəlxalq ticarət və logistika': {
        skills: 'Xarici dil bilikləri, coğrafi biliklər, danışıqlar aparma bacarığı, təşkilatçılıq, analitik düşüncə.',
        careers: 'Logistika meneceri, idxal-ixrac mütəxəssisi, təchizat zəncirinin idarə edilməsi üzrə mütəxəssis, gömrük bəyannaməçisi.',
    },
    'Biznesin idarə edilməsi': {
        skills: 'Liderlik, təşkilatçılıq, strateji planlaşdırma, ünsiyyət, problem həll etmə, maliyyə savadlılığı.',
        careers: 'Layihə meneceri, satış meneceri, marketinq meneceri, insan resursları meneceri, öz biznesini qurma imkanı.',
    },
    'İqtisadiyyat': {
        skills: 'Güclü riyazi və analitik təfəkkür, statistik analiz bacarığı, bazar proseslərini anlama, proqnozlaşdırma.',
        careers: 'İqtisadçı, maliyyə analitiki, bank mütəxəssisi, bazar araşdırmaçısı, dövlət qurumlarında iqtisadi planlaşdırma üzrə mütəxəssis.',
    },
    'Maliyyə': {
        skills: 'Riyazi biliklər, maliyyə hesabatlarını anlama, investisiya analizi, risklərin idarə edilməsi, detallara diqqət.',
        careers: 'Maliyyə meneceri, investisiya bankiri, sığorta mütəxəssisi, maliyyə nəzarətçisi, birja treyderi.',
    },
    'Menecment': {
        skills: 'Liderlik, komanda ilə işləmə, təşkilatçılıq, planlaşdırma, motivasiya etmə, qərar qəbul etmə.',
        careers: 'Şöbə müdiri, layihə rəhbəri, satış direktoru, əməliyyatlar meneceri, insan resursları meneceri.',
    },
    'Turizm işinin təşkili': {
        skills: 'Xarici dil bilikləri, coğrafiya, ünsiyyət və təqdimat bacarığı, təşkilatçılıq, müştəri məmnuniyyətinə yönümlülük.',
        careers: 'Tur agenti, otel meneceri, bələdçi, tədbir təşkilatçısı, aviaşirkət nümayəndəsi.',
    },
    'Azərbaycan dili və ədəbiyyatı müəllimliyi': {
        skills: 'Dərin ədəbi və qrammatik biliklər, natiqlik mədəniyyəti, pedaqoji bacarıqlar, tənqidi düşüncə.',
        careers: 'Orta məktəb müəllimi, redaktor, korrektor, jurnalist, tərcüməçi, elmi işçi.',
    },
    'Tarix müəllimliyi': {
        skills: 'Geniş tarixi biliklər, analitik təfəkkür, mənbələrlə işləmə bacarığı, pedaqoji qabiliyyət, hadisələr arasında əlaqə qurma.',
        careers: 'Orta məktəb müəllimi, arxiv işçisi, muzey bələdçisi, elmi-tədqiqatçı, analitik.',
    },
    'Hüquqşünaslıq': {
        skills: 'Güclü məntiq, analitik təfəkkür, detallara diqqət, qanunvericilik bazasını anlama, natiqlik və mübahisə etmə bacarığı.',
        careers: 'Vəkil, hakim, prokuror, notarius, hüquq məsləhətçisi, müstəntiq.',
    },
    'Psixologiya': {
        skills: 'Empatiya, dinləmə bacarığı, müşahidəçilik, analitik düşüncə, nəzəri biliklər, məxfilik prinsiplərinə riayət etmə.',
        careers: 'Klinik psixoloq, məktəb psixoloqu, korporativ psixoloq (HR), məsləhətçi psixoloq, koç.',
    },
    'Biologiya müəllimliyi': {
        skills: 'Dərin biologiya bilikləri, təbiətə maraq, müşahidəçilik, pedaqoji bacarıqlar, laboratoriya təcrübəsi.',
        careers: 'Orta məktəb müəllimi, ekoloq, laborant, elmi-tədqiqat institutlarında assistent, botanika və zooparklarda mütəxəssis.',
    },
    'Kimya müəllimliyi': {
        skills: 'Dərin kimya bilikləri, riyazi təfəkkür, laboratoriya işlərinə həvəs, təhlükəsizlik qaydalarına riayət etmə, öyrətmə bacarığı.',
        careers: 'Orta məktəb müəllimi, laborant, qida və dərman sənayesində keyfiyyətə nəzarət mütəxəssisi, ekoloq-kimyaçı.',
    },
    'Əczaçılıq': {
        skills: 'Dərin kimya və biologiya bilikləri, məsuliyyət, diqqətlilik, dəqiqlik, insanlara kömək etmək istəyi.',
        careers: 'Əczaçı (aptekdə), klinik əczaçı (xəstəxanada), dərman istehsalı müəssisələrində mütəxəssis, tibbi nümayəndə.',
    },
    'Tibb': {
        skills: 'Güclü yaddaş, məntiqi təfəkkür, məsuliyyət hissi, stressə davamlılıq, insan anatomiyası və fiziologiyası üzrə dərin biliklər.',
        careers: 'Həkim (terapevt, cərrah, pediatr və s.), elmi-tədqiqatçı, səhiyyə meneceri, tibbi ekspert.',
    },
    'Stomatologiya': {
        skills: 'Əl qabiliyyəti, dəqiqlik, detallara diqqət, estetik hissiyyat, pasiyentlərlə ünsiyyət qurma bacarığı.',
        careers: 'Stomatoloq-terapevt, stomatoloq-cərrah, ortodont, ortoped, uşaq stomatoloqu.',
    },
    'Fiziki tərbiyə və çağırışaqədərki hazırlıq müəllimliyi': {
        skills: 'Yaxşı fiziki hazırlıq, liderlik, təşkilatçılıq, nizam-intizam, pedaqoji biliklər, motivasiya etmə bacarığı.',
        careers: 'Orta məktəbdə fiziki tərbiyə və Gənclərin Çağırışaqədərki Hazırlığı müəllimi, məşqçi, fitnes təlimatçısı.',
    },
    'Dizayn': {
        skills: 'Kreativlik, rəsm çəkmə bacarığı, rəng hissi, estetik zövq, kompüter proqramları (Photoshop, Illustrator, 3ds Max və s.) ilə işləmə.',
        careers: 'Qrafik dizayner, interyer dizayneri, veb-dizayner, geyim dizayneri, landşaft dizayneri, reklam agentliklərində art-direktor.',
    },
};
