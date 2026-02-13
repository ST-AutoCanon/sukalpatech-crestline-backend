import * as financeService from "../../services/NewProcrument/financeRequests.js";

export const updateFinanceRequest = async (req, res) => {
  try {
     // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const reqId = req.params.id;
    const userData = req.body;

    const result = await financeService.updateFinanceReq(reqId, userData,org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Finance Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApprovedFinanceRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await financeService.getApprovedFinanceRequests(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching approved Finance requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRejectedFinanceRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await financeService.getRejectedFinanceRequests(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching rejected Finance requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPendingFinanceRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await financeService.getPendingFinanceRequests(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching pending Finance requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};