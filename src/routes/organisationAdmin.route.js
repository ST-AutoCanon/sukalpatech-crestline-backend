// import express from "express";
// import * as controller from "../controllers/organisation.controller.js";
// import { auth } from "../middleware/auth.js";

// // const router = express.Router();


// const superAdminRouter = express.Router();
// const superAdminOnly = (req, res, next) => {
//   if (!req.user || req.user.role !== "super_admin") {
//     console.log("Unauthorized access attempt by user:", req.user);
//     return res.status(403).json({ success: false, message: "Super Admin only" });
//   }
//   next();
// };
// // Apply JWT auth middleware to all superAdmin routes
// superAdminRouter.use(auth);


// superAdminRouter.post("/register", superAdminOnly, controller.registerOrg);
// superAdminRouter.get("/", superAdminOnly, controller.getAllOrgs);

// export default superAdminRouter;

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

// Routes
superAdminRouter.post("/register", controller.registerOrg);
superAdminRouter.get("/", controller.getAllOrgs);

superAdminRouter.post("/departments/add", controller.addDepartmentToOrg);
superAdminRouter.delete("/departments/remove", controller.removeDepartmentFromOrg);
// router.get("/org-codes", getOrgCodes);


export default superAdminRouter;
