import * as purchaseRequestModel from "../../models/NewProcurement/purchaseRequests.js";
import * as purchaseItemModel from "../../models/NewProcurement/purchaseItems.js";
import * as itemVendorModel from "../../models/NewProcurement/itemVendors.js";
import * as vendorAttachmentModel from "../../models/NewProcurement/vendorAttachments.js";
import * as vendorCommentModel from "../../models/NewProcurement/vendorComments.js";
import * as prOrderDetailsModel from "../../models/NewProcurement/prOrderDetails.js";
import fs from "fs";
import path from "path";

// -------------------------------
// Create New Purchase Request
// -------------------------------

export const createNewPR = async (org_code, prData) => {
  try {
    // 0️⃣ Add default department update to the correct property
    prData.department_statuses = [
      {
        department_status: "CREATED", // default status
        department_comment: "Initial review", // default comment
        status_updated_by: prData.requested_by, // user ID from request
        updated_at: new Date().toISOString(), // current timestamp
      },
    ];

    // 1️⃣ Create PR
    const prId = await purchaseRequestModel.createPurchaseRequest(
      org_code,
      prData,
    );

    // 2️⃣ Create Items
    for (const item of prData.items) {
      const itemId = await purchaseItemModel.createPurchaseItem(
        item,
        prId,
        org_code,
      );

      // 3️⃣ Create Vendors
      if (item.vendors) {
        for (const vendor of item.vendors) {
          const vendorId = await itemVendorModel.createItemVendor(
            vendor,
            itemId,
            org_code,
          );

          // 4️⃣ Attachments
          if (vendor.attachments) {
            for (const att of vendor.attachments) {
              // Only store the filename (remove folder path)
              att.file_path = att.file_path.replace(/^.*[\\\/]/, "");
              await vendorAttachmentModel.createVendorAttachment(
                att,
                vendorId,
                org_code,
              );
            }
          }

          // 5️⃣ Comments
          if (vendor.comments) {
            for (const com of vendor.comments) {
              await vendorCommentModel.createVendorComment(
                com,
                vendorId,
                1, // Assuming department_id = 1 for initial comment
                org_code,
              );
            }
          }
        }
      }
    }

    return { success: true, prId };
  } catch (err) {
    console.error("❌ Error creating PR:", err);
    throw err;
  }
};

export const getAllPRs = async (org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchAllPRs(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching all PRs:", err);
    throw err;
  }
};

export const getPRById = async (prId, org_code) => {
  try {
    const pr = await purchaseRequestModel.fetchPRById(prId, org_code);
    if (!pr) return { success: false, message: "PR not found" };
    return { success: true, data: pr };
  } catch (err) {
    console.error("❌ Error fetching PR by ID:", err);
    throw err;
  }
};

/**
 * Update PR (ONLY department status & comments)
 * No vendor logic here
 */
// export const updatePRRequest = async (reqId, userData, org_code) => {
//   try {
//     if (
//       userData.department_statuses &&
//       userData.department_statuses.length > 0
//     ) {
//       await purchaseRequestModel.updateDepartmentStatuses(
//         reqId,
//         userData.department_statuses,
//         org_code,
//       );
//     }

//     return {
//       success: true,
//       message: "Purchase Request updated successfully",
//     };
//   } catch (err) {
//     console.error("❌ Error updating Purchase Request:", err);
//     throw err;
//   }
// };


/**
 * Update PR (ONLY department status & comments)
 * along with status and comment also update the order details if the order status is PLACED
 * No vendor logic here
 */
export const updatePRRequest = async (reqId, userData, org_code) => {
  try {

    // 1️⃣ Update Department Status (existing logic)
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await purchaseRequestModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses,
        org_code,
      );
    }

    // 2️⃣ Update Order Details (NEW LOGIC)
    if (userData.order_details) {
      const existingOrder = await prOrderDetailsModel.getOrderDetailsByPR(
        reqId,
        org_code,
      );

      if (existingOrder) {
        await prOrderDetailsModel.updateOrderDetails(
          reqId,
          userData.order_details,
          org_code,
        );
      } else {
        await prOrderDetailsModel.createOrderDetails(org_code, {
          ...userData.order_details,
          purchase_request_id: reqId,
        });
      }
    }

    return {
      success: true,
      message: "Purchase Request updated successfully",
    };
  } catch (err) {
    console.error("❌ Error updating Purchase Request:", err);
    throw err;
  }
};

/**
 * Fetch ONLY PRs whose LATEST status = FINANCE APPROVED
 * (For Finance / Procurement view)
 */
export const getFinanceApprovedPRs = async (org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchFinanceApprovedPRs(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Finance Approved PRs:", err);
    throw err;
  }
};

/**
 * Fetch ONLY PRs whose LATEST status = FINANCE REJECTED
 * (For Finance / Procurement view)
 */
export const getFinanceRejectedPRs = async (org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchFinanceRejectedPRs(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Finance Rejected PRs:", err);
    throw err;
  }
};

/**
 * Fetch ONLY PRs whose LATEST status = FINANCE PENDING
 * (For Finance / Procurement view)
 */
export const getFinancePendingPRs = async (org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchFinancePendingPRs(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Finance Pending PRs:", err);
    throw err;
  }
};

export const updateFullPR = async (prId, prData, org_code) => {
  try {
    await purchaseRequestModel.updateFullPR(prId, prData, org_code);
    return { success: true, message: "PR updated successfully" };
  } catch (err) {
    console.error("❌ Error updating full PR:", err);
    console.log("Required Date Received:", prData.required_date);
    throw err;
  }
};

export const getAllPRsByStatus = async (status, org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchPRsByStatus(status, org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching PRs by status:", err);
    return { success: false, error: "Failed to fetch PRs" };
  }
};

// export const addVendorAttachment = async (

//   vendorId,
//   attachmentData,
//   org_code
// ) => {
//   try {
//     // Remove folder path, store only filename
//     attachmentData.file_path = attachmentData.file_path.replace(/^.*[\\\/]/, "");

//     const result = await vendorAttachmentModel.createVendorAttachment(
//       attachmentData,
//       vendorId,
//       org_code
//     );

//     return result;
//   } catch (err) {
//     console.error("❌ Error adding vendor attachment:", err);
//     throw err;
//   }
// };

export const addVendorAttachment = async (
  vendorId,
  attachmentData,
  org_code,
) => {
  try {
    const deletedAttachments =
      await vendorAttachmentModel.deleteAttachmentsByVendor(vendorId, org_code);

    if (deletedAttachments?.length > 0) {
      for (const att of deletedAttachments) {
        if (!att.file_path) continue;

        const filePath = path.join(
          process.cwd(),
          "uploads",
          "attachments",
          att.file_path,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    attachmentData.file_path = attachmentData.file_path.replace(
      /^.*[\\\/]/,
      "",
    );

    const newAttachment = await vendorAttachmentModel.createVendorAttachment(
      attachmentData,
      vendorId,
      org_code,
    );

    return {
      success: true,
      message: "Attachment replaced successfully",
      data: newAttachment,
    };
  } catch (err) {
    console.error("❌ Error replacing vendor attachment:", err);
    throw err;
  }
};

export const getPartialQuantityPRs = async (org_code) => {
  try {
    const prs = await purchaseRequestModel.fetchPartialQuantityPRs(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Partial Quantity PRs:", err);
    throw err;
  }
};