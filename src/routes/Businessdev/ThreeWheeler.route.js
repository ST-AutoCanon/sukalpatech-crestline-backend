// routes/businessdev3/threeWheelerRoutes.js

import express from "express";
import { createThreeWheelerBusiness ,getAllThreeWheelerBusinesses,updateThreeWheelerBusiness,deleteThreeWheelerBusiness,reviewThreeWheelerBusiness, getUpdatedThreeWheelerRequests,reviewfinalThreeWheelerBusiness} from "../../controllers/businessdev2/ThreeWheeler.controller.js";
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
router.patch("/review", auth,reviewThreeWheelerBusiness);

router.get("/review", auth,getUpdatedThreeWheelerRequests);
router.patch("/review", auth,reviewfinalThreeWheelerBusiness);


export default router;