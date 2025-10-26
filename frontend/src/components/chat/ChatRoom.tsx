import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import type { Chat, Message } from "@/types/chat";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/actions/userActions";
import type { AppState } from "@/redux/store";
import { connectSocket, getSocket } from "@/services/socket";

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const userList = useSelector((state: AppState) => state.userList);


  const dispatch = useDispatch();
  
  const { loading, users: chats, error } = userList;

  // ✅ Fetch users on component mount
  useEffect(() => {
    dispatch<any>(getAllUsers(user?._id));
  }, [dispatch, user?._id]);

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

  const handleSendMessage = () => {
    if (!activeChat) return;
    const socket = getSocket();

    const msg: Message = {
      from: user._id,
      text: messageInput,
      to: activeChat._id,
      createdAt: new Date().toLocaleTimeString(),
      chatId: activeChat._id, // make sure _id exists in Chat type
    };
    console.log(msg)
    socket.emit("private_message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessageInput("");
  }



  if (!user) {
    return showLogin ? (
      <LoginForm switchToSignup={() => setShowLogin(false)} />
    ) : (
      <SignupForm switchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="flex h-screen">
    {loading ? (
  <p>Loading users...</p> // ✅ Show this when loading
) : (
  <>
    <ChatList
      chats={chats}
      activeChat={activeChat}
      onSelectChat={setActiveChat}
    />
    <ChatWindow
      messages={messages}
      currentUser={user._id}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      handleSendMessage={handleSendMessage}
    />
  </>
)}

    </div>
  );
};

export default ChatRoom;
