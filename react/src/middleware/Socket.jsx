import { io } from "socket.io-client";
let socket = null;
export const connectSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: { token }
    });
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
  }
  return socket;
};
export const getSocket = () => socket;
export const ensureSocketConnection = () => {
  const token = localStorage.getItem("token");
  if (token && !socket) {
    connectSocket(token);
  }
  return socket;
};
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
