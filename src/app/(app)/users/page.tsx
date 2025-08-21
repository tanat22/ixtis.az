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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isNewUser, setIsNewUser] = React.useState(false);
  const { toast } = useToast();

  const handleOpenDialog = (user: User | null = null) => {
    setIsNewUser(!user);
    setSelectedUser(user || { id: '', name: '', email: '', role: 'Regional Menecer', region: 'Bakı', avatar: '/avatars/01.png' });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(event.currentTarget);
    const updatedUser: User = {
        ...selectedUser,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as User['role'],
        region: formData.get('region') as string,
    };

    if (isNewUser) {
        updatedUser.id = `user-${Date.now()}`;
        setUsers(prev => [updatedUser, ...prev]);
        toast({
            title: "İstifadəçi Yaradıldı",
            description: `${updatedUser.name} adlı yeni istifadəçi uğurla əlavə edildi.`,
        });
    } else {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast({
            title: "Dəyişikliklər Yadda Saxlandı",
            description: `${updatedUser.name} adlı istifadəçinin məlumatları yeniləndi.`,
        });
    }

    setIsDialogOpen(false);
    setSelectedUser(null);
  }

  const getRoleVariant = (role: string) => {
    if (role === 'Super Admin') return 'destructive';
    if (role === 'Admin') return 'secondary';
    return 'default';
  };

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>İstifadəçi İdarəetməsi</CardTitle>
          <CardDescription>
            Rollar təyin edin və istifadəçi girişini idarə edin.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1" onClick={() => handleOpenDialog()}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            İstifadəçi əlavə et
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>
                <span className="sr-only">Əməliyyatlar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.region}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenDialog(user)}>Redaktə et</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDialog(user)}>Rolu dəyiş</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
             <form onSubmit={handleSaveChanges}>
                <DialogHeader>
                    <DialogTitle>{isNewUser ? 'Yeni İstifadəçi Yarat' : 'İstifadəçini Redaktə Et'}</DialogTitle>
                    <DialogDescription>
                        {isNewUser ? 'Yeni istifadəçinin məlumatlarını daxil edin.' : 'İstifadəçi məlumatlarını redaktə edin.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Ad</Label>
                        <Input id="name" name="name" defaultValue={selectedUser?.name} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">E-poçt</Label>
                        <Input id="email" name="email" type="email" defaultValue={selectedUser?.email} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Rol</Label>
                         <Select name="role" defaultValue={selectedUser?.role}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Rol seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Regional Menecer">Regional Menecer</SelectItem>
                                <SelectItem value="Təmir üzrə Məsul Şəxs">Təmir üzrə Məsul Şəxs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="region" className="text-right">Region</Label>
                         <Select name="region" defaultValue={selectedUser?.region}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Region seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bütün">Bütün</SelectItem>
                                <SelectItem value="Bakı">Bakı</SelectItem>
                                <SelectItem value="Gəncə">Gəncə</SelectItem>
                                <SelectItem value="Sumqayıt">Sumqayıt</SelectItem>
                                <SelectItem value="Qarabağ">Qarabağ</SelectItem>
                                <SelectItem value="Qərb">Qərb</SelectItem>
                                <SelectItem value="Şimal">Şimal</SelectItem>
                                <SelectItem value="Aran">Aran</SelectItem>
                                <SelectItem value="Şimal Qərb">Şimal Qərb</SelectItem>
                                <SelectItem value="Cənub">Cənub</SelectItem>
                                <SelectItem value="Naxçıvan">Naxçıvan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Ləğv et</Button>
                    <Button type="submit">{isNewUser ? 'Yarat' : 'Yadda Saxla'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
    </>
  );
}
