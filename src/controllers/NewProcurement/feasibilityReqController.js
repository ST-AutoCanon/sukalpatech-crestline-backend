import * as feasibilityService from "../../services/NewProcrument/feasibilityRequests.js";

/**
 * Update a Feasibility Request
 */
export const updateFeasibilityRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const userData = req.body;

    // Call service to update feasibility request
    const result = await feasibilityService.updateFeasibilityReq(
      reqId,
      userData
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Feasibility Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getSubmittedPurchaseRequests = async (req, res) => {
  try {
    const result = await feasibilityService.getSubmittedPurchaseRequests();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching submitted purchase requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFullFeasibilityRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const userData = req.body;

    // Call service to update feasibility request
    const result = await feasibilityService.updateFeasibilityReq(
      reqId,
      userData
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Feasibility Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
