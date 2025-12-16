import * as service from "../../services/procurement.service/prItems.service.js";
import { apiResponse } from "../../utils/helpers.js";

// Add a PR item
export const addPRItemController = async (req, res) => {
  try {
    const result = await service.addPRItemService(req.body);
    res.json(apiResponse(result.success, "PR Item added", result.data));
  } catch (error) {
    console.error("Error adding PR Item:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

// Get all items for a specific PR
export const getPRItemsController = async (req, res) => {
  try {
    const { pr_id } = req.params;
    const result = await service.getPRItemsService(pr_id);
    res.json(apiResponse(result.success, "PR Items fetched", result.data));
  } catch (error) {
    console.error("Error fetching PR Items:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
