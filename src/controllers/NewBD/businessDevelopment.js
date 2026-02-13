import * as bdService from "../../services/NewBD/businessDevelopment.js";

export const createBDRequestController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await bdService.createBDRequestWithStatus(req.body,org_code);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating BD request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
