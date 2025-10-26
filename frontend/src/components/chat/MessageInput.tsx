  import React from "react";
  import { Phone, Video, MoreVertical, Paperclip, Smile, Send, Moon, Plus, Search } from "lucide-react";


  interface MessageInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: () => void;
  }

  const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend }) => {
    return (
      <div className="bg-[#16213e] border-t border-gray-800 p-4">
      <div className="flex items-center gap-3 bg-[#1a1a2e] rounded-lg px-4 py-3">
        <button className="text-gray-400 hover:text-white transition">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button className="text-gray-400 hover:text-white transition">
          <Smile size={20} />
        </button>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded-lg transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
    );
  };

  export default MessageInput;
