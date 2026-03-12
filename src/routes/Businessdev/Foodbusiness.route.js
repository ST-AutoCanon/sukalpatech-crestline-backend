// routes/businessdevFood/foodBusinessRoutes.js

import express from "express";
import { createFoodBusiness,getAllFoodBusinesses,updateFoodBusiness,deleteFoodBusiness } from "../../controllers/businessdev2/FoodBusiness.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Employee / Auth users can create
router.post("/create", auth, createFoodBusiness);


// Get All
router.get("/list", auth, getAllFoodBusinesses);

// Update
router.put("/:id", auth, updateFoodBusiness);

// Delete
router.delete("/:id", auth, deleteFoodBusiness);

export default router;