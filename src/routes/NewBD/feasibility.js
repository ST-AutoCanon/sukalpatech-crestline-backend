import express from "express";
import * as feasibilityController from "../../controllers/NewBD/feasibility.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Add a new status/comment for Feasibility
router.post(
  "/:requestId/status",
  auth,
  feasibilityController.addFeasibilityStatusController,
);

// Fetch status history
router.get(
  "/:requestId/status",
  auth,
  feasibilityController.getFeasibilityStatusController,
);

export default router;
