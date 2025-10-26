import React, {useEffect} from "react";
import type { Message }  from "@/types/chat";
import { Phone, Video, MoreVertical, Paperclip, Smile, Send, Moon, Plus, Search } from "lucide-react";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  activeChat: any;
  messages: Message[];
  currentUser: string;
  messageInput: string;
  setMessageInput: (val: string) => void;
  handleSendMessage: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUser,
  messageInput,
  setMessageInput,
  handleSendMessage,
  activeChat
}) => {

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a2e]">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  // Filter messages for active chat
  const filteredMessages = messages.filter(msg => 
    (msg.sender === currentUser && msg.receiver === activeChat._id) ||
    (msg.sender === activeChat._id && msg.receiver === currentUser)
  );




  return (
    <div className="flex-1 flex flex-col bg-[#1a1a2e]">
    {/* Chat Header */}
    <div className="bg-[#16213e] border-b border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-semibold text-white">
          {activeChat.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <h2 className="font-semibold text-white">{activeChat.name}</h2>
          <p className="text-xs text-gray-400">
            {activeChat.online ? "Online" : "Last seen recently"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="hover:bg-gray-700 p-2 rounded-lg transition text-white">
          <Phone size={20} />
        </button>
        <button className="hover:bg-gray-700 p-2 rounded-lg transition text-white">
          <Video size={20} />
        </button>
        <button className="hover:bg-gray-700 p-2 rounded-lg transition text-white">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>

    {/* Messages Area */}
    <div className="flex-1 overflow-y-auto p-6">
      {filteredMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          {filteredMessages.map((msg, index) => (
            <MessageItem key={index} msg={msg} currentUser={currentUser} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>

    {/* Message Input */}
    <MessageInput 
      value={messageInput} 
      onChange={setMessageInput} 
      onSend={handleSendMessage} 
    />
  </div>
  );
};

export default ChatWindow;
