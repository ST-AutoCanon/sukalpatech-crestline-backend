import express from "express";
import * as feasibilityController from "../../controllers/NewProcurement/feasibilityReqController.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// ---------------- PROTECTED ROUTES ----------------

// Update a feasibility request (user updates dept_status, vendor status, comments)
router.put(
  "/feasibility-requests/:id",
  auth, // ✅ Add auth
  feasibilityController.updateFeasibilityRequest,
);

// GET all submitted purchase requests
router.get(
  "/submitted-requests",
  auth, // ✅ Add auth
  feasibilityController.getSubmittedPurchaseRequests,
);

// Update full feasibility request
router.put(
  "/feasibility-requests/:id/full",
  auth, // ✅ Add auth
  feasibilityController.updateFullFeasibilityRequest,
);

export default router;
