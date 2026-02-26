import BDService from "../../services/Businessdevelopment/businessDevelopment.js";

// CREATE BD
export const createBD = async (req, res) => {
  try {

    // ✅ Declare FIRST
    const org_code = req.user?.org_code;

    console.log("FULL REQ.USER:", req.user);
    console.log("ORG CODE RECEIVED:", org_code);
    console.log("BODY:", req.body);

    if (!org_code) {
      return res.status(400).json({
        success: false,
        message: "Org code missing from token",
      });
    }

    const files = req.files || [];

    const attachments = files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const payload = {
      ...req.body,
      attachments: JSON.stringify(attachments),
    };

    if (!payload.applicant_name) {
      return res.status(400).json({
        success: false,
        message: "applicant_name is required",
      });
    }
    const data = await BDService.createBD(org_code,payload);

    console.log("line 41",org_code);

    res.status(201).json({ success: true, data });

  } catch (error) {
    console.error("❌ Error creating BD:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// GET ALL BD
// export const getAllBD = async (req, res) => {
//   try {
//     // ✅ Dynamic org_code from logged-in user token
//     const org_code = req.user.org_code;

//     const data = await BDService.getAllBD(org_code);
//     res.json({ success: true, data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getAllBD = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { status } = req.query;   // ✅ read filter

    const data = await BDService.getAllBD(org_code, status);

    res.json({ success: true, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT TO FEASIBILITY
export const submitToFeasibility = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { id } = req.params;
    const data = await BDService.submitToFeasibility(id,org_code);
    res.json({ success: true, message: "Submitted to feasibility", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET PENDING FEASIBILITY
export const getPendingFeasibility = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    const data = await BDService.getPendingFeasibility(org_code);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FEASIBILITY REVIEW
export const feasibilityReview = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { id } = req.params;
    const { feasibility_status, feasibility_comments } = req.body;
    const data = await BDService.feasibilityReview(
      id,
      feasibility_status,
      feasibility_comments,
      org_code
    );
    res.json({ success: true, message: "Feasibility review completed", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const bdUpdate = async (req, res) => {
  try {
    // ✅ Get org_code from logged-in user
    const org_code = req.user.org_code;

    const { id } = req.params;
    const { bd_status, bd_comments } = req.body;

    const data = await BDService.bdUpdate(
      id,
      bd_status,
      bd_comments,
      org_code
    );

    res.json({
      success: true,
      message: "BD updated successfully",
      data,
    });
  } catch (err) {
    console.error("❌ BD update error:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateBD = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { id } = req.params;
    const files = req.files || [];

    let attachments;

    // If new files uploaded → process them
    if (files.length > 0) {
      attachments = files.map((file) => ({
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

    const data = await BDService.updateBD(id, payload,org_code);

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
