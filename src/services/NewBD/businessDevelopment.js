import * as bdModel from "../../models/NewBD/businessDevelopment.js";

// -------------------------------
// Create request + initial CREATED status
// -------------------------------
export const createBDRequestWithStatus = async (data) => {
  // 1️⃣ Create the main request
  const requestId = await bdModel.createBDRequest(data);

  // 2️⃣ Create initial status
  await bdModel.createInitialStatus(requestId, data);

  return { success: true, requestId };
};
