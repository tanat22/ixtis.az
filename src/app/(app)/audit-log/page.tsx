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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { mockAuditLogs, mockUsers } from '@/lib/data';

const FormattedDate = ({ timestamp }: { timestamp: string }) => {
  const [formattedDate, setFormattedDate] = React.useState('');

  React.useEffect(() => {
    // Format date only on the client-side to avoid hydration mismatch
    setFormattedDate(new Date(timestamp).toLocaleString('az-AZ'));
  }, [timestamp]);
  
  if (!formattedDate) {
    // Return a placeholder or the raw string during server-side rendering or before hydration
    return <>{timestamp}</>;
  }

  return <>{formattedDate}</>;
};


export default function AuditLogPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredLogs = mockAuditLogs.filter(log => {
        const user = mockUsers.find(u => u.id === log.userId);
        const dateString = isClient ? new Date(log.timestamp).toLocaleString('az-AZ') : log.timestamp;
        const searchContent = `${user?.name || ''} ${log.action} ${log.details} ${dateString}`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
    });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Audit Jurnalı</CardTitle>
                <CardDescription>
                Sistem daxilində görülən bütün əməliyyatların ətraflı jurnalı.
                </CardDescription>
            </div>
            <div className="relative mt-4 md:mt-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Jurnallarda axtarış..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Əməliyyat</TableHead>
              <TableHead>Təfərrüatlar</TableHead>
              <TableHead>Tarix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const user = mockUsers.find((u) => u.id === log.userId);
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{user?.name || 'Sistem'}</p>
                        <p className="hidden text-sm text-muted-foreground md:inline">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>
                    {isClient ? <FormattedDate timestamp={log.timestamp} /> : log.timestamp}
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
