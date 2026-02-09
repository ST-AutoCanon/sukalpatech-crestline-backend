import express from "express";
import { 
  createBD, 
  getAllBD, 
  submitToFeasibility, 
  getPendingFeasibility, 
  feasibilityReview ,
  bdUpdate,
  updateBD
} from "../../controllers/Businessdevelopment/businessDevelopment.js";
import {upload} from "../../config/multer.js";

const router = express.Router();

// BD APIs
router.post("/", upload.array("attachments"), createBD);
router.get("/", getAllBD);
router.patch("/:id/submit", submitToFeasibility);

// Feasibility APIs
router.get("/feasibility/pending", getPendingFeasibility);
router.patch("/feasibility/:id/review", feasibilityReview);
// BD Team Update
router.patch("/:id/bd-update", bdUpdate);
router.patch("/:id", upload.array("attachments"), updateBD);


export default router;
