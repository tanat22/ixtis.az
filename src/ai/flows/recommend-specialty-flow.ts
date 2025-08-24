'use server';
/**
 * @fileOverview Tələbənin imtahan nəticələri və maraqlarına əsaslanaraq ixtisas tövsiyələri verən AI axını.
 *
 * - recommendSpecialty - İxtisas tövsiyəsi prosesini idarə edən funksiya.
 * - SpecialtyRecommendationInput - Funksiyanın giriş növü.
 * - SpecialtyRecommendationOutput - Funksiyanın nəticə növü.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SpecialtyRecommendationInputSchema = z.object({
  examScores: z.array(z.object({
    group: z.string().describe("İmtahan qrupunun adı (məsələn, 'I Qrup')"),
    score: z.number().describe("Tələbənin bu qrup üzrə topladığı bal (0-700 arası)"),
  })).describe("Tələbənin imtahan qrupları üzrə nəticələri."),
  studentInterests: z.string().describe("Tələbənin maraqları, sevdiyi fənlər, gələcək hədəfləri və bacarıqları haqqında ümumi məlumat."),
});
export type SpecialtyRecommendationInput = z.infer<typeof SpecialtyRecommendationInputSchema>;

const SpecialtyRecommendationOutputSchema = z.object({
    recommendations: z.array(z.object({
        specialty_name: z.string().describe("Tövsiyə edilən ixtisasın adı"),
        university_name: z.string().describe("İxtisasın tədris olunduğu universitetin adı"),
        score_range: z.string().describe("Bu ixtisasa qəbul üçün təxmini bal aralığı (məsələn, '550-620 bal')"),
        justification: z.string().describe("Bu ixtisasın tələbəyə niyə tövsiyə edildiyini izah edən qısa əsaslandırma (1-2 cümlə). Tələbənin balına və maraqlarına əsaslanmalıdır."),
    })).describe("Tələbə üçün ən uyğun olan ilk 3 ixtisas tövsiyəsi.")
});
export type SpecialtyRecommendation = z.infer<typeof SpecialtyRecommendationOutputSchema>['recommendations'][number];
export type SpecialtyRecommendationOutput = z.infer<typeof SpecialtyRecommendationOutputSchema>;


const educationInfo = `
Azərbaycan təhsil sistemi haqqında ümumi məlumat:

İbtidai təhsil (1-4-cü siniflər): Oxumaq, yazmaq, hesablama bacarıqları formalaşdırılır.
Ümumi orta təhsil (5-9-cu siniflər): İcbari təhsil pilləsidir. Fənlər üzrə dərin biliklər, məntiqi təfəkkür inkişaf etdirilir. Məzunlara attestat verilir. Bu, növbəti pillə üçün əsasdır.
Tam orta təhsil (10-11-ci siniflər): Təhsilin təmayülləşməsi (humanitar, texniki, təbiət) baş verir. Məzunlara yekun dövlət attestasiyası nəticəsində attestat verilir. Bu, peşə və ali təhsil üçün əsasdır.
İlk və orta peşə-ixtisas təhsili (kolleclər): Ümumi orta təhsil bazasında müxtəlif sənətlər üzrə ixtisaslı kadrlar hazırlanır. Orta peşə-ixtisas təhsili (subbakalavr) ali təhsilə qəbul üçün hüquq verir.
Ali təhsil (Universitetlər): Yüksək ixtisaslı mütəxəssislər hazırlanır. Üç pilləsi var: Bakalavriat, Magistratura, Doktorantura.
  - Bakalavriat: Geniş profilli mütəxəssis hazırlığı. DİM imtahanları ilə qəbul aparılır.
  - Magistratura: Daha dərin ixtisaslaşma, elmi-tədqiqat fəaliyyəti.
  - Doktorantura: Ən yüksək elmi dərəcə.

DİM İmtahan Qrupları:
- I Qrup: Riyaziyyat, Fizika, Kimya, İnformatika (Texniki, Mühəndislik, Kompüter elmləri)
- II Qrup: Coğrafiya, Tarix, Azərbaycan dili, Riyaziyyat (İqtisadiyyat, Menecment, Marketinq, Coğrafiya)
- III Qrup: Azərbaycan dili, Ədəbiyyat, Tarix, İngilis dili (Hüquq, Filologiya, Jurnalistika, Beynəlxalq Münasibətlər)
- IV Qrup: Biologiya, Kimya, Fizika (Tibb, Əczaçılıq, Biologiya, Psixologiya)
- V Qrup: Qabiliyyət imtahanı (Dizayn, Memarlıq, Bədən tərbiyəsi, Musiqi)
`;


export async function recommendSpecialty(input: SpecialtyRecommendationInput): Promise<SpecialtyRecommendationOutput> {
  return recommendSpecialtyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSpecialtyPrompt',
  input: { schema: SpecialtyRecommendationInputSchema },
  output: { schema: SpecialtyRecommendationOutputSchema },
  prompt: `
    Sən Azərbaycanda abituriyentlər üçün ixtisas seçimi üzrə ekspert məsləhətçisən. Sənin vəzifən tələbənin imtahan ballarını, maraqlarını və Azərbaycanın təhsil sistemini nəzərə alaraq ona ən uyğun 3 ixtisası tövsiyə etməkdir.

    İstifadə edəcəyin kontekstual məlumat:
    ${educationInfo}

    Tələbənin məlumatları:
    - İmtahan nəticələri: {{examScores}}
    - Maraqları: {{{studentInterests}}}

    Təhlil prosesi:
    1. Tələbənin ən yüksək bal topladığı qrupu müəyyən et. Bu, onun ən güclü olduğu sahəni göstərir.
    2. Tələbənin maraqlarını analiz et. Onun texnologiyaya, humanitar elmlərə, yoxsa təbiət elmlərinə daha çox meylli olduğunu anla.
    3. Balı və maraqları birləşdirərək, həmin qrup daxilində uyğun gələn populyar və perspektivli ixtisasları seç.
    4. Hər ixtisas üçün Azərbaycanın aparıcı universitetlərindən birini seç.
    5. Hər ixtisas üçün təxmini keçid balı aralığını müəyyən et. Bu aralıq tələbənin balına yaxın və məntiqli olmalıdır.
    6. Hər bir tövsiyə üçün qısa və aydın əsaslandırma yaz. Niyə məhz bu ixtisas və universitetin tələbəyə uyğun olduğunu onun balını və maraqlarını vurğulayaraq izah et. Məsələn: "Sizin II qrup üzrə yüksək balınız və analitik düşünməyə marağınız olduğu üçün Azərbaycan Dövlət İqtisad Universitetində (UNEC) Maliyyə ixtisası yaxşı seçimdir."

    Nəticəni JSON formatında, "recommendations" massivi şəklində qaytar.
  `,
});

const recommendSpecialtyFlow = ai.defineFlow(
  {
    name: 'recommendSpecialtyFlow',
    inputSchema: SpecialtyRecommendationInputSchema,
    outputSchema: SpecialtyRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("AI-dan cavab alına bilmədi.");
    }
    return output;
  }
);
