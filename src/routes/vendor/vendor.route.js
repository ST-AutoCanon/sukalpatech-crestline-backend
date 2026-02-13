import express from "express";
import {
  createVendorController,
  getVendorsController,
  addItemsForVendorController,
  updateVendorController,
  deleteVendorController,
} from "../../controllers/vendor/vendor.controller.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// ------------------ Vendors ------------------
router.post("/vendor", auth, createVendorController);
router.get("/vendors", auth, getVendorsController);
router.put("/vendors/:vendor_id", auth, updateVendorController);
router.delete("/vendors/:vendor_id", auth, deleteVendorController);
// Add single or multiple items for a specific vendor
// Example: POST /vendors/123/items
router.post("/vendors/:vendorId/items", auth, addItemsForVendorController);

export default router;
