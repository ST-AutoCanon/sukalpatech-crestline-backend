import express from "express";

import {
  createEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
  updateCategory,
} from "../controllers/admin.controller.js";

import { auth } from "../middleware/auth.js";

const adminRouter = express.Router();

// Middleware to allow only admins
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};

// Apply JWT auth middleware to all admin routes
adminRouter.use(auth);

/* ================= EMPLOYEE CRUD ROUTES ================= */
adminRouter.post("/employees", adminOnly, createEmployeeController);
adminRouter.get("/employees", adminOnly, getEmployeesController);
adminRouter.put("/employees/:id", adminOnly, updateEmployeeController);
adminRouter.delete("/employees/:id", adminOnly, deleteEmployeeController);

/* ================= EMPLOYEE CATEGORY ================= */
adminRouter.put("/employees/:id/category", auth, updateCategory);


export default adminRouter;
