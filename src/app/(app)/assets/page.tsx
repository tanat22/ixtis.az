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
import type { Asset, DirekAsset } from '@/lib/types';

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(mockAssets);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAssetType, setSelectedAssetType] = React.useState<Asset['type'] | ''>('');

  const handleAddAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const assetType = formData.get('type') as Asset['type'];
    
    const commonData = {
        id: `asset-${Date.now()}`,
        name: formData.get('name') as string,
        region: formData.get('region') as string,
        status: 'Aktiv',
        location: { lat: 40.37, lng: 49.84 }, // Mock coordinates
        addedBy: 'user-1', // Mock user
        addedDate: new Date().toISOString().split('T')[0],
    };

    let newAsset: Asset;

    if (assetType === 'Dirək') {
        newAsset = {
            ...commonData,
            type: 'Dirək',
            istehsalci: formData.get('istehsalci') as DirekAsset['istehsalci'],
            hundurluk: Number(formData.get('hundurluk')),
            reng: formData.get('reng') as string,
        };
    } else {
         newAsset = {
            ...commonData,
            type: assetType as 'Qutu' | 'Kamera' | 'Switch' | 'Router',
        };
    }
    
    setAssets(prev => [newAsset, ...prev]);
    setIsDialogOpen(false);
    setSelectedAssetType('');
  };
  
  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Aktiv': return 'default';
      case 'Təmir': return 'secondary';
      case 'Qeyri-aktiv': return 'destructive';
      default: return 'outline';
    }
  };

  const renderAssetDetails = (asset: Asset) => {
    if (asset.type === 'Dirək') {
      return `İstehsalçı: ${asset.istehsalci || 'N/A'}, Hündürlük: ${asset.hundurluk || 'N/A'}m`;
    }
    return asset.type;
  }
  
  const renderAddAssetFormFields = () => {
    if (!selectedAssetType) return null;

    if (selectedAssetType === 'Dirək') {
      return (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="istehsalci" className="text-right">İstehsalçı</Label>
            <Select name="istehsalci">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="İstehsalçı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="İDEA">İDEA</SelectItem>
                <SelectItem value="OZON">OZON</SelectItem>
                <SelectItem value="FRANSIZ">FRANSIZ</SelectItem>
                <SelectItem value="BCG">BCG</SelectItem>
                <SelectItem value="Digər">Digər</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hundurluk" className="text-right">Hündürlük (m)</Label>
            <Input id="hundurluk" name="hundurluk" type="number" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reng" className="text-right">Rəng</Label>
            <Input id="reng" name="reng" className="col-span-3" />
          </div>
        </>
      );
    }
    
    // Placeholder for other asset types if they have specific fields
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assetlər</CardTitle>
          <CardDescription>İnventarınızı idarə edin və asset təfərrüatlarına baxın.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedAssetType(''); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Asset əlavə et
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAsset}>
              <DialogHeader>
                <DialogTitle>Yeni Asset əlavə et</DialogTitle>
                <DialogDescription>
                  Yeni asset üçün təfərrüatları daxil edin.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Növ</Label>
                   <Select name="type" required onValueChange={(value: Asset['type']) => setSelectedAssetType(value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Asset növünü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dirək">Dirək</SelectItem>
                        <SelectItem value="Qutu">Qutu</SelectItem>
                        <SelectItem value="Kamera">Kamera</SelectItem>
                        <SelectItem value="Switch">Switch</SelectItem>
                        <SelectItem value="Router">Router</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Ad</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">Region</Label>
                  <Input id="region" name="region" className="col-span-3" defaultValue="Bakı" required />
                </div>
                {renderAddAssetFormFields()}
              </div>
              <DialogFooter>
                <Button type="submit">Asseti yadda saxla</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Növ/Detal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Əlavə etdi</TableHead>
              <TableHead>
                <span className="sr-only">Əməliyyatlar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
               const user = mockUsers.find(u => u.id === asset.addedBy);
               return (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{renderAssetDetails(asset)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>{asset.region}</TableCell>
                  <TableCell>{user?.name || 'Naməlum'}</TableCell>
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
                        <DropdownMenuItem>Redaktə et</DropdownMenuItem>
                        <DropdownMenuItem>Sil</DropdownMenuItem>
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
