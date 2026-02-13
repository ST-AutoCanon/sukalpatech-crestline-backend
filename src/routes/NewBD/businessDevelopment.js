import express from "express";
import * as bdController from "../../controllers/NewBD/businessDevelopment.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Create request + initial status
router.post("/", auth, bdController.createBDRequestController);

export default router;
