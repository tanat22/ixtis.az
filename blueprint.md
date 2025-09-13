
# Layihənin Planı: İnteraktiv Təhsil Bələdçisi

## Baxış

Bu sənəd "İnteraktiv Təhsil Bələdçisi" adlı Next.js tətbiqinin məqsədini, funksionallığını və dizayn prinsiplərini təsvir edir. Tətbiq Azərbaycanın təhsil müəssisələri (universitetlər, kolleclər) və ixtisasları haqqında mərkəzləşdirilmiş, interaktiv və istifadəçi üçün rahat bir platforma təmin etmək məqsədi daşıyır.

Əsas hədəf abituriyentlərə və tələbələrə ixtisas seçimi prosesində fərdiləşdirilmiş məsləhətlər və güclü qərar dəstəyi alətləri təqdim etməkdir.

## Tətbiq Olunmuş Xüsusiyyətlər və Dizayn

Bu bölmə layihənin ilkin versiyasından indiki vəziyyətinə qədər tətbiq edilmiş bütün əsas xüsusiyyətləri və dizayn elementlərini sənədləşdirir.

### 1. Əsas Arxitektura və Texnologiyalar

- **Framework**: Next.js (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Komponent Kitabxanası**: `shadcn/ui`
- **PDF Yaratma**: `jspdf` və `jspdf-autotable` kitabxanaları ilə brauzer tərəfində PDF generasiyası.
- **Mənbə Məlumatları**: Statik JSON faylları (`/lib/data`)
- **Qlobal Vəziyyət İdarəetməsi**: React Context API (`SelectionContext`).

### 2. Səhifələr və Funksionallıq

- **Ana Səhifə (`/`) - İnteraktiv Bələdçi:**
  - Detallı filtrasiya (səviyyə, dil, qrup, alt qrup, universitet, təhsil forması/növü, ixtisas adı, bal diapazonu) imkanı.
  - Nəticələrin masaüstü və mobil üçün adaptiv (cədvəl/kart) görünüşü.

- **İxtisas Seçimi (`/coding`):**
  - **Fərdi Ehtimal Hesablanması**: İstifadəçi balına əsasən hər ixtisas üçün qəbul ehtimalı hesablanır.
  - **Dinamik Rəngli Düymələr**: "Seç" düyməsi ehtimala görə rənglənir (Yaşıl, Sarı, Qırmızı).
  - **İxtisas Səbəti**: Seçilən ixtisaslar qlobal səbətə əlavə edilir.

- **Seçim Siyahısı (`/selection`):**
  - **Məqsəd**: Seçilmiş ixtisasları toplu şəkildə analiz etmək.
  - **Ümumi Qəbul Ehtimalı**: Siyahıdakı ən azı bir ixtisasa qəbul olma şansını göstərən ümumi ehtimal hesablanır.
  - **Detallı Siyahı**: Hər ixtisas üçün məlumatlar (kod, bal, ehtimal) və idarəetmə düymələri (sıralama, silmə).
  - **PDF Olaraq Endirmə**: İstifadəçilər öz seçim siyahılarını və analiz nəticələrini səliqəli bir cədvəl formatında PDF faylı olaraq endirə bilərlər. Bu PDF-də Azərbaycan hərflərinin düzgün göstərilməsi üçün xüsusi şrift inteqrasiya edilib.

### 3. Dizayn və İstifadəçi Təcrübəsi (UI/UX)

- **Vahid və Adaptiv Dizayn**: `shadcn/ui` ilə müasir və tam adaptiv dizayn.
- **İntuitiv Naviqasiya**: Bütün əsas səhifələrə asan keçid təmin edən funksional başlıq.
- **Vizual Rəy**: Qəbul ehtimallarının rənglərlə göstərilməsi.

## Son Dəyişiklik Planı (Tamamlandı)

**Məqsəd**: İstifadəçilərə fərdi seçim analizlərini PDF formatında endirmə imkanı vermək.

**Görülən İşlər:**

1.  **Kitabxanaların Quraşdırılması**: `jspdf` və `jspdf-autotable` kitabxanaları layihəyə əlavə edildi.
2.  **İnterfeysin Yenilənməsi**: `/selection` səhifəsinə "PDF olaraq Endir" düyməsi əlavə olundu.
3.  **PDF Yaratma Məntiqi**: Düyməyə kliklədikdə ümumi məlumatları (bal, ümumi ehtimal) və seçilmiş ixtisasların cədvəlini özündə cəmləyən PDF sənədini yaradan funksiya yazıldı.
4.  **Şrift Probleminin Həlli**: PDF-də Azərbaycan hərflərinin (`ə`, `ı`, `ğ` və s.) düzgün göstərilməsi üçün xüsusi `DejaVu Sans` şrifti base64 formatında layihəyə əlavə edildi və `jspdf` üçün konfiqurasiya edildi.
5.  **Xətanın Aradan Qaldırılması**: Yuxarıdakı şrift faylının import edilə bilməməsi ilə bağlı yaranan `Module not found` xətası, faylın yaradılması ilə həll edildi.

**Nəticə**: Tətbiq indi istifadəçilərə öz fərdi ixtisas analizlərini sənədləşdirmək və paylaşmaq üçün güclü bir ixrac funksiyası təqdim edir.
