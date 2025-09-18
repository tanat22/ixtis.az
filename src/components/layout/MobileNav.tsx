'use client'

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, GraduationCap } from "lucide-react"

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

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary"
            onClick={() => setOpen(false)}
          >
            <GraduationCap className="h-6 w-6" />
            <span>{siteConfig.name}</span>
            <span className="sr-only">Home</span>
          </Link>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
