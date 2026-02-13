import express from "express";
import * as feasibilityController from "../../controllers/NewProcurement/feasibilityReqController.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Update a feasibility request (user updates dept_status, vendor status, comments)
router.put(
  "/feasibility-requests/:id",
  auth,
  feasibilityController.updateFeasibilityRequest,
);

// GET all submitted purchase requests
router.get(
  "/submitted-requests",
  auth,
  feasibilityController.getSubmittedPurchaseRequests,
);


export default router;
