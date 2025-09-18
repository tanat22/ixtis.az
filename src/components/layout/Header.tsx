'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BarChart2 } from 'lucide-react';
import { useSelection } from '@/context/SelectionContext';
import { siteConfig } from "@/config/site";
import { MobileNav } from '@/components/layout/MobileNav';

// HARDCODED NAVIGATION TO PREVENT IMPORT ISSUES
const mainNav = [
  {
    title: "İxtisas Seçimi",
    href: "/ixtisas-secimi",
  },
  {
    title: "Universitetlər",
    href: "/universities",
  },
  {
    title: "Kolleclər",
    href: "/colleges",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Seçilmişlər",
    href: "/selection",
  },
];

export function Header() {
  const { selectedList } = useSelection();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.title}
                </Link>
              ))}
          </nav>
        </div>
        
        <MobileNav />
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* This space can be used for a search bar in the future if needed */}
          </div>
          <Link href="/selection">
              <Button variant="outline" className="relative">
                  <BarChart2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Seçilmişlər</span>
                  {isClient && selectedList.length > 0 && (
                      <Badge 
                          variant="destructive"
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-1 text-xs"
                      >
                          {selectedList.length}
                      </Badge>
                  )}
              </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
