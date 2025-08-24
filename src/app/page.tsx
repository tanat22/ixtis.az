'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, LogIn, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState('');
  const [serverIp, setServerIp] = React.useState('127.0.0.1');
  const [port, setPort] = React.useState('8080');
  const [macAddress, setMacAddress] = React.useState('');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
        toast({
            variant: "destructive",
            title: "Xəta",
            description: "Zəhmət olmasa, daxil olmaq üçün bir istifadəçi seçin.",
        });
        return;
    }
    
    setIsLoading(true);

    const selectedUser = mockUsers.find(u => u.id === selectedUserId);

    // Simulate API call to the provided IP and port
    console.log(`Connecting to ${serverIp}:${port}...`);
    
    setTimeout(() => {
      // Password check
      if (!selectedUser || selectedUser.password !== password) {
        toast({
            variant: "destructive",
            title: "Giriş Məlumatları Yanlışdır",
            description: "İstifadəçi adı və ya parol düzgün deyil.",
        });
        setIsLoading(false);
        return;
      }

      // MAC Address check simulation
      if (selectedUser.allowedMacs && selectedUser.allowedMacs.length > 0 && !selectedUser.allowedMacs.includes(macAddress)) {
          toast({
              variant: "destructive",
              title: "Girişə İcazə Verilmədi",
              description: "Bu cihazdan girişə icazə yoxdur. Sistem administratoru ilə əlaqə saxlayın.",
          });
          setIsLoading(false);
          return;
      }

      setUser(selectedUser);
      toast({
        title: 'Giriş Uğurludur',
        description: `Xoş gəldiniz, ${selectedUser.name}!`,
      });
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Box className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            AssetRover
          </h1>
          <p className="text-muted-foreground">
            Assetlərinizi idarə etmək üçün daxil olun
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
           <div className='space-y-4'>
             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <Label htmlFor="server-ip">Server IP</Label>
                    <Input 
                      id="server-ip" 
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      placeholder="192.168.1.1"
                      required
                    />
                </div>
                <div>
                    <Label htmlFor="port">Port</Label>
                    <Input 
                      id="port" 
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="8080" 
                      required
                    />
                </div>
             </div>

             <div className="space-y-2">
                <Label htmlFor="user-select">İstifadəçi seçin (Simulyasiya)</Label>
                 <Select onValueChange={setSelectedUserId} required>
                      <SelectTrigger id="user-select">
                          <SelectValue placeholder="Daxil olmaq üçün bir istifadəçi profili seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                          {mockUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                 <div className="flex items-center gap-2">
                                   <span>{user.name}</span>
                                   <span className="text-xs text-muted-foreground">({user.role})</span>
                                 </div>
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="mac-address">MAC Ünvanı (Simulyasiya)</Label>
                <Input
                    id="mac-address"
                    type="text"
                    value={macAddress}
                    onChange={(e) => setMacAddress(e.target.value)}
                    placeholder="00:1B:44:11:3A:B7"
                />
                <p className="text-xs text-muted-foreground">
                    Bu sahə real tətbiqdə avtomatik təyin olunacaq. Simulyasiya üçün daxil edin.
                </p>
             </div>
           </div>


            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
                <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                <span>Daxil olunur...</span>
                </div>
            ) : (
                <>
                <LogIn />
                Daxil ol
                </>
            )}
            </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AssetRover. Bütün hüquqlar qorunur.
        </p>
      </div>
    </div>
  );
}
