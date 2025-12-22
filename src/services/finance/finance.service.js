import * as model from "../../models/Procurement/procurement_requests.model.js";
import * as prItemsModel from "../../models/Procurement/procurement_items.model.js";
import * as prCommentsModel from "../../models/Procurement/pr_comments.model.js";
import * as prAttachmentsModel from "../../models/Procurement/pr_attachments.model.js";
import * as prStatusLogModel from "../../models/Procurement/pr_status_log.model.js";
import * as prVendorModel from "../../models/Procurement/pr_vendor_selection.model.js";

/**
 * Helper: ensure feasibility is approved
 */
const ensureFeasibilityApproved = async (pr_id) => {
  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);

  const feasibilityLog = statusLogs
    .filter((log) => log.department === "Feasibility")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  if (!feasibilityLog || feasibilityLog.new_status !== "Feasibility Approved") {
    return {
      allowed: false,
      message: "Finance actions are locked until feasibility is approved",
    };
  }

  return { allowed: true };
};

/**
 * Get all PRs for finance view (read-only)
 */
export const getAllFinancePRs = async () => {
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

/**
 * Add finance comment (ONLY if feasibility approved)
 */
export const addFinanceComment = async (pr_id, commentData) => {
  const check = await ensureFeasibilityApproved(pr_id);
  if (!check.allowed) {
    return { success: false, message: check.message };
  }

  await prCommentsModel.addPRComment({
    pr_id,
    commented_by: commentData.commented_by,
    department: "Finance",
    comment: commentData.comment,
  });

  const comments = await prCommentsModel.getPRCommentsByPR(pr_id);
  return { success: true, data: comments };
};

/**
 * Update finance status (ONLY if feasibility approved)
 */
export const updateFinanceStatus = async (pr_id, statusData) => {
  const check = await ensureFeasibilityApproved(pr_id);
  if (!check.allowed) {
    return { success: false, message: check.message };
  }

  const validStatuses = [
    "Finance Pending",
    "Finance Approved",
    "Finance Rejected",
  ];
  if (!validStatuses.includes(statusData.new_status)) {
    return { success: false, message: "Invalid finance status" };
  }

  await prStatusLogModel.createPRStatusLog({
    pr_id,
    old_status: statusData.old_status || null,
    new_status: statusData.new_status,
    updated_by: statusData.updated_by,
    department: "Finance",
    note: statusData.note || "",
  });

  const statusLogs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);
  return { success: true, data: statusLogs };
};
