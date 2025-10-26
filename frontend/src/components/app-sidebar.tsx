import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatListItem from "@/pages/chats/ChatListItem";
import { Moon, Plus, Phone, Video, MoreVertical, Paperclip, Smile, Send } from 'lucide-react';
import { chats } from '@/demo/data';

export function AppSidebar() {
  return (
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
  );
}
