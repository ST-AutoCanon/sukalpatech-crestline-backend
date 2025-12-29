import * as financeModel from "../../models/NewProcurement/financeRequests.js";

export const updateFinanceReq = async (reqId, userData) => {
  try {
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await financeModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses
      );
    }

    return {
      success: true,
      message: "Finance Request updated successfully",
    };
  } catch (err) {
    console.error("❌ Error updating Finance Request:", err);
    throw err;
  }
};

export const getApprovedFinanceRequests = async () => {
  try {
    const prs = await financeModel.fetchApprovedFinanceRequests();
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching approved Finance requests:", err);
    throw err;
  }
};

