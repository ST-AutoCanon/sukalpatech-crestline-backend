import * as feasibilityModel from "../../models/NewBD/feasibility.js";

// Add a new feasibility status
export const updateFeasibilityStatus = async (requestId, data) => {
  // data = { status: "PENDING", comment: "Checked documents", updated_by: "user1" }
  const statusId = await feasibilityModel.addFeasibilityStatus(requestId, data);
  return { success: true, statusId };
};

// Get all feasibility statuses for a request
export const getFeasibilityStatusHistory = async (requestId) => {
  const statuses = await feasibilityModel.fetchFeasibilityStatuses(requestId);
  return { success: true, statuses };
};
