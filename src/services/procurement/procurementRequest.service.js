import * as model from "../../models/Procurement/procurement_requests.model.js";
import * as prItemsModel from "../../models/Procurement/procurement_items.model.js";
import * as prCommentsModel from "../../models/Procurement/pr_comments.model.js";
import * as prAttachmentsModel from "../../models/Procurement/pr_attachments.model.js";
import * as prStatusLogModel from "../../models/Procurement/pr_status_log.model.js";

// VENDOR MODEL
import * as prVendorModel from "../../models/Procurement/pr_vendor_selection.model.js";

const generatePRNumber = async () => {
  const year = new Date().getFullYear();
  const lastPR = await model.getLastPRNumber();

  if (!lastPR) return `PR-${year}-0001`;

  const lastNumber = parseInt(lastPR.split("-")[2]);
  const nextNumber = String(lastNumber + 1).padStart(4, "0");

  return `PR-${year}-${nextNumber}`;
};

export const createPRService = async (
  prData,
  items = [],
  comments = [],
  attachments = [],
  vendor_ids = [] // ⬅️ vendors passed separately
) => {
  // 1️⃣ Generate PR number
  const pr_number = await generatePRNumber();

  // 2️⃣ Create PR
  const pr = await model.createPR({ ...prData, pr_number });

  // 3️⃣ Add items
  const prItems = await Promise.all(
    items.map((item) =>
      prItemsModel.addProcurementItem({ ...item, pr_id: pr.pr_id })
    )
  );

  // 4️⃣ Add comments
  const prComments = await Promise.all(
    comments.map((comment) =>
      prCommentsModel.addPRComment({ ...comment, pr_id: pr.pr_id })
    )
  );

  // 5️⃣ Add attachments
  const prAttachments = await Promise.all(
    attachments.map((att) =>
      prAttachmentsModel.addPRAttachment({ ...att, pr_id: pr.pr_id })
    )
  );

  // 6️⃣ Add vendors (same pattern as items/comments)
  let prVendors = [];
  if (Array.isArray(vendor_ids) && vendor_ids.length > 0) {
    await prVendorModel.addMultiplePRVendors(pr.pr_id, vendor_ids);
    prVendors = await prVendorModel.getPRVendorSelections(pr.pr_id);
  }

  // 7️⃣ Add initial status log (submitted by first department)
  await prStatusLogModel.createPRStatusLog({
    pr_id: pr.pr_id,
    old_status: null,
    new_status: "submitted",
    updated_by: prData.requested_by, // user who submitted
    department: prData.requesting_department, // e.g., "Procurement"
    note: "Initial PR submission",
  });
  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr.pr_id);

  // 8 Final return
  return {
    success: true,
    data: {
      pr,
      items: prItems,
      comments: prComments,
      attachments: prAttachments,
      vendors: prVendors,
      statusLogs,
    },
  };
};

export const getAllPRsService = async () => {
  const prs = await model.getAllProcurementRequests();

  const fullPRs = await Promise.all(
    prs.map(async (pr) => {
      const items = await prItemsModel.getProcurementItemsByPR(pr.pr_id);
      const comments = await prCommentsModel.getPRCommentsByPR(pr.pr_id);
      const attachments = await prAttachmentsModel.getPRAttachmentsByPR(
        pr.pr_id
      );
      const vendors = await prVendorModel.getPRVendorSelections(pr.pr_id);
      const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr.pr_id); // ✅ include status logs

      return {
        ...pr,
        items,
        comments,
        attachments,
        vendors,
        statusLogs,
      };
    })
  );

  return { success: true, data: fullPRs };
};

// export const updatePRService = async (pr_id, userDepartment, data) => {
//   console.log("=== Update PR Service ===");
//   console.log("PR ID:", pr_id);
//   console.log("User Department:", userDepartment);
//   console.log("Data Received:", JSON.stringify(data, null, 2));

//   if (!pr_id) return { success: false, message: "PR ID is required" };
//   if (!userDepartment)
//     return { success: false, message: "User department is required" };

//   // 1️⃣ Fetch PR
//   const pr = await model.getPRById(pr_id);
//   console.log("Fetched PR:", pr);
//   if (!pr) return { success: false, message: "PR not found" };

//   // 2️⃣ Fetch status logs
//   const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);
//   console.log("Status Logs:", statusLogs);

//   if (!Array.isArray(statusLogs) || statusLogs.length === 0) {
//     return {
//       success: false,
//       message: "Cannot update PR: status history missing",
//     };
//   }

//   const dept = userDepartment.toLowerCase();

//   // Extract departments touched
//   const departmentsTouched = statusLogs
//     .map((log) => log.department?.toLowerCase())
//     .filter(Boolean);

//   console.log("Departments Touched:", departmentsTouched);

//   // Only Procurement updates allowed if PR not moved beyond Procurement
//   if (dept === "procurement") {
//     if (departmentsTouched.some((d) => d !== "procurement")) {
//       return {
//         success: false,
//         message: "PR cannot be updated: moved beyond Procurement",
//       };
//     }
//   } else {
//     return {
//       success: false,
//       message: "Only Procurement department can update PRs",
//     };
//   }

//   console.log("Proceeding to update PR...");

//   // 3️⃣ Update main PR fields
//   const { project_name, priority, remarks } = data;
//   await model.updatePR(pr_id, { project_name, priority, remarks });

//   // 4️⃣ Update dependent data
//   if (Array.isArray(data.items)) {
//     for (const item of data.items) {
//       console.log("Updating Item:", item);
//       await prItemsModel.updateProcurementItem(item.item_id, item);
//     }
//   }

