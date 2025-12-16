import * as service from "../../services/procurement.service/vendor.service.js";
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
