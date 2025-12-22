import * as prStatusLogService from "../../services/procurement/pr_status_log.service.js";
import { apiResponse } from "../../utils/helpers.js";

export const getPRStatusLogsController = async (req, res) => {
  try {
    const { pr_id } = req.params;
    const result = await prStatusLogService.getPRStatusLogsService(pr_id);
    res.json(apiResponse(true, "PR Status Logs fetched", result.data));
  } catch (error) {
    console.error("Error fetching PR status logs:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

export const createPRStatusLogController = async (req, res) => {
  try {
    const result = await prStatusLogService.createPRStatusLogService(req.body);
    res.json(apiResponse(true, "PR Status Log created", result.data));
  } catch (error) {
    console.error("Error creating PR status log:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
