import { SpecialtySelector } from '@/components/ui/SpecialtySelector';

export default function HomePage() {
  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <section className="text-center pt-12 pb-8 md:pt-20 md:pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground/90">
            Gələcəyini<span className="text-primary"> Təhsil Bələdçisi </span>ilə Qur
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            DİM nəticələrinə əsasən ixtisasları kəşf et, keçid ballarını müqayisə et və sənə ən uyğun olanı seç. Qəbul şansını hesabla, seçimlərini bizimlə et!
          </p>
        </section>
      </div>
      
      {/* Specialty Selector Component with all the customizations for the homepage */}
      <SpecialtySelector 
        showTitle={false} 
        showSelectButton={false} 
        showCodeColumn={false} 
        highlightScoreInput={true}
        showEducationLevelFilter={true}
      />
    </>
  );
}
