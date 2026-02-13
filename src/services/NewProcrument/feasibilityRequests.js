import * as feasibilityRequestModel from "../../models/NewProcurement/feasibilityRequests.js";
import * as itemVendorModel from "../../models/NewProcurement/itemVendors.js";
import * as vendorCommentModel from "../../models/NewProcurement/vendorComments.js";



export const updateFeasibilityReq = async (reqId, userData, org_code) => {
  try {
    // 1️⃣ Update department_statuses if provided
    if (
      userData.department_statuses &&
      userData.department_statuses.length > 0
    ) {
      await feasibilityRequestModel.updateDepartmentStatuses(
        reqId,
        userData.department_statuses,
        org_code,
      );
    }

    // 2️⃣ Update vendor statuses and append new comments
    if (userData.items && userData.items.length > 0) {
      for (const item of userData.items) {
        if (item.vendors && item.vendors.length > 0) {
          for (const vendor of item.vendors) {
            // ✅ Use vendor.id (item_vendor.id) instead of vendor.vendor_id

            // Update vendor status if provided
            if (vendor.status !== undefined) {
              await itemVendorModel.updateVendorStatus(
                vendor.id, // corrected
                vendor.status,
                vendor.vendor_status_updated_by,
                org_code,
              );
            }

            // Append new comments if any
            if (vendor.comments && vendor.comments.length > 0) {
              for (const comment of vendor.comments) {
                // INSERT ONLY NEW COMMENT
                if (!comment.id) {
                  await vendorCommentModel.createVendorComment(
                    comment,
                    vendor.id,
                    2,
                    org_code,
                  );
                }
              }
            }
          }
        }
      }
    }

    return {
      success: true,
      message: "Feasibility Request updated successfully",
    };
  } catch (err) {
    console.error("❌ Error updating Feasibility Request:", err);
    throw err;
  }
};

export const getSubmittedPurchaseRequests = async (org_code) => {
  try {
    const prs =
      await feasibilityRequestModel.fetchSubmittedPurchaseRequests(org_code);
    return { success: true, data: prs };
  } catch (err) {
    console.error("❌ Error fetching submitted purchase requests:", err);
    throw err;
  }
};

// frontend service: feasibilityRequests.js
export const updateFULLFeasibilityRequest = async (id, data) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feasibility/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


