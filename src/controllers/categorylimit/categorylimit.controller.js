import {
  updateCategoryLimitService,
  addCategoryLimitService,
 getCategoryLimitService,
  checkApprovalPermission} 
 from "../../services/categorylimit/categorylimit.service.js";
import { apiResponse } from "../../utils/helpers.js";



export const fetchCategoryLimits = async (req, res) => {
  try {
    // ✅ get org_code from authenticated admin
    const org_code = req.user.org_code;

    // ✅ fetch limits from DB
    const limits = await getCategoryLimitService(org_code);

    // ✅ send response
    res.json(apiResponse(true, "Category limits fetched", limits));

  } catch (error) {
    console.error("Error fetching category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const addCategoryLimitsController = async (req, res) => {
  try {
    const org_code = req.user.org_code; // Get org from authenticated admin
    const { high, medium, low } = req.body;

    const addedLimits = await addCategoryLimitService(org_code, { high, medium, low });

    res.status(201).json(apiResponse(true, "Category limits added", addedLimits.data));
  } catch (error) {
    console.error("Error adding category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const updateCategoryLimitsController = async (req, res) => {
  try {
    const org_code = req.user.org_code; // Get org from authenticated admin
    const { high, medium, low } = req.body;

    const updatedLimits = await updateCategoryLimitService(org_code, { high, medium, low });

    res.json(apiResponse(true, "Category limits updated", updatedLimits.data));
  } catch (error) {
    console.error("Error updating category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const approveRequest = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const category = req.user.category;

    const amount = Number(req.body.amount);

    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const result = await checkApprovalPermission(
      category,
      amount,
      org_code
    );

    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: "Approval allowed",
      category,
      limit: result.limit,
    });

  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};
