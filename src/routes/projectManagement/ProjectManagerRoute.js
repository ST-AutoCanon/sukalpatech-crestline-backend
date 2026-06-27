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
  getProjectManagers,
  getPendingProjects,
  saveDepartmentTasks,
  getProjectTasks,
  getDashboardTaskStats,
  getWorkflowSummary,
  getDepartmentDetails,
  getAllProjectWorkflowController,
  getActiveProjects,
  getManagers,
  updateWorkflowTask
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

router.get(
  "/project-managers",
  auth,
  getProjectManagers
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

////assigned task////
router.post(
  "/project/:projectId/tasks",
  auth,
  saveDepartmentTasks
);

router.get(
  "/project/:projectId/tasks",
  auth,
  getProjectTasks
);
router.get(
  "/dashboard-tasks",
  auth,
  getDashboardTaskStats
);

router.get(
  "/workflow-summary",
  auth,
  getWorkflowSummary
);

router.get(
  "/department-details/:department",
  auth,
  getDepartmentDetails
);

router.get(
  "/all-project-workflows",
  auth,
  getAllProjectWorkflowController
);

router.get(
  "/active-projects",
  auth,
  getActiveProjects
);

router.get("/managers", auth,getManagers);

router.put(
  "/project/:projectId/workflow/:taskId",
  auth,updateWorkflowTask
);

export default router;