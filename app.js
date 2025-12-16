// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import authRoutes from "./src/routes/auth.routes.js";
// import departmentRoutes from "./src/routes/departments.routes.js";
// import adminRoutes from "./src/routes/admin.routes.js"
// import procurementRoutes from "./src/routes/procurement.routes/procurement.routes.js";
// import feasibilityRoutes from "./src/routes/feasibility.routes/feasibility.routes.js";
// import path from "path";
// const app = express();

//  app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));


// const allowedOrigins = [
//   process.env.FRONTEND_URL || "https://crestline.sts-test.site/", // fallback for local testing
// ];

// console.log("Allowed Origins:", allowedOrigins);
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like curl or Postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS: " + origin));
//     },
//     credentials: true,
//   })
// );
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/auth", authRoutes);
// app.use("/api/departments", departmentRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/procurement", procurementRoutes);
// app.use("/api/feasibility", feasibilityRoutes);

// app.get("/", (req, res) => {
//   res.send("Cristaline API is running...");
// });

// export default app;


import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import procurementRoutes from "./src/routes/procurement.routes/procurement.routes.js";
import feasibilityRoutes from "./src/routes/feasibility.routes/feasibility.routes.js";

const app = express();

/* =======================
   CORS CONFIG (FIXED)
======================= */

const allowedOrigins = [
  "https://crestline.sts-test.site",
  "https://tline.sts-test.site",
  "http://localhost:3000",
  "http://localhost:5174,"
];



app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, curl, postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   ROUTES
======================= */

app.use("/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/feasibility", feasibilityRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Cristaline API is running..." });
});

export default app;
