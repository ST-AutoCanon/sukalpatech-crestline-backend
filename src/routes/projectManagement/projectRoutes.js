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
  updateAssignedToController,
  getProjectTasks,
  getEmployeesByDepartment,
  assignEmployeeTasks,
  getEmployeeTasks
} from "../../controllers/projectManagement/projectController.js";

import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/assign", auth, assignProject);

router.put(
  "/:id/assign",
  auth,
  updateAssignedToController
);
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
router.get(
  "/project/:projectId/tasks",
  auth,
  getProjectTasks
);

router.get(
  "/employees/:department",auth,
  getEmployeesByDepartment
);
router.post(
  "/employee-task",
  auth,
  assignEmployeeTasks
);

router.get(
  "/project/:projectId/employee-tasks",
  auth,
  getEmployeeTasks
);
export default router;