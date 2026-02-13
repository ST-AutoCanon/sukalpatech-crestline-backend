import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import adminRoutes from "./src/routes/admin.routes.js"
import vendorRoutes from "./src/routes/vendor/vendor.route.js";
import newProcurementRoutes from "./src/routes/NewProcurement/prRoute.js";
import newFeasibilityRoutes from "./src/routes/NewProcurement/feasibilityReqRoutes.js";
import newFinanceRoutes from "./src/routes/NewProcurement/financeRequests.js";
import newStoreRoutes from "./src/routes/NewProcurement/storeRequestsRoutes.js";
import categoriesRoutes from "./src/routes/categories/categoryRoutes.js";
import itemsRoutes from "./src/routes/items/item.routes.js";
import orgRoutes from "./src/routes/organisationAdmin.route.js";
import orgRoutesgenric from "./src/routes/organisation.route.js";

import newBDBuisnessDevelopmentRoutes from "./src/routes/NewBD/businessDevelopment.js";
import newBDfeasibilityRoutes from "./src/routes/NewBD/businessDevelopment.js";
import businessDevelopmentRoutes from "./src/routes/Businessdevelopment/businessDevelopmetroute.js";

import path from "path";
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

// app.get("/", (req, res) => {
//   res.send("Cristaline API is running...");
// });

//test---->
app.get("/", (req, res) => {
  res.send("Cristaline API is running...");
});

export default app;
