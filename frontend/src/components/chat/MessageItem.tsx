import React from "react";
import type { Message }  from "@/types/chat";


interface MessageItemProps {
  msg: Message;
  currentUser: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, currentUser }) => {
  const isMine = msg.sender === currentUser;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-md px-4 py-2.5 rounded-2xl ${
        isMine
          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
          : "bg-[#2a2a4e] text-white"
      }`}
    >
      <p className="mb-1">{msg.text}</p>
      <span className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
})}</span>
    </div>
  </div>
  );
};

export default React.memo(MessageItem);
