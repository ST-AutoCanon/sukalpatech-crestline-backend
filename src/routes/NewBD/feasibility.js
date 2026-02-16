// import express from "express";
// import * as feasibilityController from "../../controllers/NewBD/feasibility.js";

// const router = express.Router();

// // Add a new status/comment for Feasibility
// router.post(
//   "/:requestId/status",
//   feasibilityController.addFeasibilityStatusController
// );

// // Fetch status history
// router.get(
//   "/:requestId/status",
//   feasibilityController.getFeasibilityStatusController
// );

// export default router;


import express from "express";
import * as feasibilityController from "../../controllers/NewBD/feasibility.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// -------------------------------
// Add a new status/comment for Feasibility
// -------------------------------
router.post(
  "/:requestId/status",
  auth, // ✅ Protect route
  feasibilityController.addFeasibilityStatusController,
);

// -------------------------------
// Fetch status history
// -------------------------------
router.get(
  "/:requestId/status",
  auth, // ✅ Protect route
  feasibilityController.getFeasibilityStatusController,
);

export default router;
