import express from "express";
import {
  createVendorController,
  getVendorsController,
  addItemsForVendorController,
  updateVendorController,
  deleteVendorController,
} from "../../controllers/vendor/vendor.controller.js";

const router = express.Router();

// ------------------ Vendors ------------------
router.post("/vendor", createVendorController);
router.get("/vendors", getVendorsController);
router.put("/vendors/:vendor_id", updateVendorController);
router.delete("/vendors/:vendor_id", deleteVendorController);
// Add single or multiple items for a specific vendor
// Example: POST /vendors/123/items
router.post("/vendors/:vendorId/items", addItemsForVendorController);

export default router;
