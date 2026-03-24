// controllers/businessdev2/TwoWheeler.controller.js

import * as ThreeWheelerService from "../../services/Businessdev/ThreeWheeler.service.js";

export const createThreeWheelerBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT

    const payload = req.body;

    const data = await ThreeWheelerService.createThreeWheelerBusiness(
      org_code,
      payload
    );

    res.status(201).json({
      success: true,
      message: "3W Business created successfully",
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllThreeWheelerBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code; // get from JWT

    const data = await ThreeWheelerService.fetchThreeWheelerBusinesses(org_code);

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
export const updateThreeWheelerBusiness = async (req, res) => {
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

    const result = await ThreeWheelerService.updateThreeWheelerBusiness(
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

export const deleteThreeWheelerBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const org_code = req.user.org_code;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const result = await ThreeWheelerService.deleteThreeWheelerBusiness(
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

export const reviewThreeWheelerBusiness = async (req, res) => {
  try {

    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await ThreeWheelerService.reviewThreeWheelerBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {

    console.error("Review 3W Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* ---------------- Get 2W Feasibility Reviewed Requests ---------------- */
export const getUpdatedThreeWheelerRequests = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT

    const data = await ThreeWheelerService.fetchThreeWheelerFeasibilityReviewed(org_code);

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Fetch 3W feasibility reviewed requests error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const reviewfinalThreeWheelerBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    // payload should now include final_status & final_comment
    const result = await ThreeWheelerService.reviewThreeWheelerBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Review 3W Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

