import * as service from "../../services/procurement/procurementRequest.service.js";
import { apiResponse } from "../../utils/helpers.js";

// Multer setup should be done in your route
export const createPRController = async (req, res) => {
  try {
    // Parse arrays from FormData
    const items = req.body.items ? JSON.parse(req.body.items) : [];
    const comments = req.body.comments ? JSON.parse(req.body.comments) : [];
    const vendor_ids = req.body.vendor_ids
      ? JSON.parse(req.body.vendor_ids)
      : [];

    // Attachments come from multer
 const attachments = req.files
   ? req.files.map((file) => ({
       file_name: file.originalname,
       file_path: `uploads/attachments/${file.filename}`, // ✅ FIX HERE
     }))
   : [];


    // Remaining PR fields
    const prData = {
      project_name: req.body.project_name,
      requested_by: req.body.requested_by,
      requested_by_person: req.body.requested_by_person,
      requesting_department_id: req.body.requesting_department_id,
      requesting_department: req.body.requesting_department,
      priority: req.body.priority,
      required_delivery_date: req.body.required_delivery_date,
      remarks: req.body.remarks,
      status: req.body.status || "draft",
      quotationValidityDate: req.body.quotationValidityDate,
    };

    const result = await service.createPRService(
      prData,
      items,
      comments,
      attachments,
      vendor_ids
    );

    if (!result.success)
      return res.status(400).json(apiResponse(false, result.message, null));

    res.json(apiResponse(true, "PR created successfully", result.data));
  } catch (error) {
    console.log("Error creating PR:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};


export const getAllPRsController = async (req, res) => {
  try {
    const result = await service.getAllPRsService();
    res.json(apiResponse(true, "All PRs fetched", result.data));
  } catch (error) {
    console.log("Error fetching PRs:", error);
    res.status(500).json(apiResponse(false, error.message, null));
  }
};


export const updatePRController = async (req, res) => {
  try {
    const { pr_id } = req.params;
    const userDepartment = req.headers["x-department"];
    const data = req.body;

    console.log("=== Update PR Controller ===");
    console.log("PR ID:", pr_id);
    console.log("User Department:", userDepartment);
    console.log("Request Body:", JSON.stringify(data, null, 2));

    if (!pr_id) {
      return res
        .status(400)
        .json({ success: false, message: "PR ID is required" });
    }

    if (!userDepartment) {
      return res
        .status(400)
        .json({ success: false, message: "User department is required" });
    }

    const result = await service.updatePRService(pr_id, userDepartment, data);

    console.log("Service Result:", result);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePRController = async (req, res) => {
  try {
    const { pr_id } = req.params;
    const userDepartment = req.headers["x-department"];

    // ✅ Call the service via the imported module
    const result = await service.deletePRService(pr_id, userDepartment);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
