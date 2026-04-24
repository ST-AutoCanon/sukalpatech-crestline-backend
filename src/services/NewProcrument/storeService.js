// import * as storeModel from "../../models/NewProcurement/storeModel.js";

// export const updateStoreReq = async (reqId, userData, org_code) => {
//   try {
//     if (
//       userData.department_statuses &&
//       userData.department_statuses.length > 0
//     ) {
//       await storeModel.updateDepartmentStatuses(
//         reqId,
//         userData.department_statuses,
//         org_code,
//       );
//     }

//     return {
//       success: true,
//       message: "Store Request updated successfully",
//     };
//   } catch (err) {
//     console.error("❌ Error updating Store Request:", err);
//     throw err;
//   }
// };

// export const getFinanceApprovedStoreRequests = async (org_code) => {
//   try {
//     const prs = await storeModel.fetchFinanceApprovedStoreRequests(org_code);
//     console.log("prs:",prs);
//     return { success: true, data: prs };
//   } catch (err) {
//     console.error("❌ Error fetching Store requests:", err);
//     throw err;
//   }
// };



import * as storeModel from "../../models/NewProcurement/storeModel.js";
import * as receivingModel from "../../models/NewProcurement/pr_store_receiving_details.js";

/**
 * Update Store Request including Receiving Details
 */
export const updateStoreReq = async (reqId, userData, org_code) => {
  try {
    // 1️⃣ Update department statuses (existing)
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

    // 2️⃣ Create or Update Store Receiving Details (new)
    if (userData.store_receiving_details) {
      const existingReceiving =
        await receivingModel.getStoreReceivingDetailsByPR(reqId, org_code);

      if (existingReceiving) {
        // Update
        await receivingModel.updateStoreReceivingDetails(
          reqId,
          userData.store_receiving_details,
          org_code,
        );
      } else {
        // Create
        await receivingModel.createStoreReceivingDetails(org_code, {
          purchase_request_id: reqId,
          ...userData.store_receiving_details,
        });
      }
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

/**
 * Fetch Finance Approved Store Requests along with Receiving Details
 */
export const getFinanceApprovedStoreRequests = async (org_code) => {
  try {
    const prs = await storeModel.fetchFinanceApprovedStoreRequests(org_code);

    // For each PR, attach store receiving details
    for (const pr of prs) {
      const receiving = await receivingModel.getStoreReceivingDetailsByPR(
        pr.id,
        org_code,
      );
      pr.store_receiving_details = receiving || null;
    }

    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Store requests:", err);
    throw err;
  }
};

export const getPartialStoreRequests = async (org_code) => {
  try {
    const prs = await storeModel.fetchPartialStoreRequests(org_code);

    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching PARTIAL Store requests:", err);
    throw err;
  }
};