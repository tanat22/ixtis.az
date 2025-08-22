'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { mockUsers, mockMessages } from '@/lib/data';
import type { User, Message } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user: currentUser } = useUser();
  const [messages, setMessages] = React.useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = React.useState('');
  
  // For this simulation, we'll let the regional manager talk to the first admin.
  // In a real app, this would be more dynamic.
  const admin = mockUsers.find(u => u.role === 'Admin');
  
  // Determine who the other person in the chat is
  const otherUser = currentUser?.role === 'Admin' 
    ? mockUsers.find(u => u.role === 'Regional Menecer') // Admin talks to the first RM
    : admin; // RM talks to Admin

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !otherUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const relevantMessages = messages.filter(
    msg =>
      (msg.senderId === currentUser?.id && msg.receiverId === otherUser?.id) ||
      (msg.senderId === otherUser?.id && msg.receiverId === currentUser?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (!currentUser || !otherUser) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Mesajlar</CardTitle>
                  <CardDescription>Giriş etməmisiniz və ya çat üçün istifadəçi tapılmadı.</CardDescription>
              </CardHeader>
          </Card>
      )
  }

  return (
    <div className="grid h-[calc(100vh-100px)] grid-cols-1">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{otherUser.name}</CardTitle>
              <CardDescription>{otherUser.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 h-[calc(100%-150px)]">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {relevantMessages.map((msg) => {
                const isSender = msg.senderId === currentUser.id;
                const senderDetails = mockUsers.find(u => u.id === msg.senderId);

                return (
                  <div key={msg.id} className={cn('flex items-end gap-2', isSender ? 'justify-end' : 'justify-start')}>
                     {!isSender && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={senderDetails?.avatar} />
                            <AvatarFallback>{senderDetails?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                     )}
                    <div
                      className={cn(
                        'max-w-xs rounded-lg p-3 lg:max-w-md',
                        isSender ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-muted'
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                       <p className="mt-1 text-xs text-right opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                     {isSender && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={senderDetails?.avatar} />
                            <AvatarFallback>{senderDetails?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                     )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
        <Separator />
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              autoComplete="off"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
