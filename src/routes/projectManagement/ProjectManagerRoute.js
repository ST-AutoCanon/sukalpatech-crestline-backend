import express from "express";

import {
  assignProjectToProjectManager,
  getAssignedProjects,
  getProjectById,
  updateProjectStatus,
  getProjectStatusHistory,
  getWorkflow,
  getNextDepartmentController,
} from "../../controllers/projectManagement/ProjectManagerController.js";

const router = express.Router();
import { auth } from "../../middleware/auth.js";

router.post(
  "/projects/assign",
  auth,
  assignProjectToProjectManager
);

/* ================= GET ASSIGNED PROJECTS ================= */

router.get(
  "/projects",auth,
  getAssignedProjects
);

/* ================= GET SINGLE PROJECT ================= */

router.get(
  "/projects/:id",auth,
  getProjectById
);

/* ================= UPDATE STATUS ================= */

router.patch(
  "/projects/:id/status",auth,
  updateProjectStatus
);

/* ================= STATUS HISTORY ================= */

router.get(
  "/projects/:id/history",auth,
  getProjectStatusHistory
);

/* ================= WORKFLOW ================= */

router.get(
  "/projects/:id/workflow",auth,
  getWorkflow
);

/* ================= NEXT DEPARTMENT ================= */

router.get(
  "/projects/:id/next-department",auth,
  getNextDepartmentController
);

export default router;