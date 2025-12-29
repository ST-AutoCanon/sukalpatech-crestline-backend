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
app.use("/api/new-feasibility", newFeasibilityRoutes);
app.use("/api/new-finance", newFinanceRoutes);
app.use("/api/new-store", newStoreRoutes);

//test---->
app.get("/", (req, res) => {
  res.send("Cristaline API is running...");
});

export default app;
