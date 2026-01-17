import express from "express";
import * as bdController from "../../controllers/NewBD/businessDevelopment.js";

const router = express.Router();

// Create request + initial status
router.post("/", bdController.createBDRequestController);

export default router;
