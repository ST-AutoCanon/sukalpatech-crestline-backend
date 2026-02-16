// import express from "express";
// import * as bdController from "../../controllers/NewBD/businessDevelopment.js";

// const router = express.Router();

// // Create request + initial status
// router.post("/", bdController.createBDRequestController);

// export default router;


import express from "express";
import * as bdController from "../../controllers/NewBD/businessDevelopment.js";
import { auth } from "../../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// -------------------------------
// CREATE Business Development Request (protected)
// -------------------------------
router.post("/", auth, bdController.createBDRequestController);

export default router;
