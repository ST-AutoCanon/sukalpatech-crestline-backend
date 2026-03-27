// controllers/businessdevFood/foodBusinessController.js
import * as FoodBusinessService from "../../services/Businessdev/Foodbusiness.service.js";

export const createFoodBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT

    const payload = req.body;

    const data = await FoodBusinessService.createFoodBusiness(
      org_code,
      payload
    );

    res.status(201).json({
      success: true,
      message: "Food Business created successfully",
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- FETCH ALL WITH STATUS FILTER ---------------- */
// controllers/businessdev2/FoodBusiness.controller.js

export const getAllFoodBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT
    const status = req.query.status; // "ALL", "PENDING", "REJECTED", "COMPLETED"

    const data = await FoodBusinessService.fetchFoodBusinesses(org_code, status);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Fetch Food Businesses Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch food businesses"
    });
  }
};
export const updateFoodBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const org_code = req.user.org_code;
    const payload = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const result = await FoodBusinessService.updateFoodBusiness(
      org_code,
      Number(id),
      payload
    );

    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("Update 2W Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteFoodBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const org_code = req.user.org_code;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const result = await FoodBusinessService.deleteFoodBusiness(
      Number(id),
      org_code
    );

    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("Delete 2W Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const reviewFoodBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await FoodBusinessService.reviewFoodBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Review Food Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getUpdatedFoodBusinessRequests = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const data = await FoodBusinessService.fetchFoodFeasibilityReviewed(
      org_code
    );

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Fetch Food feasibility reviewed error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const reviewFinalFoodBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await FoodBusinessService.reviewfinalFoodBusiness( // ✅ correct
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Final Review Food Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};