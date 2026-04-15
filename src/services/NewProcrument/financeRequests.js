import * as financeModel from "../../models/NewProcurement/financeRequests.js";
import * as financePaymentModel from "../../models/NewProcurement/financePaymentModel.js";

// export const updateFinanceReq = async (reqId, userData, org_code) => {
//   try {
//     if (
//       userData.department_statuses &&
//       userData.department_statuses.length > 0
//     ) {
//       await financeModel.updateDepartmentStatuses(
//         reqId,
//         userData.department_statuses,
//         org_code,
//       );
//     }

//     return {
//       success: true,
//       message: "Finance Request updated successfully",
//     };
//   } catch (err) {
//     console.error("❌ Error updating Finance Request:", err);
//     throw err;
//   }
// };


export const updateFinanceReq = async (reqId, userData, org_code) => {
  try {
    // ✅ 1. Update Department Status (if exists)
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

    // ✅ 2. Update Finance Payment Details (if payment data sent)
    if (userData.payment_stage) {
      await financePaymentModel.updateFinancePaymentDetails(
        reqId,
        {
          payment_stage: userData.payment_stage,
          partial_percentage: userData.partial_percentage,
          final_completed: userData.final_completed,
          payment_proof_file_name: userData.payment_proof_file_name,
          payment_proof_file_path: userData.payment_proof_file_path,
          finance_comment: userData.finance_comment,
          payment_updated_by: userData.payment_updated_by,
        },
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
export const getPartialPaymentFinanceRequests = async (org_code) => {
  try {
    const prs = await financeModel.fetchPartialPaymentFinanceRequests(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching partial payment PRs:", err);
    throw err;
  }
};
export const getFinanceRequestById = async (id, org_code) => {
  try {
    const pr = await financeModel.getFinanceRequestById(id, org_code);

    return {
      success: true,
      data: pr,
    };
  } catch (err) {
    console.error("❌ Error fetching PR by ID:", err);
    throw err;
  }
};