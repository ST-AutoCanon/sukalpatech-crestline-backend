import * as purchaseRequestModel from "../../models/NewProcurement/purchaseRequests.js";
import * as purchaseItemModel from "../../models/NewProcurement/purchaseItems.js";
import * as itemVendorModel from "../../models/NewProcurement/itemVendors.js";
import * as vendorAttachmentModel from "../../models/NewProcurement/vendorAttachments.js";
import * as vendorCommentModel from "../../models/NewProcurement/vendorComments.js";

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
export const updatePRRequest = async (reqId, userData, org_code) => {
  try {
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