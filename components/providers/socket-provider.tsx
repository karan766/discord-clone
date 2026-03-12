"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Socket.IO endpoint first
    const initializeSocket = async () => {
      try {
        // Ping the socket endpoint to initialize the server
        await fetch("/api/socket/io");
        
        // Small delay to ensure server is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
          path: "/api/socket/io",
          addTrailingSlash: false,
          withCredentials: true,
          transports: ["polling", "websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
          setIsConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
          setIsConnected(false);
        });

        setSocket(socketInstance);
      } catch (error) {
        // Failed to initialize socket
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};