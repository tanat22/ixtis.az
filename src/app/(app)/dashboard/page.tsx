'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Box, Ticket, Users, FileClock } from 'lucide-react';
import { mockAssets, mockTickets, mockUsers, mockAuditLogs } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const FormattedDate = ({ timestamp }: { timestamp: string }) => {
  const [formattedDate, setFormattedDate] = React.useState('');

  React.useEffect(() => {
    // Format date only on the client-side to avoid hydration mismatch
    setFormattedDate(new Date(timestamp).toLocaleString('az-AZ'));
  }, [timestamp]);
  
  if (!formattedDate) {
    return <>{timestamp}</>;
  }

  return <>{formattedDate}</>;
};

export default function DashboardPage() {
  const assetData = mockAssets.reduce((acc, asset) => {
    const existing = acc.find(item => item.type === asset.type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type: asset.type, count: 1 });
    }
    return acc;
  }, [] as { type: string; count: number }[]);

  const chartConfig = {
    count: {
      label: 'Assetlər',
      color: 'hsl(var(--primary))',
    },
  };

  const recentLogs = mockAuditLogs.slice(0, 5);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 md:grid-cols-3 xl:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Assetlər</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssets.length}</div>
            <p className="text-xs text-muted-foreground">Keçən aydan +2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Açıq Tiketlər</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTickets.filter(t => t.status === 'Açıq' || t.status === 'İcra olunur').length}
            </div>
            <p className="text-xs text-muted-foreground">Dünəndən +1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiv İstifadəçilər</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">Bütün istifadəçilər hazırda aktivdir</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Paylanması</CardTitle>
            <CardDescription>Assetlərin növünə görə sayı.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={assetData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Son Fəaliyyət</CardTitle>
            <CardDescription>Son sistem hadisələrinin jurnalı.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {recentLogs.map((log) => {
              const user = mockUsers.find(u => u.id === log.userId);
              return (
                <div key={log.id} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt="Avatar" />
                    <AvatarFallback>{user?.name.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'Sistem'}
                      <span className="ml-2 font-normal text-muted-foreground">{log.action}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {isClient ? <FormattedDate timestamp={log.timestamp} /> : log.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
