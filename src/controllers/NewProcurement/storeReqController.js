import * as storeService from "../../services/NewProcrument/storeService.js";

export const updateStoreRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const userData = req.body;

    const result = await storeService.updateStoreReq(reqId, userData);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Store Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFinanceApprovedStoreRequests = async (req, res) => {
  try {
    const result = await storeService.getFinanceApprovedStoreRequests();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching Store requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
