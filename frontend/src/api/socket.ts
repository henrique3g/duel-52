import { io, Socket } from "socket.io-client";

export let socket: Socket | undefined;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:8082');
  }
  if (socket.disconnected) {
    socket.connect();
  }
  return socket;
}

