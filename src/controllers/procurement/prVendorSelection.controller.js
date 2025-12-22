// src/controllers/prVendorSelection.controller.js
import * as prVendorService from "../../services/procurement/prVendorSelection.service.js";

// Add multiple vendors to a PR
export const addPRVendors = async (req, res) => {
  const { pr_id, vendor_ids } = req.body;

  if (!pr_id || !Array.isArray(vendor_ids) || vendor_ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "PR ID and vendor IDs are required",
    });
  }

  try {
    const result = await prVendorService.addPRVendorsService(pr_id, vendor_ids);
    return res.json({
      success: true,
      message: "Vendors added",
      data: result.data,
    });
  } catch (error) {
    console.error("Add PR Vendors error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get vendors for a PR
export const getPRVendors = async (req, res) => {
  const { pr_id } = req.params;

  try {
    const result = await prVendorService.getPRVendorsService(pr_id);
    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Get PR Vendors error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
