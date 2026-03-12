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

export const getAllTwoWheelerBusinesses = async (req, res) => {
  try {
    const org_code = req.user.org_code; // get from JWT

    const data = await TwoWheelerService.fetchTwoWheelerBusinesses(org_code);

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