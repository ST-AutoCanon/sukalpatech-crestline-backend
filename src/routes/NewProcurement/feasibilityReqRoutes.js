import express from "express";
import * as feasibilityController from "../../controllers/NewProcurement/feasibilityReqController.js";

const router = express.Router();

// Update a feasibility request (user updates dept_status, vendor status, comments)
router.put(
  "/feasibility-requests/:id",
  feasibilityController.updateFeasibilityRequest
);

// GET all submitted purchase requests
router.get(
  "/submitted-requests",
  feasibilityController.getSubmittedPurchaseRequests
);
router.put(
  "/feasibility-requests/:id",
  feasibilityController.updateFullFeasibilityRequest
);



export default router;
