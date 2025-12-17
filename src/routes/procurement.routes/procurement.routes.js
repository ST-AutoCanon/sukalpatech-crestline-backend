import express from "express";
import {
  addPRVendors,
  getPRVendors,
} from "../../controllers/procurement.controller/prVendorSelection.controller.js";

import {
  createVendorController,
  getVendorsController,
} from "../../controllers/procurement.controller/vendor.controller.js";

import {
  createPRController,
  getAllPRsController,
} from "../../controllers/procurement.controller/procurementRequest.controller.js";

import {
  addPRItemController,
  getPRItemsController,
} from "../../controllers/procurement.controller/prItems.controller.js";

import {
  addPRCommentController,
  getPRCommentsController,
} from "../../controllers/procurement.controller/prComments.controller.js";

import {
  getPRStatusLogsController,
  createPRStatusLogController,
} from "../../controllers/procurement.controller/prStatusLog.controller.js";


import {
  addPRAttachmentController,
  getPRAttachmentsController,
} from "../../controllers/procurement.controller/prAttachments.controller.js";

import { upload } from "../../config/multer.js"; // adjust path if needed
const router = express.Router();


// ------------------ PrVendorsSelection ------------------
router.post("/vendor/add", addPRVendors);
router.get("/vendor/:pr_id", getPRVendors);

// ------------------ Vendors ------------------
router.post("/vendor", createVendorController);
router.get("/vendors", getVendorsController);

// ------------------ Procurement Requests ------------------
router.post("/pr", upload.array("attachments"), createPRController);
router.get("/prs", getAllPRsController);

// ------------------ Fetch PR related data ------------------
router.get("/pr/:pr_id/items", getPRItemsController);
router.get("/pr/:pr_id/comments", getPRCommentsController);
router.get("/pr/:pr_id/attachments", getPRAttachmentsController);

// ------------------ Add PR Log related data ------------------
router.get("/:pr_id/logs", getPRStatusLogsController); // Get all logs of a PR
router.post("/", createPRStatusLogController);         // Add new log manually if needed

// ------------------ Add PR related data ------------------
router.post("/pr/item", addPRItemController);
router.post("/pr/comment", addPRCommentController);
router.post("/pr/attachment", upload.single("file"), addPRAttachmentController);

export default router;
