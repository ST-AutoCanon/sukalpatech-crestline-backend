// routes/businessdev2/twoWheelerRoutes.js

import express from "express";
import {
  createTwoWheelerBusiness,
  deleteTwoWheelerBusiness,
  getAllTwoWheelerBusinesses,
  updateTwoWheelerBusiness,
  reviewTwoWheelerBusiness,getUpdatedTwoWheelerRequests,reviewfinalTwoWheelerBusiness
} from "../../controllers/businessdev2/TwoWheeler.controller.js";

import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Create
router.post("/create", auth, createTwoWheelerBusiness);

// Get All
router.get("/list", auth, getAllTwoWheelerBusinesses);

// Update
router.put("/:id", auth, updateTwoWheelerBusiness);

// Delete
router.delete("/:id", auth, deleteTwoWheelerBusiness);
router.patch("/review", auth,reviewTwoWheelerBusiness);
router.get("/review", auth,getUpdatedTwoWheelerRequests);
router.patch("/review", auth,reviewfinalTwoWheelerBusiness);


export default router;