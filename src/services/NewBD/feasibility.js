import * as feasibilityModel from "../../models/NewBD/feasibility.js";

// Add a new feasibility status
export const updateFeasibilityStatus = async (requestId, data, org_code) => {
  // data = { status: "PENDING", comment: "Checked documents", updated_by: "user1" }
  const statusId = await feasibilityModel.addFeasibilityStatus(
    requestId,
    data,
    org_code,
  );
  return { success: true, statusId };
};

// Get all feasibility statuses for a request
export const getFeasibilityStatusHistory = async (requestId, org_code) => {
  const statuses = await feasibilityModel.fetchFeasibilityStatuses(
    requestId,
    org_code,
  );
  return { success: true, statuses };
};
