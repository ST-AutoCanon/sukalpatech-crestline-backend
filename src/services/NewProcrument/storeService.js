import * as storeModel from "../../models/NewProcurement/storeModel.js";

export const updateStoreReq = async (reqId, userData) => {
  try {
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await storeModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses
      );
    }

    return {
      success: true,
      message: "Store Request updated successfully",
    };
  } catch (err) {
    console.error("❌ Error updating Store Request:", err);
    throw err;
  }
};

export const getFinanceApprovedStoreRequests = async () => {
  try {
    const prs = await storeModel.fetchFinanceApprovedStoreRequests();
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Store requests:", err);
    throw err;
  }
};
