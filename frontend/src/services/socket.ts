// src/services/socket.ts
import { API_URL } from "@/config";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  socket = io(API_URL); // server URL
  return socket;
};

export const getSocket = () => socket;
