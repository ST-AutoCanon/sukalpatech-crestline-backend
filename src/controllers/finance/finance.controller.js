import * as service from "../../services/finance/finance.service.js";
import { apiResponse } from "../../utils/helpers.js";

export const getAllFinancePRsController = async (req, res) => {
  try {
    const result = await service.getAllFinancePRs();
    res.json(apiResponse(true, "All PRs fetched for finance", result.data));
  } catch (error) {
    console.log("Error fetching finance PRs:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const addFinanceCommentController = async (req, res) => {
  try {
    const { pr_id, commented_by, comment } = req.body;

    const result = await service.addFinanceComment(pr_id, {
      commented_by,
      comment,
    });

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message, null));
    }

    res.json(
      apiResponse(true, "Finance comment added successfully", result.data)
    );
  } catch (error) {
    console.log("Error adding finance comment:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const updateFinanceStatusController = async (req, res) => {
  try {
    const { pr_id, new_status, old_status, updated_by, note } = req.body;

    const result = await service.updateFinanceStatus(pr_id, {
      new_status,
      old_status,
      updated_by,
      note,
    });

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message, null));
    }

    res.json(
      apiResponse(true, "Finance status updated successfully", result.data)
    );
  } catch (error) {
    console.log("Error updating finance status:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
