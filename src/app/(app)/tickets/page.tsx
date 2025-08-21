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
        title: "Navigation Started",
        description: "Opening Waze for navigation.",
    });
  };

  const getStatusVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'secondary';
      case 'Closed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>Manage and track all support and maintenance tickets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="hidden md:table-cell">Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              {isMobile && <TableHead><span className="sr-only">Navigate</span></TableHead>}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTickets.map((ticket) => {
              const asset = mockAssets.find(a => a.id === ticket.assetId);
              const user = mockUsers.find(u => u.id === ticket.assignedTo);
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{asset?.name || 'Unknown Asset'}</TableCell>
                  <TableCell className="hidden md:table-cell">{ticket.issue}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>{user?.name || 'Unassigned'}</TableCell>
                  {isMobile && asset && (
                    <TableCell>
                       <Button size="icon" variant="outline" onClick={() => handleNavigate(asset.location.lat, asset.location.lng)}>
                         <MapPin className="h-4 w-4" />
                         <span className="sr-only">Navigate</span>
                       </Button>
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Assign To</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {mockUsers.filter(u => u.role === 'Field User').map(fieldUser => (
                                <DropdownMenuItem key={fieldUser.id}>{fieldUser.name}</DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>Close Ticket</DropdownMenuItem>
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
