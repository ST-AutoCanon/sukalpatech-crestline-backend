// import * as model from "../../models/Procurement.models/procurement_requests.model.js";
// import * as prItemsModel from "../../models/Procurement.models/procurement_items.model.js";
// import * as prCommentsModel from "../../models/Procurement.models/pr_comments.model.js";
// import * as prAttachmentsModel from "../../models/Procurement.models/pr_attachments.model.js";

// const generatePRNumber = async () => {
//   const year = new Date().getFullYear();
//   const lastPR = await model.getLastPRNumber();

//   if (!lastPR) {
//     return `PR-${year}-0001`;
//   }

//   const lastNumber = parseInt(lastPR.split("-")[2]);
//   const nextNumber = String(lastNumber + 1).padStart(4, "0");

//   return `PR-${year}-${nextNumber}`;
// };

// export const createPRService = async (
//   prData,
//   items = [],
//   comments = [],
//   attachments = []
// ) => {
//   // Generate PR Number
//   const pr_number = await generatePRNumber();

//   // Insert PR
//   const pr = await model.createPR({ ...prData, pr_number });

//   // Add items using correct model function
//   const prItems = await Promise.all(
//     items.map((item) =>
//       prItemsModel.addProcurementItem({ ...item, pr_id: pr.pr_id })
//     )
//   );

//   // Add comments
//   const prComments = await Promise.all(
//     comments.map((comment) =>
//       prCommentsModel.addPRComment({ ...comment, pr_id: pr.pr_id })
//     )
//   );

//   // Add attachments
//   const prAttachments = await Promise.all(
//     attachments.map((att) =>
//       prAttachmentsModel.addPRAttachment({ ...att, pr_id: pr.pr_id })
//     )
//   );

//   return {
//     success: true,
//     data: {
//       pr,
//       items: prItems,
//       comments: prComments,
//       attachments: prAttachments,
//     },
//   };
// };

// export const getAllPRsService = async () => {
//   const prs = await model.getAllProcurementRequests();
//   return { success: true, data: prs };
// };


import * as model from "../../models/Procurement.models/procurement_requests.model.js";
import * as prItemsModel from "../../models/Procurement.models/procurement_items.model.js";
import * as prCommentsModel from "../../models/Procurement.models/pr_comments.model.js";
import * as prAttachmentsModel from "../../models/Procurement.models/pr_attachments.model.js";
import * as prStatusLogModel from "../../models/Procurement.models/pr_status_log.model.js";


// VENDOR MODEL
import * as prVendorModel from "../../models/Procurement.models/pr_vendor_selection.model.js";

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

// export const getAllPRsService = async () => {
//   const prs = await model.getAllProcurementRequests();
//   return { success: true, data: prs };
// };



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
