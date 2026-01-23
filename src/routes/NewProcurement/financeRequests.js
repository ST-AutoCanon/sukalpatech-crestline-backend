import express from "express";
import * as financeController from "../../controllers/NewProcurement/financeReqController.js";

const router = express.Router();

// Update department_statuses only
router.put("/finance-requests/:id", financeController.updateFinanceRequest);

// GET all submitted finance requests
router.get(
  "/approved-finance-requests",
  financeController.getApprovedFinanceRequests
);
// GET all rejected finance requests
router.get(
  "/rejected-finance-requests",
  financeController.getRejectedFinanceRequests
);

// GET all Pending finance requests
router.get(
  "/pending-finance-requests",
  financeController.getPendingFinanceRequests
);

export default router;
