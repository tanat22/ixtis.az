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

import { mockAssets, mockUsers } from '@/lib/data';
import type { Asset } from '@/lib/types';

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(mockAssets);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: formData.get('name') as string,
        type: formData.get('type') as Asset['type'],
        region: formData.get('region') as string,
        status: 'Active',
        location: { lat: 40.37, lng: 49.84 }, // Mock coordinates
        addedBy: 'user-1', // Mock user
        addedDate: new Date().toISOString().split('T')[0],
    };
    setAssets(prev => [newAsset, ...prev]);
    setIsDialogOpen(false);
  };
  
  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Maintenance': return 'secondary';
      case 'Inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assets</CardTitle>
          <CardDescription>Manage your inventory and view asset details.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Asset
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAsset}>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new asset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                   <Select name="type" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Direk">Direk</SelectItem>
                        <SelectItem value="Qutu">Qutu</SelectItem>
                        <SelectItem value="Kamera">Kamera</SelectItem>
                        <SelectItem value="Switch">Switch</SelectItem>
                        <SelectItem value="Router">Router</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">Region</Label>
                  <Input id="region" name="region" className="col-span-3" defaultValue="Baku" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Asset</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
               const user = mockUsers.find(u => u.id === asset.addedBy);
               return (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>{asset.region}</TableCell>
                  <TableCell>{user?.name || 'Unknown'}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
