# Layihənin Planı: ixtis.az

## Ümumi Baxış

**ixtis.az**, Azərbaycanlı abituriyentlər və tələbələr üçün universitet ixtisaslarını araşdırmaq, müqayisə etmək və özlərinə ən uyğun karyera yolunu seçmək məqsədilə yaradılmış veb platformadır. Tətbiq, istifadəçilərə ixtisaslar haqqında ətraflı məlumat, o cümlədən təsvirlər, iş imkanları, təhsil haqları, universitetlər və keçid balları kimi vacib məlumatları təqdim edir.

## Layihənin Xüsusiyyətləri və Dizaynı

### Texnologiya Yığını (Technology Stack)
- **Framework:** Next.js (App Router)
- **Dil:** TypeScript
- **UI Komponentləri:** shadcn/ui
- **Stil:** Tailwind CSS

### Məlumat Mənbəyi
- **Əsas Məlumatlar:** Statik JSON faylları (`/lib/data/specialties.json`, `/lib/data/universities.json`).
- **İxtisas Detalları:** Hər bir ixtisas üçün fərdi JSON faylları (`/elmir/faculties/[slug].json`).

### UI/UX Dizaynı
- **Ümumi Dizayn:** Təmiz, müasir və istifadəçi mərkəzli. Mobil cihazlara tam uyğun (responsive) dizayn.
- **Ana Səhifə:**
    - Bütün ixtisasların göstərildiyi interaktiv cədvəl.
    - Ad, universitet, keçid balı, təhsil haqqı və plana görə dinamik filterləmə və çeşidləmə (sorting) imkanı.
    - Seçilən filterləri asanlıqla ləğv etmək funksiyası.
- **İxtisas Səhifəsi (`/faculty/[slug]`):**
    - Hər ixtisas üçün avtomatik yaradılan fərdi səhifələr.
    - İxtisas haqqında ətraflı məlumat: təsvir, iş imkanları, mümkün vəzifələr, gələcək perspektivləri.
    - Həmin ixtisası tədris edən universitetlərin siyahısı, müvafiq ballar və ödəniş məlumatları ilə birlikdə.
    - Asan naviqasiya üçün "Geri Qayıt" düyməsi.

---

## Son Dəyişiklik Planı və İcra Addımları (06/08/2024)

### Məqsəd
Vercel-də build prosesini çökdürən kritik xətanı aradan qaldırmaq və çatışmayan ixtisas məlumatlarını sistemə əlavə etmək.

### Problem
1.  **Build Xətası:** `TypeError: Cannot read properties of undefined (reading 'map')` xətası. Bu, bəzi ixtisasların detallı məlumat faylı (`.json`) olmadıqda və ya faylın içində `possible_positions` kimi sahələr boş olduqda, komponentin bu məlumatı render etməyə çalışarkən baş verirdi.
2.  **Çatışmayan Məzmun:** Bir çox ixtisasın `elmir/faculties/` qovluğunda detallı məlumat faylı yox idi. Bu da həmin ixtisasların linkinə daxil olduqda xətaya və ya boş səhifəyə səbəb olurdu.

### Həll Planı və İcra Addımları

1.  **Təcili Düzəliş (Komponentin Dayanıqlı Edilməsi):**
    - **Addım:** `src/app/faculty/[slug]/page.tsx` faylına dəyişiklik edildi.
    - **İcra:** Komponentin render hissəsində məlumatların (`possible_positions`, `job_opportunities` və s.) mövcud olub-olmadığını yoxlayan şərtlər (`&&` və `?.` operatorları ilə) əlavə edildi.
    - **Nəticə:** Məlumat olmasa belə, komponent xəta vermədən sadəcə həmin hissəni göstərməyəcək. Bu, build xətasını dərhal aradan qaldırdı.

2.  **Məzmun Generasiyası və Faylların Yaradılması:**
    - **Addım:** Bütün ixtisasların siyahısı ilə `elmir/faculties/` qovluğundakı mövcud `.json` faylları müqayisə edildi.
    - **İcra:** Çatışmayan 9 ixtisas üçün (`dovlet-idareciliyi`, `dizayn-saheler-uzre`, `huquq-saheler-uzre` və s.) süni intellekt vasitəsilə unikal və ətraflı məzmun (təsvir, iş imkanları, vəzifələr, gələcək perspektivləri və tövsiyələr) generasiya edildi.
    - **Nəticə:** Hər bir çatışmayan ixtisas üçün müvafiq adda yeni `.json` faylı yaradıldı və `elmir/faculties/` qovluğuna əlavə edildi.

3.  **Dəyişikliklərin Tətbiqi:**
    - **Addım:** Bütün dəyişikliklər (həm kod düzəlişi, həm də yeni yaradılan fayllar) `git` vasitəsilə GitHub repositoriyasına `commit` və `push` edildi.
    - **Nəticə:** Vercel-də yeni build prosesi avtomatik başladı və uğurla tamamlandı. Sayt tam işlək vəziyyətə qayıtdı və yeni məlumatlarla zənginləşdi.

