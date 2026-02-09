import express from "express";
import { getEmployeesController, updateCategory } from "../controllers/admin.controller.js";
import { auth } from "../middleware/auth.js";

const adminRouter = express.Router();

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};

// Apply JWT auth middleware to all admin routes
adminRouter.use(auth);

// Get all employees (admin only)
adminRouter.get("/employees", adminOnly, getEmployeesController);
adminRouter.put("/employees/:id/category", auth,updateCategory);


export default adminRouter;

//update category
