'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Box,
  Ticket,
  Users,
  FileClock,
  LogOut,
  ChevronDown,
  Settings,
  User as UserIcon,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/lib/types';
import { useUser } from '@/context/user-context';


const navItems: { href: string; icon: React.ElementType; label: string; roles: User['role'][] }[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'İdarə Paneli', roles: ['Super Admin', 'Admin', 'Regional Menecer', 'Təmir üzrə Məsul Şəxs'] },
  { href: '/assets', icon: Box, label: 'Assetlər', roles: ['Super Admin', 'Admin', 'Regional Menecer', 'Təmir üzrə Məsul Şəxs'] },
  { href: '/tickets', icon: Ticket, label: 'Tiketlər', roles: ['Super Admin', 'Admin', 'Regional Menecer', 'Təmir üzrə Məsul Şəxs'] },
  { href: '/messages', icon: MessageSquare, label: 'Mesajlar', roles: ['Super Admin', 'Admin', 'Regional Menecer'] },
  { href: '/users', icon: Users, label: 'İstifadəçi İdarəetməsi', roles: ['Super Admin', 'Admin'] },
  { href: '/audit-log', icon: FileClock, label: 'Audit Jurnalı', roles: ['Super Admin'] },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const userHasAccess = (allowedRoles: User['role'][]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };
  
  const handleLogout = () => {
    setUser(null);
    // In a real app, you'd also clear tokens, etc.
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Box className="h-6 w-6" />
             </div>
             <span className="text-xl font-semibold text-sidebar-foreground">AssetRover</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              userHasAccess(item.roles) && (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2">
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user ? user.name.charAt(0) : <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start text-left">
                    <p className="font-medium">{user?.name || 'İstifadəçi'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'Daxil olun'}</p>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Parametrlər</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıxış</span>
                 </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* You can add breadcrumbs or page titles here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
