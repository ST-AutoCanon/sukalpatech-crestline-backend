import * as bdService from "../../services/NewBD/businessDevelopment.js";

export const createBDRequestController = async (req, res) => {
  try {
    const result = await bdService.createBDRequestWithStatus(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating BD request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
