import React, { useEffect, useRef } from "react";
import type { Message, UserProps } from "@/types/chat";
import { Phone, Video, MoreVertical } from "lucide-react";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
// 👇 Import the new DateSeparator component
import DateSeparator from "./DateSeparator"; 

// 👈 Include the groupMessagesByDate utility here or import it
/**
 * Groups messages by date and formats the date string.
 * @param {Message[]} messages - The array of message objects.
 * @returns {Array<{dateLabel: string, messages: Message[]}>}
 */
const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;

  const getDayLabel = (dateString) => {
    const today = new Date();
    const messageDate = new Date(dateString);

    // Normalize dates to midnight for comparison
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const messageMidnight = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    const diffTime = todayMidnight.getTime() - messageMidnight.getTime();
    // Use an absolute value to handle potential timezone issues where diffDays might be -0
    const diffDays = Math.round(Math.abs(diffTime / (1000 * 60 * 60 * 24))); 

    // Re-calculate diffDays to be the actual difference (positive for past dates)
    const actualDiffDays = Math.floor((todayMidnight.getTime() - messageMidnight.getTime()) / (1000 * 60 * 60 * 24));


    if (actualDiffDays === 0) {
      return "Today";
    } else if (actualDiffDays === 1) {
      return "Yesterday";
    } else {
      // Fallback to full date format (e.g., Oct 26, 2025)
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  for (const message of messages) {
    // We only care about the date part of the createdAt string
    const messageDateString = new Date(message.createdAt).toDateString();

    if (messageDateString !== currentDate) {
      // New day detected, create a new group
      currentDate = messageDateString;
      groups.push({
        dateLabel: getDayLabel(message.createdAt),
        messages: [],
      });
    }

    // Add message to the current (last) group
    groups[groups.length - 1].messages.push(message);
  }

  return groups;
};
// ☝️ End of utility function

interface ChatWindowProps {
  activeChat: UserProps | null;
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
  activeChat,
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom whenever messages array changes
    scrollToBottom();
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a2e]">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  // ⭐️ Group messages by date here ⭐️
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a2e]">
      {/* Chat Header ... (rest of the header remains the same) */}
      <div className="bg-[#16213e] border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-semibold text-white">
            {activeChat.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="font-semibold text-white">{activeChat.name}</h2>
            <p className="text-xs text-gray-400">
              {activeChat.online ? "Online" : "Offline"}
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
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {/* ⭐️ Iterate over the grouped messages ⭐️ */}
            {groupedMessages.map((group) => (
              <React.Fragment key={group.dateLabel}>
                {/* 1. Render the Date Separator */}
                <DateSeparator label={group.dateLabel} />
                
                {/* 2. Render all messages for that date */}
                {group.messages.map((msg) => (
                  <MessageItem key={msg._id} msg={msg} currentUser={currentUser} />
                ))}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input ... (remains the same) */}
      <MessageInput
        value={messageInput}
        onChange={setMessageInput}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default React.memo(ChatWindow);