import express from "express";
import * as prController from "../../controllers/NewProcurement/prController.js";
import { getVendorsController } from "../../controllers/vendor/vendor.controller.js";
import { getAllPRsByStatusController } from "../../controllers/NewProcurement/prController.js";
import { upload } from "../../config/multer.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// -------------------------------
// CREATE Purchase Request (with attachments)
// -------------------------------
router.post(
  "/purchase-requests",
  auth, // ✅ Protect route
  upload.array("attachments"), // 'attachments' = field name in form-data
  prController.createPRController,
);
router.post(
  "/vendors/:vendorId/attachments",
  auth,
  upload.single("file"),
  prController.uploadVendorAttachmentController
);


// CREATE Purchase Request (JSON only, for testing)
router.post(
  "/purchase-requests/json",
  auth, // ✅ Protect route
  prController.createPRControllerJSON,
);

// GET all PRs
router.get("/purchase-requests", auth, prController.getAllPRsController);

// GET PR by ID
router.get("/purchase-requests/:id", auth, prController.getPRByIdController);

// UPDATE department_statuses only (PR)
router.put("/pr-requests/:id", auth, prController.updatePRRequest);

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

// PUT route for full PR update
router.put(
  "/purchase-requests/full/:id",
  auth,
  prController.updateFullPRController,
);

// Get PRs grouped by store status (PR Raised, Pending, Rejected, Completed)
router.get("/prs/status/:status", auth, getAllPRsByStatusController);

// GET vendors (optional: protect this if vendors are user-specific)
router.get("/vendors", auth, getVendorsController);

export default router;
