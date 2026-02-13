import express from "express";
import * as prController from "../../controllers/NewProcurement/prController.js";
import { getVendorsController } from "../../controllers/vendor/vendor.controller.js";
import { upload } from "../../config/multer.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();

// -------------------------------
// Create Purchase Request (with attachments)
// Use `upload.array('attachments')` for multiple files
// -------------------------------
router.post(
  "/purchase-requests",
  upload.array("attachments"), // 'attachments' = field name in form-data
  auth,
  prController.createPRController,
);
router.get("/vendors", auth, getVendorsController);

// -------------------------------
// Create Purchase Request (JSON only, for testing in Postman)
// -------------------------------
router.post(
  "/purchase-requests/json",
  auth,
  prController.createPRControllerJSON,
);

// GET all PRs
router.get(
  "/purchase-requests",
  auth,
  prController.getAllPRsController,
);

// GET PR by ID
router.get("/purchase-requests/:id", auth, prController.getPRByIdController);

// Update department_statuses only (PR)
router.put(
  "/pr-requests/:id",
  auth,
  prController.updatePRRequest
);

// GET all PR requests with FINANCE APPROVED status
router.get(
  "/finance-approved-pr-requests",
  auth,
  prController.getFinanceApprovedPRRequests,
);
// GET Rejected PR requests with FINANCE APPROVED status
router.get(
  "/finance-rejected-pr-requests",
  auth,
  prController.getFinanceRejectedPRRequests,
);

// GET Pending PR requests with FINANCE APPROVED status
router.get(
  "/finance-pending-pr-requests",
  auth,
  prController.getFinancePendingPRRequests,
);

export default router;
