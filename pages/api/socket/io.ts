
// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO } from "socket.io";
// import { NextApiResponseServerIo } from "@/types";

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

//   const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
//     if (!res.socket?.server?.io) {
//       const path = "/api/socket/io";
//       const httpServer: NetServer | undefined = res.socket?.server as any;
//       if (httpServer) {
//         const io = new ServerIO(httpServer, {
//           path,
//           addTrailingSlash: false,
//           cors: {
//             origin: process.env.NEXT_PUBLIC_SITE_URL,
//             methods: ["GET", "POST"],
//             credentials: true,
//           },
//         });
//         (res.socket as any).server.io = io;
//       }
//     }
  
//     res.end();
//   };
  
//   export default ioHandler;

// pages/api/socket.ts or pages/api/socket/io.ts

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

    res.socket.server.io = io;

   
  }

  res.end();
};

export default ioHandler;
