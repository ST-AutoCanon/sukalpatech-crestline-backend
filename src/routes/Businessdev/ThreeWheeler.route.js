// routes/businessdev3/threeWheelerRoutes.js

import express from "express";
import { createThreeWheelerBusiness ,getAllThreeWheelerBusinesses,updateThreeWheelerBusiness,deleteThreeWheelerBusiness} from "../../controllers/businessdev2/ThreeWheeler.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Employee can create
router.post("/create", auth, createThreeWheelerBusiness);

// Create

// Get All
router.get("/list", auth, getAllThreeWheelerBusinesses);

// Update
router.put("/:id", auth, updateThreeWheelerBusiness);

// Delete
router.delete("/:id", auth, deleteThreeWheelerBusiness);

export default router;