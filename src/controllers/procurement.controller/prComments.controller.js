import * as service from "../../services/procurement.service/prComments.service.js";
import { apiResponse } from "../../utils/helpers.js";

// POST: Add a PR comment or update status
export const addPRCommentController = async (req, res) => {
  console.log("Received body:", req.body); // debug log
  try {
    const result = await service.addPRCommentService(req.body);

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message, null));
    }

    res.json(
      apiResponse(
        true,
        result.data ? "PR Comment added" : "PR Status updated",
        result.data
      )
    );
  } catch (error) {
    console.error("Error adding PR Comment:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

// GET: Get all comments for a PR
export const getPRCommentsController = async (req, res) => {
  try {
    const { pr_id } = req.params;

    if (!pr_id) {
      return res
        .status(400)
        .json(apiResponse(false, "PR ID is required", null));
    }

    const result = await service.getPRCommentsService(pr_id);
    res.json(apiResponse(true, "PR Comments fetched", result.data));
  } catch (error) {
    console.error("Error fetching PR Comments:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
