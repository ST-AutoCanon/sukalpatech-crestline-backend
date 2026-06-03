import express from "express";

import {
  getProjectsForAssignedManager,
  assignProjectToProjectManager,
  getAssignedProjects,
  getProjectById,
  updateProjectStatus,
  getProjectStatusHistory,
  getWorkflow,
  getNextDepartmentController,
  assignManager,
  getPendingProjects
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
  "/pending-projects",
  auth,
  getPendingProjects
);

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

/* ================= ASSIGN TO PM A/B/C ================= */

router.put(
  "/projects/:id/assign-manager",
  auth,
  assignManager
);

router.get(
  "/assigned-projects",
  auth,
  getProjectsForAssignedManager
);

export default router;