import express from "express";
import * as controller from "../controllers/organisation.controller.js";
import { auth } from "../middleware/auth.js";

const superAdminRouter = express.Router();

// Auth first
superAdminRouter.use(auth);

// Role guard
const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super Admin only",
    });
  }
  next();
};

superAdminRouter.use(superAdminOnly);

// Organisation Routes
superAdminRouter.post("/register", controller.registerOrg);
superAdminRouter.get("/", controller.getAllOrgs);
superAdminRouter.get("/departments", controller.getDepartmentsController);
superAdminRouter.get("/:id", controller.getOrgById);

// ✅ NEW: Update Organisation
superAdminRouter.put("/:id", controller.updateOrg);

// ✅ NEW: Delete Organisation
superAdminRouter.delete("/:id", controller.deleteOrg);

// Department Routes
superAdminRouter.post("/departments/add", controller.addDepartmentToOrg);
superAdminRouter.delete("/departments/remove", controller.removeDepartmentFromOrg);



export default superAdminRouter;
