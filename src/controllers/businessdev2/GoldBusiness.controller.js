// controllers/businessdevGold/goldBusinessController.js

import * as GoldBusinessService from "../../services/Businessdev/Goldbusiness.service.js";

/* ---------------- CREATE ---------------- */
export const createGoldBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    const data = await GoldBusinessService.createGoldBusiness(
      org_code,
      payload
    );

    res.status(201).json({
      success: true,
      message: "Gold Business created successfully",
      data,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ---------------- FETCH ALL ---------------- */
export const getAllGoldBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const data = await GoldBusinessService.fetchGoldBusinesses(org_code);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Fetch Gold businesses error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Gold businesses",
    });
  }
};


/* ---------------- UPDATE ---------------- */
export const updateGoldBusiness = async (req, res) => {
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

    const result = await GoldBusinessService.updateGoldBusiness(
      Number(id),
      org_code,
      payload
    );

    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("Update Gold Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ---------------- DELETE ---------------- */
export const deleteGoldBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const org_code = req.user.org_code;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const result = await GoldBusinessService.deleteGoldBusiness(
      Number(id),
      org_code
    );

    return res.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("Delete Gold Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ---------------- FEASIBILITY REVIEW ---------------- */
export const reviewGoldBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await GoldBusinessService.reviewGoldBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Review Gold Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ---------------- FETCH FEASIBILITY REVIEWED ---------------- */
export const getUpdatedGoldBusinessRequests = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const data =
      await GoldBusinessService.fetchGoldFeasibilityReviewed(org_code);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("Fetch Gold feasibility reviewed error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ---------------- FINAL REVIEW ---------------- */
export const reviewFinalGoldBusiness = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const payload = req.body;

    const result = await GoldBusinessService.reviewGoldBusiness(
      org_code,
      payload
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Final Review Gold Business Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};