import * as service from "../../services/vendor/vendor.service.js";
import { apiResponse } from "../../utils/helpers.js";

export const createVendorController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    const result = await service.createVendorService(req.body, org_code);
    res.json(apiResponse(result.success, "Vendor created", result.data));
  } catch (error) {
    console.log("Error creating vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const getVendorsController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    
    const result = await service.getVendorsService(org_code);
    res.json(apiResponse(result.success, "Vendors fetched", result.data));
  } catch (error) {
    console.log("Error fetching vendors:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const updateVendorController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    const { vendor_id } = req.params;
    const result = await service.updateVendorService(vendor_id,req.body, org_code);

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message, null));
    }

    res.json(apiResponse(true, "Vendor updated successfully", result.data));
  } catch (error) {
    console.log("Error updating vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};


export const deleteVendorController = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const org_code = req.user.org_code;
    const result = await service.deleteVendorService(vendor_id, org_code);

    if (!result.success) {
      return res.status(404).json(apiResponse(false, result.message, null));
    }

    res.json(apiResponse(true, "Vendor deleted successfully", null));
  } catch (error) {
    console.log("Error deleting vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};


/**
 * Add single or multiple items for a specific vendor
 */
export const addItemsForVendorController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    
    const { vendorId } = req.params; // vendorId from URL param
    const items = req.body.items; // array or single item object from request body

    if (!vendorId) {
      return res
        .status(400)
        .json(apiResponse(false, "Vendor ID is required", null));
    }

    if (!items || (Array.isArray(items) && !items.length)) {
      return res
        .status(400)
        .json(apiResponse(false, "No items provided", null));
    }

    const result = await service.addItemsForVendorService(
      Number(vendorId),
      items,
      org_code
    );

    if (!result.success) {
      return res.status(500).json(apiResponse(false, result.message, null));
    }

    res.json(apiResponse(true, "Items added for vendor", result.data));
  } catch (error) {
    console.log("Error adding items for vendor:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};