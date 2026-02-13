import express from "express";
import {
  getAllFinancePRsController,
  addFinanceCommentController,
  updateFinanceStatusController,
} from "../../controllers/finance/finance.controller.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Get all PRs for finance
router.get("/prs", auth, getAllFinancePRsController);

// Add a finance comment (ONLY if feasibility approved)
router.post("/pr/comment", auth, addFinanceCommentController);

// Update finance status (ONLY if feasibility approved)
router.post("/pr/status", auth, updateFinanceStatusController);

export default router;
