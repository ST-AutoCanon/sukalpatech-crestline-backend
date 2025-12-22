import * as model from "../../models/Procurement/pr_comments.model.js";
import * as prModel from "../../models/Procurement/procurement_requests.model.js";

// -----------------------------
// ADD PR COMMENT + OPTIONAL STATUS UPDATE
// -----------------------------
export const addPRCommentService = async (data) => {
  // Fetch comments only
  if (data.fetch_only) {
    const comments = await model.getPRCommentsByPR(data.pr_id);
    return { success: true, data: comments };
  }

  // Validate required fields
  if (!data.pr_id || !data.commented_by) {
    return {
      success: false,
      message: "PR ID and commenter are required",
    };
  }

  // Ensure comment exists (default = empty)
  data.comment = data.comment || "";

  let commentResult = null;

  // Add comment only if not empty
  if (data.comment.trim() !== "") {
    commentResult = await model.addPRComment(data);
  }

  return { success: true, data: commentResult };
};

// -----------------------------
// GET ALL PR COMMENTS
// -----------------------------
export const getPRCommentsService = async (pr_id) => {
  const comments = await model.getPRCommentsByPR(pr_id);
  return { success: true, data: comments };
};
