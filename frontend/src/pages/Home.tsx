import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Moon, Plus, Phone, Video, MoreVertical, Paperclip, Smile, Send } from 'lucide-react';
import ChatListItem from './chats/ChatListItem';
import MessageBubble from './chats/MessageBubble';
import { connectSocket, getSocket } from '@/services/socket';

// Main App Component
export default function MessagingApp() {
  const [activeChat, setActiveChat] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState([
    { id: 0, name: 'Yong', message: '', time: '', unread: 0, avatar: '', status: 'Online' },
    { id: 1, name: 'Sarah', message: '', time: '', unread: 0, avatar: '' },
    // add more
  ]);

  const [messages, setMessages] = useState<any>([]);


  useEffect(() => {
    const socket = connectSocket();

    socket.on('connect', () => console.log('Connected to server'));

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, { ...msg, isSent: false }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const socket = getSocket();
    const newMsg = {
      id: Date.now(),
      message: messageInput,
      time: new Date().toLocaleTimeString(),
      isSent: true,
    };

    // send to server
    socket.emit('createMessage', { from: 'Me', text: messageInput });

    // update local state
    setMessages((prev) => [...prev, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="flex h-screen bg-[#1a1625] text-white">
      {/* Sidebar */}
      <div className="w-80 bg-[#1a1625] border-r border-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Chats</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Moon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              isActive={activeChat === chat.id}
              onClick={() => setActiveChat(chat.id)}
            />
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-purple-600">
                {chats[activeChat].name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{chats[activeChat].name}</h2>
              <p className="text-xs text-gray-400">{chats[activeChat].status || 'Online'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Time Separator */}
        <div className="flex justify-center py-4">
          <div className="bg-gray-800/50 px-4 py-1 rounded-full text-xs text-gray-400">
            11:11 AM
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-500"
            />
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              size="icon" 
              className="bg-purple-600 hover:bg-purple-700 h-8 w-8 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}