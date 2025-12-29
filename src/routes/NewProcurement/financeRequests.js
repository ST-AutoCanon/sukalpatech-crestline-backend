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

export default router;
