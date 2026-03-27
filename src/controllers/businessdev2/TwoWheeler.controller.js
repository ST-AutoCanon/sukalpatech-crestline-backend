// controllers/businessdev2/TwoWheeler.controller.js

import * as TwoWheelerService from "../../services/Businessdev/TwoWheeler.service.js";

export const createTwoWheelerBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT

    const payload = req.body;

    const data = await TwoWheelerService.createTwoWheelerBusiness(
      org_code,
      payload
    );

    res.status(201).json({
      success: true,
      message: "2W Business created successfully",
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- FETCH ALL WITH STATUS FILTER ---------------- */
export const getAllTwoWheelerBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const status = req.query.status; // "ALL", "PENDING", "REJECTED", "COMPLETED"

    const data = await TwoWheelerService.fetchTwoWheelerBusinesses(org_code, status);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Fetch 2W businesses error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch 2W businesses"
    });
  }
};

export const updateTwoWheelerBusiness = async (req, res) => {
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

    const result = await TwoWheelerService.updateTwoWheelerBusiness(
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

export const deleteTwoWheelerBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const org_code = req.user.org_code;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const result = await TwoWheelerService.deleteTwoWheelerBusiness(
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

export const reviewTwoWheelerBusiness = async (req, res) => {
  try {

    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await TwoWheelerService.reviewTwoWheelerBusiness(
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
export const getUpdatedTwoWheelerRequests = async (req, res) => {
  try {
    const org_code = req.user.org_code; // from JWT

    const data = await TwoWheelerService.fetchTwoWheelerFeasibilityReviewed(org_code);

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Fetch 2W feasibility reviewed requests error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const reviewfinalTwoWheelerBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    // payload should now include final_status & final_comment
    const result = await TwoWheelerService.reviewfinalTwoWheelerBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Review 2W Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};