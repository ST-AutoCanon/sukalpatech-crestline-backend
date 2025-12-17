import * as model from "../../models/Procurement.models/procurement_requests.model.js";
import * as prItemsModel from "../../models/Procurement.models/procurement_items.model.js";
import * as prCommentsModel from "../../models/Procurement.models/pr_comments.model.js";
import * as prAttachmentsModel from "../../models/Procurement.models/pr_attachments.model.js";
import * as prStatusLogModel from "../../models/Procurement.models/pr_status_log.model.js";
import * as prVendorModel from "../../models/Procurement.models/pr_vendor_selection.model.js";

export const getAllFeasibilityPRs = async () => {
  const prs = await model.getAllProcurementRequests();

  const fullPRs = await Promise.all(
    prs.map(async (pr) => {
      const items = await prItemsModel.getProcurementItemsByPR(pr.pr_id);
      const comments = await prCommentsModel.getPRCommentsByPR(pr.pr_id);
      const attachments = await prAttachmentsModel.getPRAttachmentsByPR(
        pr.pr_id
      );
      const vendors = await prVendorModel.getPRVendorSelections(pr.pr_id);
      const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr.pr_id);

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

export const addFeasibilityComment = async (pr_id, commentData) => {
  await prCommentsModel.addPRComment({
    pr_id,
    commented_by: commentData.commented_by,
    department: commentData.department,
    comment: commentData.comment,
  });

  const comments = await prCommentsModel.getPRCommentsByPR(pr_id);
  return { success: true, data: comments };
};

export const updateFeasibilityStatus = async (pr_id, statusData) => {
  const validStatuses = [
    "Feasibility Pending",
    "Feasibility Approved",
    "Feasibility Rejected",
  ];
  if (!validStatuses.includes(statusData.new_status)) {
    return { success: false, message: "Invalid feasibility status" };
  }

  await prStatusLogModel.createPRStatusLog({
    pr_id,
    old_status: statusData.old_status || null,
    new_status: statusData.new_status,
    updated_by: statusData.updated_by,
    department: statusData.department,
    note: statusData.note || "",
  });

  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);
  return { success: true, data: statusLogs };
};
