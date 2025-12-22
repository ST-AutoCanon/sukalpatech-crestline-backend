import express from "express";
import {
  createVendorController,
  getVendorsController,
} from "../../controllers/vendor/vendor.controller.js";

const router = express.Router();

// ------------------ Vendors ------------------
router.post("/vendor", createVendorController);
router.get("/vendors", getVendorsController);

export default router;
