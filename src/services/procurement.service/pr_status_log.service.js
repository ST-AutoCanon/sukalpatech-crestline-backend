import * as prStatusLogModel from "../../models/Procurement.models/pr_status_log.model.js";

export const createPRStatusLogService = async (data) => {
  const log = await prStatusLogModel.createPRStatusLog(data);
  return { success: true, data: log };
};

export const getPRStatusLogsService = async (pr_id) => {
  const logs = await prStatusLogModel.getPRStatusLogsByPR(pr_id);
  return { success: true, data: logs };
};
