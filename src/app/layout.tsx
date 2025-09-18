
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/layout/Header';
import { SelectionProvider } from '@/context/SelectionContext';

export const metadata: Metadata = {
  title: 'İnteraktiv Təhsil Bələdçisi',
  description: 'Azərbaycan üzrə ixtisaslar və keçid balları',
};

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
        <SelectionProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </SelectionProvider>
      </body>
    </html>
  );
}
