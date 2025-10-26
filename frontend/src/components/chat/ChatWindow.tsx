import React from "react";

import type { Message }  from "@/types/chat";

import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
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
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-2 bg-white p-3 rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <MessageItem key={index} msg={msg} currentUser={currentUser} />
        ))}
      </div>
      <MessageInput value={messageInput} onChange={setMessageInput} onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
