'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { mockAssets, mockUsers, mockTickets, mockNodes } from '@/lib/data';
import type { User, Asset, Ticket, TasinmazEmlak } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { FilterX } from 'lucide-react';

type FilterState = {
  region: string | 'all';
  assetType: Asset['type'] | 'all';
  user: string | 'all';
  ticketStatus: Ticket['status'] | 'all';
};

export default function AnalyticsPage() {
  const [filters, setFilters] = React.useState<FilterState>({
    region: 'all',
    assetType: 'all',
    user: 'all',
    ticketStatus: 'all',
  });
  
  const [filteredData, setFilteredData] = React.useState<any[]>([]);

  const uniqueRegions = [...new Set(mockNodes.map(node => node.seher).filter(Boolean))] as string[];
  const uniqueAssetTypes = [...new Set(mockAssets.map(asset => asset.type))] as Asset['type'][];
  const users = mockUsers;
  const ticketStatuses: Ticket['status'][] = ['Açıq', 'İcra olunur', 'Həll edildi', 'Bağlı', 'Yenidən açıldı'];


  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    let data: (Asset | Ticket)[] = [...mockAssets, ...mockTickets];

    if (filters.region !== 'all') {
      const assetsInRegion = mockAssets.filter(asset => {
        const node = mockNodes.find(n => n.id === asset.nodeId);
        return node && node.seher === filters.region;
      }).map(a => a.id);
      
      const ticketsInRegion = mockTickets.filter(ticket => assetsInRegion.includes(ticket.assetId));
      
      data = [...mockAssets.filter(a => assetsInRegion.includes(a.id)), ...ticketsInRegion];
    }
    
    if (filters.assetType !== 'all') {
        data = data.filter(item => 'type' in item && item.type === filters.assetType);
    }
    
    if(filters.user !== 'all') {
        const assetsByUser = mockAssets.filter(a => a.addedBy === filters.user);
        const ticketsByUser = mockTickets.filter(t => t.assignedTo === filters.user);
        const assetIdsByUser = new Set(assetsByUser.map(a => a.id));
        const ticketIdsByUser = new Set(ticketsByUser.map(t => t.id));

        data = data.filter(item => {
            if('type' in item){ // It's an asset
                return assetIdsByUser.has(item.id);
            } else { // It's a ticket
                return ticketIdsByUser.has(item.id);
            }
        });
    }

    if (filters.ticketStatus !== 'all') {
        data = data.filter(item => 'status' in item && item.status === filters.ticketStatus && !('type' in item));
    }


    const formattedData = data.map(item => {
      if ('type' in item) { // Asset
        const user = users.find(u => u.id === item.addedBy);
        const node = mockNodes.find(n => n.id === item.nodeId);
        return {
          id: item.id,
          type: 'Asset',
          name: item.name,
          details: item.type,
          region: node?.seher || 'N/A',
          user: user?.name || 'N/A',
          status: item.status,
          date: item.addedDate
        };
      } else { // Ticket
        const asset = mockAssets.find(a => a.id === item.assetId);
        const node = asset ? mockNodes.find(n => n.id === asset.nodeId) : null;
        const user = users.find(u => u.id === item.assignedTo);
        return {
          id: item.id,
          type: 'Tiket',
          name: item.issue,
          details: `Asset: ${asset?.name || 'N/A'}`,
          region: node?.seher || 'N/A',
          user: user?.name || 'Təyin edilməyib',
          status: item.status,
          date: item.createdDate
        };
      }
    });

    setFilteredData(formattedData);
  };
  
  const resetFilters = () => {
    setFilters({
        region: 'all',
        assetType: 'all',
        user: 'all',
        ticketStatus: 'all',
    });
    setFilteredData([]);
  }

  React.useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to show initial data if any

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analitika və Hesabatlar</CardTitle>
          <CardDescription>
            Məlumatları təhlil etmək üçün aşağıdakı filtrlərdən istifadə edin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="region-filter">Region</Label>
              <Select
                value={filters.region}
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger id="region-filter">
                  <SelectValue placeholder="Region seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Regionlar</SelectItem>
                  {uniqueRegions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-type-filter">Asset Növü</Label>
              <Select
                value={filters.assetType}
                onValueChange={(value) => handleFilterChange('assetType', value)}
              >
                <SelectTrigger id="asset-type-filter">
                  <SelectValue placeholder="Asset növü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Növlər</SelectItem>
                  {uniqueAssetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-filter">İstifadəçi</Label>
               <Select
                value={filters.user}
                onValueChange={(value) => handleFilterChange('user', value)}
              >
                <SelectTrigger id="user-filter">
                  <SelectValue placeholder="İstifadəçi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün İstifadəçilər</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-status-filter">Tiket Statusu</Label>
              <Select
                value={filters.ticketStatus}
                onValueChange={(value) => handleFilterChange('ticketStatus', value)}
              >
                <SelectTrigger id="ticket-status-filter">
                  <SelectValue placeholder="Status seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Statuslar</SelectItem>
                  {ticketStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
                 <Button onClick={applyFilters} className="w-full">Filtirlə</Button>
                 <Button onClick={resetFilters} variant="outline" size="icon" className="shrink-0">
                    <FilterX className="h-4 w-4"/>
                    <span className="sr-only">Filtrləri təmizlə</span>
                 </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Nəticələr</CardTitle>
          <CardDescription>
            Filtrlənmiş məlumatlar aşağıdakı cədvəldə göstərilir. Tapılan nəticə sayı: {filteredData.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Növ</TableHead>
                        <TableHead>Ad / Problem</TableHead>
                        <TableHead>Detal</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>İstifadəçi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tarix</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell><Badge variant={item.type === 'Asset' ? 'secondary' : 'default'}>{item.type}</Badge></TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.details}</TableCell>
                                <TableCell>{item.region}</TableCell>
                                <TableCell>{item.user}</TableCell>
                                <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                                <TableCell>{new Date(item.date).toLocaleDateString('az-AZ')}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                Filtrlərə uyğun nəticə tapılmadı və ya hələ filtr tətbiq edilməyib.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}
