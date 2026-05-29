import express from "express";
import {
  assignProject,
  getAllProjects,
  updateProjectStatus,
  getProjectStatus,
  upsertProjectWorkflow,
  fetchProjectsForDepartment,
  getProjectWorkflow,
  getProjectByBDId,
  getNextDepartmentController,
} from "../../controllers/projectManagement/projectController.js";

import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/assign", auth, assignProject);
router.get("/", auth, getAllProjects);

router.post("/status", auth, updateProjectStatus);
router.get("/status/:project_id", auth, getProjectStatus);

// router.put("/workflow", auth, upsertProjectWorkflow);
router.put("/:project_id/workflow", auth, upsertProjectWorkflow);

// 🔥 ADD THIS ROUTE
router.get("/by-bd/:bd_request_id", auth, getProjectByBDId);

router.get("/:project_id/workflow", auth, getProjectWorkflow);
router.get(
  "/next/:project_id/:current_department",
  auth,
  getNextDepartmentController,
);
router.get(
  "/projects/department/:department",
  auth,
  fetchProjectsForDepartment,
);



export default router;