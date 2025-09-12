
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, HelpCircle, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'İnteraktiv Təhsil Bələdçisi',
  description: 'Azərbaycan üzrə ixtisaslar və keçid balları',
};

function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 items-center max-w-7xl mx-auto px-4 sm:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"/><path d="M224,177.3V78.7a16,16,0,0,0-8.2-14.1l-80-45.7a16,16,0,0,0-15.6,0l-80,45.7A16,16,0,0,0,32,78.7v98.6a16,16,0,0,0,8.2,14.1l80,45.7a16,16,0,0,0,15.6,0l80-45.7A16,16,0,0,0,224,177.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><path d="M84,159.9,48.4,180.1a8,8,0,0,0,0,14.2l31,17.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><polyline points="32 79 128 24 224 79" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="128" y1="24" x2="128" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
          <span className="font-bold sm:inline-block">Təhsil Bələdçisi</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link href="/" passHref>
                <Button variant="ghost" className="text-sm px-2 sm:px-4">
                    <BookOpen className="mr-2 h-4 w-4"/> İxtisas Bələdçisi
                </Button>
            </Link>
             <Link href="/coding" passHref>
                <Button variant="ghost" className="text-sm px-2 sm:px-4">
                    <Code className="mr-2 h-4 w-4"/> İxtisas Seçimi
                </Button>
            </Link>
            <Link href="/universities" passHref>
                <Button variant="ghost" className="text-sm px-2 sm:px-4">
                    <Building className="mr-2 h-4 w-4"/> Universitetlər
                </Button>
            </Link>
             <Link href="/faq" passHref>
                <Button variant="ghost" className="text-sm px-2 sm:px-4">
                    <HelpCircle className="mr-2 h-4 w-4"/> FAQ
                </Button>
            </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
