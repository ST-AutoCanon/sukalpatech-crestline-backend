import express from "express";

import {
  approveRequest,
  fetchCategoryLimits,
  addCategoryLimitsController,
  updateCategoryLimitsController
} from "../../controllers/categorylimit/categorylimit.controller.js";

import { auth } from "../../middleware/auth.js";

const router = express.Router();


router.get("/category-limits", auth, fetchCategoryLimits);

// Add new category limits
router.post("/category-limits/add", auth, addCategoryLimitsController);

// Update existing category limits
router.put("/category-limits/update", auth, updateCategoryLimitsController);

/* ================= APPROVAL ROUTE ================= */
router.post("/approve", auth, approveRequest);

export default router;