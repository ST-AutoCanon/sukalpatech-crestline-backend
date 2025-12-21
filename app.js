import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import adminRoutes from "./src/routes/admin.routes.js"
import procurementRoutes from "./src/routes/procurement.routes/procurement.routes.js";
import feasibilityRoutes from "./src/routes/feasibility.routes/feasibility.routes.js";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/feasibility", feasibilityRoutes);

//test---->
app.get("/", (req, res) => {
  res.send("Cristaline API is running...");
});

export default app;
