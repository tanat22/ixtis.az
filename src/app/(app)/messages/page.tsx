'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { mockUsers, mockMessages } from '@/lib/data';
import type { User, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function MessagesPage() {
  const { user: currentUser } = useUser();
  const [messages, setMessages] = React.useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = React.useState('');
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !currentUser || !selectedUser) return;

    let attachmentData: Message['attachment'] = null;
    if (attachment) {
      attachmentData = {
        url: URL.createObjectURL(attachment),
        type: 'image',
      };
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      attachment: attachmentData,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setAttachment(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const getVisibleUsers = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'Super Admin':
        // Super Admin sees everyone except themself
        return mockUsers.filter(u => u.id !== currentUser.id);
      case 'Admin':
        // Admin sees all Regional Managers
        return mockUsers.filter(u => u.role === 'Regional Menecer');
      case 'Regional Menecer':
        // Regional Manager sees only Admins
        return mockUsers.filter(u => u.role === 'Admin');
      default:
        return [];
    }
  };
  
  const visibleUsers = getVisibleUsers();
  
  React.useEffect(() => {
    // Select the first user in the list by default if it's not already set
    if (!selectedUser && visibleUsers.length > 0) {
      setSelectedUser(visibleUsers[0]);
    }
     // If the selected user is no longer in the visible list, clear it
    if(selectedUser && !visibleUsers.some(u => u.id === selectedUser.id)){
        setSelectedUser(null);
    }
  }, [visibleUsers, selectedUser]);
  
  const getRelevantMessages = () => {
    if (!currentUser || !selectedUser) return [];

    if (currentUser.role === 'Super Admin') {
        // Super admin can see any conversation they select. 
        // This logic implies they are watching a conversation between two other users.
        // For simplicity, we'll assume the super admin is messaging the selected user directly.
        // A more complex system would allow selecting two users to view their chat.
        return messages.filter(msg =>
          (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
          (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
      
    if (currentUser.role === 'Admin') {
         // Admin can see messages between them and the selected Regional Manager
        return messages.filter(msg =>
            (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
            (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
      
    if (currentUser.role === 'Regional Menecer') {
         // Regional Manager can only see messages between them and the selected Admin
        return messages.filter(msg =>
            (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
            (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return [];
  };

  const relevantMessages = getRelevantMessages();

  if (!currentUser) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Mesajlar</CardTitle>
                  <CardDescription>Giriş etməmisiniz.</CardDescription>
              </CardHeader>
          </Card>
      )
  }

  return (
    <div className="grid h-[calc(100vh-100px)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card className="md:col-span-1 lg:col-span-1">
        <CardHeader>
            <CardTitle>Söhbətlər</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
             <ScrollArea className="h-[calc(100vh-200px)]">
                 {visibleUsers.map(user => (
                     <div key={user.id}
                          className={cn(
                            "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted",
                            selectedUser?.id === user.id && "bg-muted"
                          )}
                          onClick={() => setSelectedUser(user)}
                     >
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                         </div>
                     </div>
                 ))}
             </ScrollArea>
        </CardContent>
      </Card>
      <div className="md:col-span-2 lg:col-span-3">
        {selectedUser ? (
             <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedUser.name}</CardTitle>
                      <CardDescription>{selectedUser.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[calc(100vh-290px)] p-6">
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
                              {msg.attachment?.type === 'image' && (
                                  <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">
                                    <Image 
                                        src={msg.attachment.url}
                                        alt="Attachment"
                                        width={200}
                                        height={150}
                                        className="rounded-md mb-2 object-cover cursor-pointer"
                                    />
                                  </a>
                              )}
                              {msg.content && <p className="text-sm">{msg.content}</p>}
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
                <div className="p-4 bg-background rounded-b-lg">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={attachment ? `${attachment.name}` : "Mesajınızı yazın..."}
                      autoComplete="off"
                      readOnly={!!attachment}
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleAttachmentChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
             </Card>
        ) : (
            <Card className="h-full flex flex-col items-center justify-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle>Söhbət seçin</CardTitle>
                <CardDescription>Mesajları görmək üçün soldakı siyahıdan bir istifadəçi seçin.</CardDescription>
            </Card>
        )}
      </div>
    </div>
  );
}
