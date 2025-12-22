import * as service from "../../services/feasibility/feasibility.service.js";
import { apiResponse } from "../../utils/helpers.js";

export const getAllFeasibilityPRsController = async (req, res) => {
  try {
    const result = await service.getAllFeasibilityPRs();
    res.json(apiResponse(true, "All PRs fetched for feasibility", result.data));
  } catch (error) {
    console.log("Error fetching feasibility PRs:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const addFeasibilityCommentController = async (req, res) => {
  try {
    const { pr_id, commented_by, department, comment } = req.body;
    const result = await service.addFeasibilityComment(pr_id, {
      commented_by,
      department,
      comment,
    });

    if (!result.success)
      return res.status(400).json(apiResponse(false, result.message, null));
    res.json(apiResponse(true, "Comment added successfully", result.data));
  } catch (error) {
    console.log("Error adding feasibility comment:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const updateFeasibilityStatusController = async (req, res) => {
  try {
    const { pr_id, new_status, old_status, updated_by, department, note } =
      req.body;
    const result = await service.updateFeasibilityStatus(pr_id, {
      new_status,
      old_status,
      updated_by,
      department,
      note,
    });

    if (!result.success)
      return res.status(400).json(apiResponse(false, result.message, null));
    res.json(apiResponse(true, "Feasibility status updated", result.data));
  } catch (error) {
    console.log("Error updating feasibility status:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
