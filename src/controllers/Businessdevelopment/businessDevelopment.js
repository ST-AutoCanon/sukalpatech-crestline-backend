import BDService from "../../services/Businessdevelopment/businessDevelopment.js";

// CREATE BD
export const createBD = async (req, res) => {
  try {
    console.log("REQ.FILES:", req.files);
    console.log("REQ.BODY:", req.body);

    // ✅ Declare FIRST
    const org_code = req.user?.org_code;


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
      file_path: `/uploads/attachments/${file.filename}`, // ✅ FIX
    }));
    console.log("MAPPED ATTACHMENTS:", attachments);
    const payload = {
      ...req.body,
      attachments: attachments,
    };
    const booleanFields = [
  "ac",
  "cctv",
  "gps",
  "fire_extinguisher",
  "emergency_exit",
  "led_board",
  "usb",
  "luggage_carrier",
  "wheelchair_access",
  "ais_compliant",
  "cmvr_compliant",
  "school_bus_safety",
  "state_transport_norms",
];

booleanFields.forEach((field) => {
  if (payload[field] !== undefined) {
    payload[field] =
      payload[field] === true ||
      payload[field] === "true";
  }
});
    console.log("FINAL PAYLOAD:", payload);

    if (!payload.applicant_name) {
      return res.status(400).json({
        success: false,
        message: "applicant_name is required",
      });
    }
    console.log("REQ BODY DATE =", req.body.required_date);
console.log("PAYLOAD DATE =", payload.required_date);
    const data = await BDService.createBD(org_code, payload);


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
    const data = await BDService.submitToFeasibility(id, org_code);
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

// ✅ OLD attachments from frontend
let existingAttachments = [];

if (req.body.existingAttachments) {
  try {
    existingAttachments = JSON.parse(req.body.existingAttachments);
  } catch (err) {
    existingAttachments = [];
  }
}

// ✅ NEW uploaded files
const newAttachments = files.map((file) => ({
  filename: file.filename,
  originalname: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  file_path: `/uploads/attachments/${file.filename}`,
}));

// ✅ MERGE OLD + NEW
const mergedAttachments = [
  ...existingAttachments,
  ...newAttachments,
];

const payload = {
  ...req.body,
  attachments: JSON.stringify(mergedAttachments),
};
const booleanFields = [
  "ac",
  "cctv",
  "gps",
  "fire_extinguisher",
  "emergency_exit",
  "led_board",
  "usb",
  "luggage_carrier",
  "wheelchair_access",
  "ais_compliant",
  "cmvr_compliant",
  "school_bus_safety",
  "state_transport_norms",
];

booleanFields.forEach((field) => {
  if (payload[field] !== undefined) {
    payload[field] =
      payload[field] === true ||
      payload[field] === "true";
  }
});

// ✅ REMOVE frontend-only field
delete payload.existingAttachments;

    const data = await BDService.updateBD(id, payload, org_code);

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
