import React, { useState } from "react";
import type { Chat } from "@/types/chat";
import { Phone, Video, MoreVertical, Paperclip, Smile, Send, Moon, Plus, Search } from "lucide-react";


interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChat, onSelectChat }) => {

  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="w-[360px] bg-[#16213e] border-r border-gray-800 flex flex-col">
    {/* Header */}
    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Chats</h1>
      <div className="flex gap-3">
        <button className="hover:bg-gray-700 p-2 rounded-lg transition">
          <Moon size={20} />
        </button>
        <button className="hover:bg-gray-700 p-2 rounded-lg transition">
          <Plus size={20} />
        </button>
      </div>
    </div>

    {/* Search */}
    <div className="p-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a2e] text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition"
        />
      </div>
    </div>

    {/* Chat List */}
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat)}
          className={`p-4 cursor-pointer transition flex items-start gap-3 hover:bg-[#1a1a2e] ${
            activeChat?._id === chat._id ? "bg-[#1a1a2e]" : ""
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-semibold">
              {chat.name?.charAt(0).toUpperCase() || "?"}
            </div>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#16213e]"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold truncate">{chat.name}</h3>
              {chat.time && (
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400 truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
              {chat.unread > 0 && (
                <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ChatList;


