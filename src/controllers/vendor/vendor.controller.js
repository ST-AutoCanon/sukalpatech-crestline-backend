import * as service from "../../services/vendor/vendor.service.js";
import { apiResponse } from "../../utils/helpers.js";

export const createVendorController = async (req, res) => {
  try {
    const result = await service.createVendorService(req.body);
    res.json(apiResponse(result.success, "Vendor created", result.data));
  } catch (error) {
    console.log("Error creating vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const getVendorsController = async (req, res) => {
  try {
    const result = await service.getVendorsService();
    res.json(apiResponse(result.success, "Vendors fetched", result.data));
  } catch (error) {
    console.log("Error fetching vendors:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

/**
 * Add single or multiple items for a specific vendor
 */
export const addItemsForVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params; // vendorId from URL param
    const items = req.body.items; // array or single item object from request body

    if (!vendorId) {
      return res.status(400).json(apiResponse(false, "Vendor ID is required", null));
    }

    if (!items || (Array.isArray(items) && !items.length)) {
      return res.status(400).json(apiResponse(false, "No items provided", null));
    }

    const result = await service.addItemsForVendorService(Number(vendorId), items);

    if (!result.success) {
      return res.status(500).json(apiResponse(false, result.message, null));
    }

    res.json(apiResponse(true, "Items added for vendor", result.data));
  } catch (error) {
    console.log("Error adding items for vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};