import BDService from "../../services/Businessdevelopment/businessDevelopment.js";

// CREATE BD
export const createBD = async (req, res) => {
  try {
    const files = req.files || [];

    const attachments = files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    // Merge form data with attachments
    const payload = {
      ...req.body,                // <-- include all fields like applicant_name
      attachments: JSON.stringify(attachments), // attachments as JSON
    };

    // Optional: validate required field
    if (!payload.applicant_name) {
      return res.status(400).json({ success: false, message: "applicant_name is required" });
    }

    const data = await BDService.createBD(payload);

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ALL BD
export const getAllBD = async (req, res) => {
  try {
    const data = await BDService.getAllBD();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT TO FEASIBILITY
export const submitToFeasibility = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await BDService.submitToFeasibility(id);
    res.json({ success: true, message: "Submitted to feasibility", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET PENDING FEASIBILITY
export const getPendingFeasibility = async (req, res) => {
  try {
    const data = await BDService.getPendingFeasibility();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FEASIBILITY REVIEW
export const feasibilityReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { feasibility_status, feasibility_comments } = req.body;
    const data = await BDService.feasibilityReview(id, feasibility_status, feasibility_comments);
    res.json({ success: true, message: "Feasibility review completed", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const bdUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { bd_status, bd_comments } = req.body;

    const data = await BDService.bdUpdate(id, bd_status, bd_comments);

    res.json({ success: true, message: "BD updated successfully", data });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBD = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    let attachments;

    // If new files uploaded → process them
    if (files.length > 0) {
      attachments = files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    const payload = {
      ...req.body,
    };

    // Attachments only if uploaded
    if (attachments) {
      payload.attachments = JSON.stringify(attachments);
    }

    const data = await BDService.updateBD(id, payload);

    res.json({
      success: true,
      message: "BD updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
