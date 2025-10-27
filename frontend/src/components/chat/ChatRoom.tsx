import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import type { Message, UserProps } from "@/types/chat"; // 👈 Import UserProps
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/actions/userActions";
import type { AppState } from "@/redux/store";
import { getSocket, getRoomId } from "@/services/socket"; // 👈 Import socket utils
import { getAllMessage } from "@/redux/actions/messageActions";

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  
  // activeChat is the USER we are talking to
  const [activeChat, setActiveChat] = useState<UserProps | null>(null);
  // currentChatId is the ID of the room
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const userList = useSelector((state: AppState) => state.userList);
  const messageList = useSelector((state: AppState) => state.messageList);

  const dispatch = useDispatch();

  const { loading, users: chats, error } = userList;
  // Renamed 'message' to 'fetchedMessages' to avoid conflict
  const { loading: messageLoading, message: fetchedMessages, error: messageError } = messageList;

  // ✅ Fetch users on component mount (if user is logged in)
  useEffect(() => {
    if (user?._id) {
      dispatch<any>(getAllUsers(user._id));
    }
  }, [dispatch, user?._id]);

  // ✅ Fetch messages when the active chat ID changes
  useEffect(() => {
    if (currentChatId) {
      // Assuming getAllMessage fetches by chatId
      // If it needs (userId, otherUserId), you'd pass (user._id, activeChat._id)
      dispatch<any>(getAllMessage(user._id, activeChat._id));
    } else {
      // Clear messages if no chat is active
      setMessages([]);
    }
  }, [dispatch, currentChatId]);

  // ✅ Load fetched messages into state
  useEffect(() => {
    if (fetchedMessages && Array.isArray(fetchedMessages)) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // ✅ Handle incoming socket messages (wrapped in useCallback)
  const handleNewMessage = useCallback((payload: { message: Message; tempId: string | null }) => {
    const newMessage = payload.message;
    
    // Only add message if it belongs to the currently open chat
    if (newMessage.chatId === currentChatId) {
      setMessages((prev) => [...prev, newMessage]);
      // TODO: Emit 'message_seen' event here
      // getSocket().emit("message_seen", { messageId: newMessage._id, ... });
    } else {
      // Optional: Show a notification for unread message in another chat
      console.log("Received message for another chat:", newMessage.chatId);
    }
  }, [currentChatId]); // Depend on currentChatId

  // ✅ Handle message delivery receipts (wrapped in useCallback)
  const handleMessagesDelivered = useCallback(({ chatId, userId }: { chatId: string; userId: string }) => {
    console.log(`Messages delivered for chat ${chatId} to user ${userId}`);
    // Optional: Update UI state to show 'delivered' ticks
    if (chatId === currentChatId) {
      setMessages(prev => 
        prev.map(msg => msg.receiver === userId ? { ...msg, delivered: true } : msg)
      );
    }
  }, [currentChatId]);

  // ✅ Setup socket listeners when user is available
  useEffect(() => {
    if (!user) return;

    // getSocket() will fail if called before AuthContext connects
    // This check ensures we wait for connection
    let socket: any;
    try {
      socket = getSocket();
    } catch (e) {
      console.warn("Socket not ready, listeners will be attached on next render.");
      return;
    }

    socket.on("new_message", handleNewMessage);
    socket.on("messages_delivered", handleMessagesDelivered);

    return () => {
      // Clean up listeners on component unmount or user change
      socket.off("new_message", handleNewMessage);
      socket.off("messages_delivered", handleMessagesDelivered);
    };
  }, [user, handleNewMessage, handleMessagesDelivered]); // Rerun if user or handlers change

  // ✅ Handle selecting a chat from the list
  const handleSelectChat = (chatUser: UserProps) => {
    if (!user) return;
    setActiveChat(chatUser);
    
    // Generate the consistent room ID
    const newChatId = getRoomId(user._id, chatUser._id);
    setCurrentChatId(newChatId);

    // ❗️ Join the socket room to receive messages
    getSocket().emit("join_chat", {
      chatId: newChatId,
      userId: user._id, // The user joining the room
    });
  };

  const handleSendMessage = () => {
    if (!activeChat || !currentChatId || !user || !messageInput.trim()) return;

    const socket = getSocket();

    // Create a temporary message for optimistic UI update
    const tempId = `temp-${Date.now()}`;
    // const tempMessage: Message = {
    //   _id: tempId, // Temporary ID
    //   sender: user._id,
    //   text: messageInput,
    //   receiver: activeChat._id, // The other user's ID
    //   createdAt: new Date().toISOString(), // Use ISO string for consistency
    //   chatId: currentChatId,
    // };

    // 1. Update UI immediately
    // setMessages((prev) => [...prev, tempMessage]);

    // 2. Send message to server
    socket.emit("private_message", {
      sender: user._id,
      receiver: activeChat._id,
      text: messageInput,
      chatId: currentChatId,
      tempId: tempId, // Send tempId for acknowledgment
    }, (ack: { ok: boolean; messageId?: string; error?: string }) => {
      // 3. Handle server acknowledgment
      if (ack.ok && ack.messageId) {
        // Server confirmed, update temp message with real ID and data
        setMessages(prev => prev.map(msg => 
          msg._id === tempId ? { ...msg, _id: ack.messageId! } : msg
        ));
      } else {
        console.error("Message failed to send:", ack.error);
        // Optional: Show error on UI (e.g., mark message as 'failed')
        setMessages(prev => prev.map(msg =>
          msg._id === tempId ? { ...msg, error: "Failed to send" } : msg
        ));
      }
    });

    setMessageInput("");
  };

  if (!user) {
    return showLogin ? (
      <LoginForm switchToSignup={() => setShowLogin(false)} />
    ) : (
      <SignupForm switchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="flex h-screen bg-[#1a1a2e] text-white">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : (
        <>
          <ChatList
            chats={chats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat} // 👈 Use new handler
          />
          <ChatWindow
            activeChat={activeChat}
            messages={messages} // 👈 Pass the already-filtered messages
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