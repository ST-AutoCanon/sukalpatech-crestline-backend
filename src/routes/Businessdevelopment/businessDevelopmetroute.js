import express from "express";
import {
  createBD,
  getAllBD,
  submitToFeasibility,
  getPendingFeasibility,
  feasibilityReview,
  bdUpdate,
  updateBD,
} from "../../controllers/Businessdevelopment/businessDevelopment.js";
import { upload } from "../../config/multer.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// -------------------------------
// Business Development APIs
// -------------------------------
router.post("/", auth, upload.array("attachments"), createBD);
router.get("/", auth, getAllBD);
router.patch("/:id/submit", auth, submitToFeasibility);

// -------------------------------
// Feasibility APIs
// -------------------------------
router.get("/feasibility/pending", auth, getPendingFeasibility);
router.patch("/feasibility/:id/review", auth, feasibilityReview);

// -------------------------------
// BD Team Update
// -------------------------------
router.patch("/:id/bd-update", auth, bdUpdate);
router.patch("/:id", auth, upload.array("attachments"), updateBD);

export default router;
