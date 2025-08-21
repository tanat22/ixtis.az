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
import { MoreHorizontal, MapPin, PlusCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { mockTickets, mockAssets, mockUsers } from '@/lib/data';
import type { Ticket } from '@/lib/types';


export default function TicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(mockTickets);
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);


  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    window.open(url, '_blank');
    toast({
        title: "Naviqasiya Başladı",
        description: "Naviqasiya üçün Waze açılır.",
    });
  };
  
  const handleAddTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        assetId: formData.get('assetId') as string,
        issue: formData.get('issue') as string,
        status: 'Açıq', // New tickets always start as 'Açıq'
        priority: formData.get('priority') as Ticket['priority'],
        createdDate: new Date().toISOString(),
        // assignedTo will be set later
    };
    setTickets(prev => [newTicket, ...prev]);
    setIsNewTicketDialogOpen(false);
    toast({
        title: "Uğurlu Əməliyyat",
        description: `Yeni tiket uğurla yaradıldı.`
    })
  };

  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    toast({
        title: "Status Dəyişdirildi",
        description: `Tiketin statusu "${newStatus}" olaraq yeniləndi.`
    })
  };
  
  const handleAssignUser = (ticketId: string, userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assignedTo: userId } : ticket
    ));
     toast({
        title: "İstifadəçi Təyin Edildi",
        description: `Tiket "${user?.name}" adlı istifadəçiyə təyin edildi.`
    })
  }

  const getStatusVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'Açıq': return 'destructive';
      case 'İcra olunur': return 'secondary';
      case 'Həll edildi': return 'default';
      case 'Bağlı': return 'outline';
      case 'Yenidən açıldı': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityVariant = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Yüksək': return 'destructive';
      case 'Orta': return 'secondary';
      case 'Aşağı': return 'outline';
      default: return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tiketlər</CardTitle>
          <CardDescription>Bütün dəstək və təmir tiketlərinizi idarə edin və izləyin.</CardDescription>
        </div>
         <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Yeni Tiket Yarat
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
             <form onSubmit={handleAddTicket}>
                <DialogHeader>
                    <DialogTitle>Yeni Tiket Yarat</DialogTitle>
                    <DialogDescription>
                       Zəhmət olmasa, yeni tiket üçün tələb olunan məlumatları daxil edin.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assetId" className="text-right">Əlaqəli Asset</Label>
                         <Select name="assetId" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Asset seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockAssets.map(asset => (
                                    <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">Prioritet</Label>
                         <Select name="priority" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Prioritet seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yüksək">Yüksək</SelectItem>
                                <SelectItem value="Orta">Orta</SelectItem>
                                <SelectItem value="Aşağı">Aşağı</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="issue" className="text-right">Problem</Label>
                        <Textarea id="issue" name="issue" className="col-span-3" required />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Tiketi Yarat</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="hidden md:table-cell">Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioritet</TableHead>
              <TableHead>Təyin edilib</TableHead>
              {isClient && isMobile && <TableHead><span className="sr-only">Naviqasiya</span></TableHead>}
              <TableHead>
                <span className="sr-only">Əməliyyatlar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const asset = mockAssets.find(a => a.id === ticket.assetId);
              const user = mockUsers.find(u => u.id === ticket.assignedTo);
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{asset?.name || 'Naməlum Asset'}</TableCell>
                  <TableCell className="hidden md:table-cell">{ticket.issue}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>{user?.name || 'Təyin edilməyib'}</TableCell>
                  {isClient && isMobile && asset && (
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
                              {mockUsers.filter(u => u.role === 'Regional Menecer' || u.role === 'Təmir üzrə Məsul Şəxs').map(fieldUser => (
                                <DropdownMenuItem key={fieldUser.id} onClick={() => handleAssignUser(ticket.id, fieldUser.id)}>
                                  {fieldUser.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Statusu dəyiş</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Açıq')}>Açıq</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'İcra olunur')}>İcra olunur</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Həll edildi')}>Həll edildi</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Yenidən açıldı')}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Yenidən aç
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Bağlı')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Tiketi bağla
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                           <XCircle className="mr-2 h-4 w-4" />
                           Ləğv et
                        </DropdownMenuItem>
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
