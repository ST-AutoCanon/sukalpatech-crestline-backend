// import express from "express";
// // import { getEmployeesController, updateCategory } from "../controllers/admin.controller.js";

// import {
//   createEmployeeController,
//   getEmployeesController,
//   updateEmployeeController,
//   deleteEmployeeController,
// } from "../controllers/admin.controller.js";

// import { auth } from "../middleware/auth.js";

// const adminRouter = express.Router();

// const adminOnly = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Admin only" });
//   }
//   next();
// };

// // Apply JWT auth middleware to all admin routes
// adminRouter.use(auth);

// // Get all employees (admin only)
// // adminRouter.get("/employees", adminOnly, getEmployeesController);
// // adminRouter.put("/employees/:id/category", auth,updateCategory);


// /* CRUD Routes */
// adminRouter.post("/employees", adminOnly, createEmployeeController);
// adminRouter.get("/employees", adminOnly, getEmployeesController);
// adminRouter.put("/employees/:id", adminOnly, updateEmployeeController);
// adminRouter.delete("/employees/:id", adminOnly, deleteEmployeeController);

// export default adminRouter;

// //update category

import express from "express";

import {
  createEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
  updateCategory,
  approveRequest,
  fetchCategoryLimits,
  addCategoryLimitsController,
  updateCategoryLimitsController
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

/* ================= CATEGORY LIMITS ================= */
// Fetch current category limits
adminRouter.get("/category-limits", adminOnly, fetchCategoryLimits);

// Add new category limits
adminRouter.post("/category-limits/add", adminOnly, addCategoryLimitsController);

// Update existing category limits
adminRouter.put("/category-limits/update", adminOnly, updateCategoryLimitsController);

/* ================= APPROVAL ROUTE ================= */
adminRouter.post("/approve", auth, approveRequest);

export default adminRouter;
