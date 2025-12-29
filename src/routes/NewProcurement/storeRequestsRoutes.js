import express from "express";
import * as storeController from "../../controllers/NewProcurement/storeReqController.js";

const router = express.Router();

// Update department_statuses only
router.put("/store-requests/:id", storeController.updateStoreRequest);

// GET all Store requests with FINANCE APPROVED status
router.get(
  "/finance-approved-store-requests",
  storeController.getFinanceApprovedStoreRequests
);

export default router;
