import * as prService from "../../services/NewProcrument/prService.js";

// -------------------------------
// Create Purchase Request Controller (with attachments)
// -------------------------------
export const createPRController = async (req, res) => {
  try {
    // Parse JSON from form-data field (if sending via form-data)
    const prData = req.body.data ? JSON.parse(req.body.data) : req.body;
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    // Map uploaded files to vendors
    if (req.files && req.files.length > 0) {
      let fileIndex = 0;
      for (let item of prData.items) {
        if (!item.vendors) continue;
        for (let vendor of item.vendors) {
          vendor.attachments = vendor.attachments || [];
          if (fileIndex < req.files.length) {
            const file = req.files[fileIndex];
            vendor.attachments.push({
              file_name: file.originalname,
              file_path: file.filename, // only filename
              uploaded_by: prData.requested_by,
              uploaded_at: new Date().toISOString(),
            });
            fileIndex++;
          }
        }
      }
    }



    const result = await prService.createNewPR(org_code, prData);
    
    // const result = await prService.createNewPR(prData);

    res.status(201).json({
      success: true,
      message: "Purchase Request created successfully",
      prId: result.prId,
    });
  } catch (err) {
    console.error("❌ Controller Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Purchase Request",
      error: err.message,
    });
  }
};

// -------------------------------
// Create PR Controller for JSON testing (no attachments)
// -------------------------------
export const createPRControllerJSON = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const prData = req.body; // attachments already included in payload
    const result = await prService.createNewPR({ ...prData, org_code });

    res.status(201).json({
      success: true,
      message: "Purchase Request created successfully",
      prId: result.prId,
    });
  } catch (err) {
    console.error("❌ Controller Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Purchase Request",
      error: err.message,
    });
  }
};




export const getAllPRsController = async (req, res) => {
  try {
    // console.log("Login Request Body:", req.body);
    //     const { id, email, role, permissions,last_name, org_code } = req.user; // id, email, role from token
    //     console.log("📌 Logged-in user info:", { id, email, role, permissions ,last_name, org_code});
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    const result = await prService.getAllPRs(org_code);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch PRs",
        error: err.message,
      });
  }
};

export const getPRByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prService.getPRById(id);
    if (!result.success) return res.status(404).json(result);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch PR",
        error: err.message,
      });
  }
};


/**
 * Update PR (ONLY department status & comments)
 */
export const updatePRRequest = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    
    const reqId = req.params.id;
    const userData = req.body;

    const result = await prService.updatePRRequest(reqId, userData, org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating Purchase Request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Fetch ONLY Finance Approved PRs
 */
export const getFinanceApprovedPRRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await prService.getFinanceApprovedPRs(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching Finance Approved PRs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
/**
 * Fetch ONLY Finance Rejected PRs
 */
export const getFinanceRejectedPRRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    
    const result = await prService.getFinanceRejectedPRs(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching Finance Rejected PRs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
/**
 * Fetch ONLY Finance Pending PRs
 */
export const getFinancePendingPRRequests = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;
    const result = await prService.getFinancePendingPRs(org_code);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching Finance Pending PRs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
