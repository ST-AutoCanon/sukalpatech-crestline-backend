import * as storeService from "../../services/NewProcrument/storeService.js";

export const updateStoreRequest = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const reqId = req.params.id;
    const userData = req.body;

    const result = await storeService.updateStoreReq(reqId, userData,org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Store Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFinanceApprovedStoreRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await storeService.getFinanceApprovedStoreRequests(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching Store requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
