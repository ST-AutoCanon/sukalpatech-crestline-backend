import * as storeModel from "../../models/NewProcurement/storeModel.js";

export const updateStoreReq = async (reqId, userData, org_code) => {
  try {
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await storeModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses,
        org_code,
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

export const getFinanceApprovedStoreRequests = async (org_code) => {
  try {
    const prs = await storeModel.fetchFinanceApprovedStoreRequests(org_code);
    console.log("prs:",prs);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Store requests:", err);
    throw err;
  }
};
