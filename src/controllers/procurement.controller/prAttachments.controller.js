import * as service from "../../services/procurement.service/prAttachments.service.js";
import { apiResponse } from "../../utils/helpers.js";

// Add PR Attachment with multer
export const addPRAttachmentController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(apiResponse(false, "No file uploaded", null));
    }

    // Prepare data for DB
    const data = {
      pr_id: req.body.pr_id,
      file_name: req.file.originalname, // original file name
      file_path: `/uploads/attachments/${req.file.filename}`, // saved path
      uploaded_by: req.body.uploaded_by || null, // optional
      quotation_validity_date: req.body.quotation_validity_date || null, // optional
    };

    const result = await service.addPRAttachmentService(data);

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message, null));
    }

    res.json(apiResponse(true, "PR Attachment added", result.data));
  } catch (error) {
    console.log("Error adding PR Attachment:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};

// Get PR Attachments
export const getPRAttachmentsController = async (req, res) => {
  try {
    const pr_id = req.params.pr_id;
    const result = await service.getPRAttachmentsService(pr_id);
    res.json(apiResponse(true, "PR Attachments fetched", result.data));
  } catch (error) {
    console.log("Error fetching PR Attachments:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};
