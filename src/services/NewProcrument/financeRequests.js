import * as financeModel from "../../models/NewProcurement/financeRequests.js";

export const updateFinanceReq = async (reqId, userData, org_code) => {
  try {
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await financeModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses,
        org_code,
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

export const getApprovedFinanceRequests = async (org_code) => {
  try {
    const prs = await financeModel.fetchApprovedFinanceRequests(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching approved Finance requests:", err);
    throw err;
  }
};

export const getRejectedFinanceRequests = async (org_code) => {
  try {
    const prs = await financeModel.fetchRejectedFinanceRequests(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching rejected Finance requests:", err);
    throw err;
  }
};

export const getPendingFinanceRequests = async (org_code) => {
  try {
    const prs = await financeModel.fetchPendingFinanceRequests(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching pending Finance requests:", err);
    throw err;
  }
};