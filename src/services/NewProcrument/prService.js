import * as purchaseRequestModel from "../../models/NewProcurement/purchaseRequests.js";
import * as purchaseItemModel from "../../models/NewProcurement/purchaseItems.js";
import * as itemVendorModel from "../../models/NewProcurement/itemVendors.js";
import * as vendorAttachmentModel from "../../models/NewProcurement/vendorAttachments.js";
import * as vendorCommentModel from "../../models/NewProcurement/vendorComments.js";

// -------------------------------
// Create New Purchase Request
// -------------------------------



export const createNewPR = async (prData) => {
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
    const prId = await purchaseRequestModel.createPurchaseRequest(prData);

    // 2️⃣ Create Items
    for (const item of prData.items) {
      const itemId = await purchaseItemModel.createPurchaseItem(item, prId);

      // 3️⃣ Create Vendors
      if (item.vendors) {
        for (const vendor of item.vendors) {
          const vendorId = await itemVendorModel.createItemVendor(
            vendor,
            itemId
          );

          // 4️⃣ Attachments
          if (vendor.attachments) {
            for (const att of vendor.attachments) {
              // Only store the filename (remove folder path)
              att.file_path = att.file_path.replace(/^.*[\\\/]/, "");
              await vendorAttachmentModel.createVendorAttachment(att, vendorId);
            }
          }

          // 5️⃣ Comments
          if (vendor.comments) {
            for (const com of vendor.comments) {
              await vendorCommentModel.createVendorComment(com, vendorId);
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


export const getAllPRs = async () => {
  try {
    const prs = await purchaseRequestModel.fetchAllPRs();
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching all PRs:", err);
    throw err;
  }
};

export const getPRById = async (prId) => {
  try {
    const pr = await purchaseRequestModel.fetchPRById(prId);
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
export const updatePRRequest = async (reqId, userData) => {
  try {
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await purchaseRequestModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses
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
export const getFinanceApprovedPRs = async () => {
  try {
    const prs = await purchaseRequestModel.fetchFinanceApprovedPRs();
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching Finance Approved PRs:", err);
    throw err;
  }
};