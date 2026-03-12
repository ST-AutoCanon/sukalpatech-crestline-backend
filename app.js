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

import newBDBuisnessDevelopmentRoutes from "./src/routes/NewBD/businessDevelopment.js";
import newBDfeasibilityRoutes from "./src/routes/NewBD/businessDevelopment.js";
import businessDevelopmentRoutes from "./src/routes/Businessdevelopment/businessDevelopmetroute.js";

import twowheelerRoutes from "./src/routes/Businessdev/TwoWheeler.route.js";
import threewheelerRoutes from "./src/routes/Businessdev/ThreeWheeler.route.js";
import foodbusinessRoutes from "./src/routes/Businessdev/Foodbusiness.route.js";

import path from "path";
import cookieParser from "cookie-parser";
const app = express();

// app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//   }),
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://flowracle.sts-test.site/",
  "https://crestline.sts-test.site",
  "https://sjaem.sts-test.site",
];

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
    "frame-ancestors https://flowracle.sts-test.site/ https://crestline.sts-test.site https://sjaem.sts-test.site",
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

app.use("/api/organisations-admin", orgRoutes);
app.use("/api/organisation", orgRoutesgenric);
app.use("/api/categorylimit", categorylimitRoutes);

// Business Development APIs per type
app.use("/api/business-development/2w", twowheelerRoutes);
app.use("/api/business-development/3w", threewheelerRoutes);
app.use("/api/business-development/food", foodbusinessRoutes);
//test---->
app.get("/", (req, res) => {
  res.send("Cristaline API is running...");
});

export default app;
