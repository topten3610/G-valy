import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Include protocol

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      autoConnect: true,
    });

    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("Connected to server");
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socketIo.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socketIo.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
