import * as feasibilityService from "../../services/NewProcrument/feasibilityRequests.js";

/**
 * Update a Feasibility Request
 */
export const updateFeasibilityRequest = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    
    const reqId = req.params.id;
    const userData = { ...req.body, org_code };

    // Call service to update feasibility request
    const result = await feasibilityService.updateFeasibilityReq(
      reqId,
      userData,
      org_code,
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Feasibility Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getSubmittedPurchaseRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await feasibilityService.getSubmittedPurchaseRequests(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching submitted purchase requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};