//   if (Array.isArray(data.comments)) {
//     for (const comment of data.comments) {
//       console.log("Updating Comment:", comment);
//       await prCommentsModel.updatePRComment(comment.comment_id, comment);
//     }
//   }

//   if (Array.isArray(data.attachments)) {
//     for (const attachment of data.attachments) {
//       console.log("Updating Attachment:", attachment);
//       await prAttachmentsModel.updatePRAttachment(
//         attachment.attachment_id,
//         attachment
//       );
//     }
//   }

//   if (Array.isArray(data.vendors)) {
//     for (const vendor of data.vendors) {
//       console.log("Updating Vendor:", vendor);
//       await prVendorModel.updatePRVendorSelection(vendor.id, vendor);
//     }
//   }

//   return { success: true, message: "PR updated successfully" };
// };

export const updatePRService = async (pr_id, userDepartment, data) => {
  console.log("=== Update PR Service ===");
  console.log("PR ID:", pr_id);
  console.log("User Department:", userDepartment);
  console.log("Data Received:", JSON.stringify(data, null, 2));

  if (!pr_id) return { success: false, message: "PR ID is required" };
  if (!userDepartment)
    return { success: false, message: "User department is required" };

  // 1️⃣ Fetch PR
  const pr = await model.getPRById(pr_id);
  console.log("Fetched PR:", pr);
  if (!pr) return { success: false, message: "PR not found" };

  // 2️⃣ Fetch status logs
  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);
  console.log("Status Logs:", statusLogs);

  if (!Array.isArray(statusLogs) || statusLogs.length === 0) {
    return {
      success: false,
      message: "Cannot update PR: status history missing",
    };
  }

  const dept = userDepartment.toLowerCase();

  // Extract departments touched
  const departmentsTouched = statusLogs
    .map((log) => log.department?.toLowerCase())
    .filter(Boolean);

  console.log("Departments Touched:", departmentsTouched);

  if (dept === "procurement") {
    if (departmentsTouched.some((d) => d !== "procurement")) {
      return {
        success: false,
        message: "PR cannot be updated: moved beyond Procurement",
      };
    }
  } else {
    return {
      success: false,
      message: "Only Procurement department can update PRs",
    };
  }

  console.log("Proceeding to update PR...");

  // 3️⃣ Update main PR fields
  const { project_name, priority, remarks, status } = data;

  // Preserve current status if not provided in request
  const updatedStatus = status || pr.status;

  await model.updatePR(pr_id, {
    project_name,
    priority,
    remarks,
    status: updatedStatus,
  });

  // 4️⃣ Update dependent data
  if (Array.isArray(data.items)) {
    for (const item of data.items) {
      console.log("Updating Item:", item);
      await prItemsModel.updateProcurementItem(item.item_id, item);
    }
  }

  if (Array.isArray(data.comments)) {
    for (const comment of data.comments) {
      console.log("Updating Comment:", comment);
      await prCommentsModel.updatePRComment(comment.comment_id, comment);
    }
  }

  if (Array.isArray(data.attachments)) {
    for (const attachment of data.attachments) {
      console.log("Updating Attachment:", attachment);
      await prAttachmentsModel.updatePRAttachment(
        attachment.attachment_id,
        attachment
      );
    }
  }

  if (Array.isArray(data.vendors)) {
    for (const vendor of data.vendors) {
      console.log("Updating Vendor:", vendor);
      await prVendorModel.updatePRVendorSelection(vendor.id, vendor);
    }
  }

  return { success: true, message: "PR updated successfully" };
};

export const deletePRService = async (pr_id, userDepartment) => {
  if (!pr_id) {
    return { success: false, message: "PR ID is required" };
  }

  if (!userDepartment) {
    return { success: false, message: "User department is required" };
  }

  // 1️⃣ Fetch PR
  const pr = await model.getPRById(pr_id);
  if (!pr) {
    return { success: false, message: "PR not found" };
  }

  // 2️⃣ Fetch status logs
  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);

  if (!Array.isArray(statusLogs) || statusLogs.length === 0) {
    return {
      success: false,
      message: "Cannot delete PR: status history missing",
    };
  }

  const dept = userDepartment.toLowerCase();

  // Extract all departments involved so far
  const departmentsTouched = statusLogs
    .map((log) => log.department?.toLowerCase())
    .filter(Boolean);

  // -------------------------
  // 🟢 PROCUREMENT RULE
  // -------------------------
  if (dept === "procurement") {
    // Only allowed if NO Feasibility / Finance touched
    if (departmentsTouched.some((d) => d !== "procurement")) {
      return {
        success: false,
        message: "PR cannot be deleted: moved beyond Procurement",
      };
    }
  }

  // -------------------------
  // 🟡 FEASIBILITY RULE
  // -------------------------
  if (dept === "feasibility") {
    // Allowed only if Finance NOT touched
    if (departmentsTouched.includes("finance")) {
      return {
        success: false,
        message: "PR cannot be deleted: moved to Finance",
      };
    }
  }

  // -------------------------
  // 🔴 FINANCE RULE
  // -------------------------
  if (dept === "finance") {
    return {
      success: false,
      message: "Finance cannot delete PRs",
    };
  }

  // 3️⃣ Delete dependent data
  await prItemsModel.deleteProcurementItemsByPR(pr_id);
  await prAttachmentsModel.deletePRAttachmentsByPR(pr_id);
  await prCommentsModel.deletePRCommentsByPR(pr_id);
  await prStatusLogModel.deletePRStatusLogsByPR(pr_id);

  // 4️⃣ Delete PR
  await model.deletePR(pr_id);

  return { success: true, message: "PR deleted successfully" };
};
