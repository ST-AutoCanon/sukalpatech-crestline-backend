import express from "express";
import {
  createNotificationController,
  getNotificationsController,
  markAsReadController,
  deleteNotificationController,
} from "../../controllers/notification/NotificationController.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/", auth, createNotificationController);

// GET ALL (for logged-in user)
router.get("/", auth, getNotificationsController);

// MARK AS READ
router.patch("/:id/read", auth, markAsReadController);

// DELETE
router.delete("/:id", auth, deleteNotificationController);

export default router;
