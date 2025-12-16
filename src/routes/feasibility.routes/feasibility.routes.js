import express from "express";
import {
  getAllFeasibilityPRsController,
  addFeasibilityCommentController,
  updateFeasibilityStatusController,
} from "../../controllers/feasibility.controllers/feasibility.controller.js";

const router = express.Router();

// Get all PRs for feasibility
router.get("/prs", getAllFeasibilityPRsController);

// Add a feasibility comment
router.post("/pr/comment", addFeasibilityCommentController);

// Update feasibility status
router.post("/pr/status", updateFeasibilityStatusController);

export default router;
