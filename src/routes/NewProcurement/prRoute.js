import express from "express";
import * as prController from "../../controllers/NewProcurement/prController.js";
import { getVendorsController } from "../../controllers/vendor/vendor.controller.js";
import { getAllPRsByStatusController } from "../../controllers/NewProcurement/prController.js";


import { upload } from "../../config/multer.js";

const router = express.Router();

// -------------------------------
// Create Purchase Request (with attachments)
// Use `upload.array('attachments')` for multiple files
// -------------------------------
router.post(
  "/purchase-requests",
  upload.array("attachments"), // 'attachments' = field name in form-data
  prController.createPRController
);
router.get("/vendors", getVendorsController);

// -------------------------------
// Create Purchase Request (JSON only, for testing in Postman)
// -------------------------------
router.post("/purchase-requests/json", prController.createPRControllerJSON);

// GET all PRs
router.get("/purchase-requests", prController.getAllPRsController);

// GET PR by ID
router.get("/purchase-requests/:id", prController.getPRByIdController);

// Update department_statuses only (PR)
router.put(
  "/pr-requests/:id",
  prController.updatePRRequest
);

// GET all PR requests with FINANCE APPROVED status
router.get(
  "/finance-approved-pr-requests",
  prController.getFinanceApprovedPRRequests
);
// GET Rejected PR requests with FINANCE APPROVED status
router.get(
  "/finance-rejected-pr-requests",
  prController.getFinanceRejectedPRRequests
);

// GET Pending PR requests with FINANCE APPROVED status
router.get(
  "/finance-pending-pr-requests",
  prController.getFinancePendingPRRequests
);

// PUT route for full PR update
router.put("/purchase-requests/full/:id", prController.updateFullPRController);

// Get PRs grouped by store status (PR Raised, Pending, Rejected, Completed)
router.get("/prs/status/:status", getAllPRsByStatusController);


export default router;
