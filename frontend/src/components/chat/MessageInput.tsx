import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend }) => {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border p-2 rounded-l focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        onClick={onSend}
        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
