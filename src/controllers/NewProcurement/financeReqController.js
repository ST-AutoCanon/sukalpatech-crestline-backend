import * as financeService from "../../services/NewProcrument/financeRequests.js";

export const updateFinanceRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const userData = req.body;

    const result = await financeService.updateFinanceReq(reqId, userData);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Finance Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApprovedFinanceRequests = async (req, res) => {
  try {
    const result = await financeService.getApprovedFinanceRequests();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching approved Finance requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

