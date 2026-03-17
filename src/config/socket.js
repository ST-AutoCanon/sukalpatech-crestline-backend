// import { Server } from "socket.io";

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("join_role", (role) => {
//       socket.join(role);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
// };

// export { io };

import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*", credentials: true } });

  // Redis adapter for cross-process
  const pubClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });
  const subClient = pubClient.duplicate();
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join_role", (role) => socket.join(role));
    socket.on("disconnect", () => console.log("User disconnected"));
  });
};

export { io };