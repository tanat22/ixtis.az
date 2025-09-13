'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, ClipboardList } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react';
import { useSelection } from '@/context/SelectionContext';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { href: '/', label: 'İnteraktiv Bələdçi' },
  { href: '/coding', label: 'İxtisas Seçimi' },
  { href: '/universities', label: 'Universitetlər' },
  { href: '/colleges', label: 'Kolleclər' },
  { href: '/faq', label: 'FAQ' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { selectedList } = useSelection();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline-block">Təhsil Bələdçisi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-2 font-medium transition-colors hover:text-primary ${ 
                    isActive ? 'text-primary bg-primary/10 rounded-md' : 'text-muted-foreground'
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
             {/* Selection Cart for Desktop */}
             <Link href="/selection">
                 <Button variant="outline" className='relative'>
                     <ClipboardList className="h-5 w-5" />
                      {selectedList.length > 0 && (
                        <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">
                            {selectedList.length}
                        </Badge>
                     )}
                     <span className="sr-only">Seçilmiş ixtisaslar</span>
                 </Button>
             </Link>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                         <Button variant="outline" size="icon" className='relative'>
                            <Menu className="h-6 w-6" />
                             <span className="sr-only">Menyunu aç</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <nav className="grid gap-4 py-6">
                            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
                                <GraduationCap className="h-7 w-7 text-primary" />
                                <span>Təhsil Bələdçisi</span>
                            </Link>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSheetOpen(false)}
                                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${ 
                                        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}>
                                    {link.label}
                                </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
