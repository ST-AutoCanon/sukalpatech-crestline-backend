import express from "express";
import {
  createVendorController,
  getVendorsController,
  addItemsForVendorController,
} from "../../controllers/vendor/vendor.controller.js";

const router = express.Router();

// ------------------ Vendors ------------------
router.post("/vendor", createVendorController);
router.get("/vendors", getVendorsController);
// Add single or multiple items for a specific vendor
// Example: POST /vendors/123/items
router.post("/vendors/:vendorId/items", addItemsForVendorController);

export default router;
