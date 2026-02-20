import express from "express";
import {
  getAllFeasibilityRequests,
  updateFeasibilityStatus,
} from "../controllers/feasibility.controller.js";

const router = express.Router();

/**
 * GET all feasibility requests
 */
router.get("/", getAllFeasibilityRequests);

/**
 * UPDATE feasibility status
 */
router.put("/:id", updateFeasibilityStatus);

export default router;