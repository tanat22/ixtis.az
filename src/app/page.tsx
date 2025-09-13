import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, BookOpen, BarChart2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground/90">
          Gələcəyini<span className="text-primary"> Təhsil Bələdçisi </span>ilə Qur
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          DİM nəticələrinə əsasən ixtisasları kəşf et, keçid ballarını müqayisə et və sənə ən uyğun olanı seç. Qəbul şansını hesabla, seçimlərini bizimlə et!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/coding">
            <Button size="lg" className="w-full sm:w-auto">
              İxtisas Seçiminə Başla
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/universities">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Universitetləri Kəşf Et
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">İxtisas Kataloqu</CardTitle>
              <BookOpen className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bütün universitetlər və ixtisaslar bir yerdə. Dəqiq və güncəl məlumatlarla asanlıqla axtarış et.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Şansını Hesabla</CardTitle>
              <BarChart2 className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Topladığın bala əsasən seçdiyin ixtisaslara qəbul olma ehtimalını anında öyrən.
              </CardDescription>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Səbətə Əlavə Et</CardTitle>
              <ArrowRight className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bəyəndiyin ixtisasları seçərək öz siyahını yarat, müqayisə et və yekun qərarını ver.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
