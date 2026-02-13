import * as bdModel from "../../models/NewBD/businessDevelopment.js";

// -------------------------------
// Create request + initial CREATED status
// -------------------------------
export const createBDRequestWithStatus = async (data, org_code) => {
  // 1️⃣ Create the main request
  const requestId = await bdModel.createBDRequest(data, org_code);

  // 2️⃣ Create initial status
  await bdModel.createInitialStatus(requestId, data, org_code);

  return { success: true, requestId };
};
