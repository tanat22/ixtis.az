import { MainNavItem, SidebarNavItem } from "@/lib/types"

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
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
  ],
  sidebarNav: [], // Sidebar will not be used in this project
}
