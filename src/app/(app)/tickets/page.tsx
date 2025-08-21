'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreHorizontal, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { mockTickets, mockAssets, mockUsers } from '@/lib/data';
import type { Ticket } from '@/lib/types';


export default function TicketsPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    window.open(url, '_blank');
    toast({
        title: "Naviqasiya Başladı",
        description: "Naviqasiya üçün Waze açılır.",
    });
  };

  const getStatusVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'Açıq': return 'destructive';
      case 'İcra olunur': return 'secondary';
      case 'Bağlı': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiketlər</CardTitle>
        <CardDescription>Bütün dəstək və təmir tiketlərinizi idarə edin və izləyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="hidden md:table-cell">Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Təyin edilib</TableHead>
              {isMobile && <TableHead><span className="sr-only">Naviqasiya</span></TableHead>}
              <TableHead>
                <span className="sr-only">Əməliyyatlar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTickets.map((ticket) => {
              const asset = mockAssets.find(a => a.id === ticket.assetId);
              const user = mockUsers.find(u => u.id === ticket.assignedTo);
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{asset?.name || 'Naməlum Asset'}</TableCell>
                  <TableCell className="hidden md:table-cell">{ticket.issue}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>{user?.name || 'Təyin edilməyib'}</TableCell>
                  {isMobile && asset && (
                    <TableCell>
                       <Button size="icon" variant="outline" onClick={() => handleNavigate(asset.location.lat, asset.location.lng)}>
                         <MapPin className="h-4 w-4" />
                         <span className="sr-only">Naviqasiya</span>
                       </Button>
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menyunu aç/bağla</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
                        <DropdownMenuItem>Təfərrüatlara bax</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Təyin et</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {mockUsers.filter(u => u.role === 'Səhra istifadəçisi').map(fieldUser => (
                                <DropdownMenuItem key={fieldUser.id}>{fieldUser.name}</DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>Tiketi bağla</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
