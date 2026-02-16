
import * as feasibilityService from "../../services/NewBD/feasibility.js";

// Add a new status
export const addFeasibilityStatusController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { requestId } = req.params;
    const data = req.body; // { status, comment, updated_by }
    const result = await feasibilityService.updateFeasibilityStatus(
      requestId,
      data,
      org_code
    );
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding feasibility status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all statuses
export const getFeasibilityStatusController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { requestId } = req.params;
    const result =
      await feasibilityService.getFeasibilityStatusHistory(requestId,org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching feasibility statuses:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
