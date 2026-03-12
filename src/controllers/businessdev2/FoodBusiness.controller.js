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

export const getAllFoodBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code; // get from JWT

    const data = await FoodBusinessService.fetchFoodBusinesses(org_code);

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Fetch 2W businesses error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch 2W businesses"
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
      Number(id),
      org_code,
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