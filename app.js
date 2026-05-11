import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import vendorRoutes from "./src/routes/vendor/vendor.route.js";
import newProcurementRoutes from "./src/routes/NewProcurement/prRoute.js";
import newFeasibilityRoutes from "./src/routes/NewProcurement/feasibilityReqRoutes.js";
import newFinanceRoutes from "./src/routes/NewProcurement/financeRequests.js";
import newStoreRoutes from "./src/routes/NewProcurement/storeRequestsRoutes.js";
import categoriesRoutes from "./src/routes/categories/categoryRoutes.js";
import itemsRoutes from "./src/routes/items/item.routes.js";
import orgRoutes from "./src/routes/organisationAdmin.route.js";
import orgRoutesgenric from "./src/routes/organisation.route.js";
import categorylimitRoutes from "./src/routes/categorylimit/categorylimit.route.js";
import notificationRoutes from "./src/routes/notification/notificationRoutes.js"; // ✅ import notification routes

import newBDBuisnessDevelopmentRoutes from "./src/routes/NewBD/businessDevelopment.js";
import newBDfeasibilityRoutes from "./src/routes/NewBD/businessDevelopment.js";
import businessDevelopmentRoutes from "./src/routes/Businessdevelopment/businessDevelopmetroute.js";

import twowheelerRoutes from "./src/routes/Businessdev/TwoWheeler.route.js";
import threewheelerRoutes from "./src/routes/Businessdev/ThreeWheeler.route.js";
import foodbusinessRoutes from "./src/routes/Businessdev/Foodbusiness.route.js";
import goldbusinessRoutes from "./src/routes/Businessdev/Goldbusiness.route.js";

import projectRoutes from "./src/routes/projectManagement/projectRoutes.js";


import http from "http";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import Redis from "ioredis";
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://flowracle.sts-test.online",
  "https://crestline.sts-test.online",
  "https://sjaem.sts-test.online",
];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://flowracle.sts-test.online",
      "https://crestline.sts-test.online",
      "https://sjaem.sts-test.online",
    ],
    credentials: true,
  },
});

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join_role", (role) => {
//     socket.join(role);
//     console.log(`User joined role room: ${role}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_role", (role) => {
    socket.join(role);
    console.log(`User joined role room: ${role}`);
  });

  // ✅ ADD THIS
  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined personal room: user_${userId}`);
  });

  // Join department room (optional)
  socket.on("join_department", (departmentId) => {
    socket.join(`department_${departmentId}`);
    console.log(
      `🔑 Socket ${socket.id} joined department room: department_${departmentId}`,
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ================= Redis Subscriber =================

const redisSubscriber = new Redis(process.env.REDIS_URL);

redisSubscriber.subscribe("notification_channel");

redisSubscriber.on("message", (channel, message) => {
  if (channel === "notification_channel") {
    const notification = JSON.parse(message);

    console.log("🔔 Realtime notification:", notification);

    // Send to role
    if (notification.recipient_role) {
      io.to(notification.recipient_role).emit("new_notification", notification);
    }

    // Send to specific user
    if (notification.recipient_id) {
      io.to(`user_${notification.recipient_id}`).emit(
        "new_notification",
        notification,
      );
    }

    // 3️⃣ Send to department room (optional)
    if (notification.recipient_department_id && io) {
      io.to(`department_${notification.recipient_department_id}`).emit(
        "new_notification",
        notification,
      );
      console.log(
        `📤 Sent notification to department: ${notification.recipient_department_id}`,
      );
    }
  }
});

export { io };
  
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser()); // ✅ MUST ADD
app.use(morgan("dev"));

// ✅ ADD THIS HERE
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    // "frame-ancestors http://localhost:5173 http://localhost:5174",
    "frame-ancestors https://flowracle.sts-test.site https://crestline.sts-test.site https://sjaem.sts-test.site",
  );
  next();
});


app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(),  "uploads")
  )
);

app.use("/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/vendor", vendorRoutes);

app.use("/api/new-procurement", newProcurementRoutes);
app.use("/api/DB/new-DB", newBDBuisnessDevelopmentRoutes);
app.use("/api/DB/new-feasibility", newBDfeasibilityRoutes);
app.use("/api/new-feasibility", newFeasibilityRoutes);
app.use("/api/new-finance", newFinanceRoutes);
app.use("/api/new-store", newStoreRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/business-development", businessDevelopmentRoutes);
// ---------------- Notifications ----------------
app.use("/api/notifications", notificationRoutes);

app.use("/api/organisations-admin", orgRoutes);
app.use("/api/organisation", orgRoutesgenric);
app.use("/api/categorylimit", categorylimitRoutes);

// Business Development APIs per type
app.use("/api/business-development/2w", twowheelerRoutes);
app.use("/api/business-development/3w", threewheelerRoutes);
app.use("/api/business-development/food", foodbusinessRoutes);
app.use("/api/business-development/gold",goldbusinessRoutes)


app.use("/api/project", projectRoutes);

//test---->
app.get("/", (req, res) => {
  res.send("Cristaline API is running...");
});

export default app;
