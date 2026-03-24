// routes/businessdevGold/goldBusinessRoutes.js

import express from "express";
import {
  createGoldBusiness,
  deleteGoldBusiness,
  getAllGoldBusinesses,
  updateGoldBusiness,
  reviewGoldBusiness,
  getUpdatedGoldBusinessRequests,
  reviewFinalGoldBusiness
} from "../../controllers/businessdev2/GoldBusiness.controller.js";

import { auth } from "../../middleware/auth.js";

const router = express.Router();

/* ---------------- CREATE ---------------- */
router.post("/create", auth, createGoldBusiness);

/* ---------------- GET ALL ---------------- */
router.get("/list", auth, getAllGoldBusinesses);

/* ---------------- UPDATE ---------------- */
router.put("/:id", auth, updateGoldBusiness);

/* ---------------- DELETE ---------------- */
router.delete("/:id", auth, deleteGoldBusiness);

/* ---------------- FEASIBILITY REVIEW ---------------- */
router.patch("/review", auth, reviewGoldBusiness);

/* ---------------- FETCH REVIEWED ---------------- */
router.get("/review", auth, getUpdatedGoldBusinessRequests);

/* ---------------- FINAL REVIEW ---------------- */
router.patch("/final-review", auth, reviewFinalGoldBusiness);

export default router;