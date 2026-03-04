import express from "express";
import * as financeController from "../../controllers/NewProcurement/financeReqController.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware
import { upload } from "../../config/multer.js";
const router = express.Router();

// ---------------- PROTECTED ROUTES ----------------

// Update department_statuses only
// router.put(
//   "/finance-requests/:id",
//   auth, // ✅ Add auth
//   financeController.updateFinanceRequest,
// );

router.put(
  "/finance-requests/:id",
  auth,
  upload.single("payment_proof"), // 👈 must match frontend field name
  financeController.updateFinanceRequest,
);

// GET all submitted/approved finance requests
router.get(
  "/approved-finance-requests",
  auth, // ✅ Add auth
  financeController.getApprovedFinanceRequests,
);

// GET all rejected finance requests
router.get(
  "/rejected-finance-requests",
  auth, // ✅ Add auth
  financeController.getRejectedFinanceRequests,
);

// GET all pending finance requests
router.get(
  "/pending-finance-requests",
  auth, // ✅ Add auth
  financeController.getPendingFinanceRequests,
);

export default router;
