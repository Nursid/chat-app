import React, { useEffect, useState } from "react";
import { connectSocket, getSocket } from "@/services/socket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { API_URL } from "@/config";

interface Message {
  from: string;
  text: string;
  createdAt: string;
  chatId?: string;
}

interface Chat {
  id: string;
  name: string;
}

interface UserProps {
  email: string;
  name: string;
  username: string;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async () => {
    const newErrors: UserProps = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsJoined(true);
      try{
        const res = await axios.post(`${API_URL}/api/user/add`, formData)
        if(res.data.status === 200){
          console.log('Form submitted:', res.data);
        }
      }catch(error){
        console.log('error:', error);
      }
    }
  };


  const chats: Chat[] = [
    { id: "chat1", name: "Alice" },
    { id: "chat2", name: "Bob" },
  ];

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", () => console.log("✅ Connected:", socket.id));

    // listen for messages for any room the user has joined
    socket.on("new_message", (msg: Message) => {
      console.log(msg)
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messages_delivered", ({ chatId, userId }) => {
      console.log(`Messages delivered for chat ${chatId} to user ${userId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setMessages([]); // reset messages for this chat

    const socket = getSocket();
    socket.emit("join_chat", { chatId: chat.id, userId: formData.username });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
  
    const socket = getSocket();
    const msgPayload = {
      from: formData.username,
      to: activeChat.id, // or recipient userId
      text: messageInput,
      chatId: activeChat.id,
    };
    socket.emit("private_message", msgPayload);
    setMessageInput("");
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please enter your details below</CardDescription>
        </CardHeader>
        <CardContent>
      <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Submit
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chat list */}
      <div className="w-64 border-r border-gray-300 p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            className={`p-2 cursor-pointer rounded mb-1 ${
              activeChat?.id === chat.id ? "bg-blue-200" : "hover:bg-gray-200"
            }`}
          >
            {chat.name}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col p-4 bg-gray-100">
        <div className="flex-1 overflow-y-auto mb-2 bg-white p-3 rounded-lg shadow-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex flex-col ${
                msg.message.sender === formData.username ? "items-end" : "items-start"
              }`}
            >
              <p className="text-sm font-semibold">{msg.message.sender}</p>
              <div
                className={`inline-block px-3 py-2 rounded-lg max-w-xs break-words ${
                  msg.message.sender === formData.username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.message.text}
              </div>
              <p className="text-xs text-gray-500">{msg.message.createdAt}</p>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-l focus:outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
