// src/services/socket.ts
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/config";
let socket: Socket;

export const connectSocket = (userId: string) => {
  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Connect new socket with auth
  socket = io(API_URL, {
    auth: {
      userId: userId, // 👈 Send userId on handshake
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id, "for user:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not connected. Call connectSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket manually disconnected.");
  }
};

// Utility to get the room ID, mirroring backend logic
export const getRoomId = (userId1: string, userId2: string) => {
  // Sort IDs to ensure consistent room name
  return [userId1, userId2].sort().join("-");
};