import React from "react";
import type { Message }  from "@/types/chat";


interface MessageItemProps {
  msg: Message;
  currentUser: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, currentUser }) => {
  const isMine = msg.from === currentUser;

  return (
    <div className={`mb-2 flex flex-col ${isMine ? "items-end" : "items-start"}`}>
      <p className="text-sm font-semibold">{msg.from}</p>
      <div
        className={`inline-block px-3 py-2 rounded-lg max-w-xs break-words ${
          isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {msg.text}
      </div>
      <p className="text-xs text-gray-500">{msg.createdAt}</p>
    </div>
  );
};

export default MessageItem;
