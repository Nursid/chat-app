import React from "react";
import type { Chat } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChat, onSelectChat }) => {

  return (
    <div className="w-64 border-r border-gray-300 p-2">
      {chats?.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat)}
          className={`p-2 cursor-pointer rounded mb-1 ${
            activeChat?._id === chat._id ? "bg-blue-200" : "hover:bg-gray-200"
          }`}
        >
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;


