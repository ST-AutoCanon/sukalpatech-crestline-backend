import express from "express";
import * as financeController from "../../controllers/NewProcurement/financeReqController.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Update department_statuses only
router.put(
  "/finance-requests/:id",
  auth,
  financeController.updateFinanceRequest,
);

// GET all submitted finance requests
router.get(
  "/approved-finance-requests",
  auth,
  financeController.getApprovedFinanceRequests,
);
// GET all rejected finance requests
router.get(
  "/rejected-finance-requests",
  auth,
  financeController.getRejectedFinanceRequests,
);

// GET all Pending finance requests
router.get(
  "/pending-finance-requests",
  auth,
  financeController.getPendingFinanceRequests,
);

export default router;
