import express from "express";
import * as storeController from "../../controllers/NewProcurement/storeReqController.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Update department_statuses only
router.put("/store-requests/:id", auth, storeController.updateStoreRequest);

// GET all Store requests with FINANCE APPROVED status
router.get(
  "/finance-approved-store-requests",
  auth,
  storeController.getFinanceApprovedStoreRequests
);

export default router;
