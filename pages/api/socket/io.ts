

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseServerIo } from "@/types"; // Make sure this is defined

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server...");

    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket/io", // match frontend path
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.IO server initialized successfully");
  } else {
    console.log("♻️ Socket.IO server already running");
  }

  res.end();
};

export default ioHandler;
