import express from "express";
import {
  getAllFinancePRsController,
  addFinanceCommentController,
  updateFinanceStatusController,
} from "../../controllers/finance/finance.controller.js";

const router = express.Router();

// Get all PRs for finance
router.get("/prs", getAllFinancePRsController);

// Add a finance comment (ONLY if feasibility approved)
router.post("/pr/comment", addFinanceCommentController);

// Update finance status (ONLY if feasibility approved)
router.post("/pr/status", updateFinanceStatusController);

export default router;
