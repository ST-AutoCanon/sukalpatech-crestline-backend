// import * as ProjectService from "../../services/projectManagement/projectService.js";

// /* ================= CREATE PROJECT ================= */
// export const assignProject = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;

//     const payload = {
//       ...req.body,
//       assigned_date: new Date(), // auto set
//     };

//     const data = await ProjectService.createProjectService(payload, org_code);

//     res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       data,
//     });
//   } catch (error) {
//     console.error("❌ Create Project Error:", error);

//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= GET ALL PROJECTS ================= */
// export const getAllProjects = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;

//     const data = await ProjectService.getAllProjectsService(org_code);

//     res.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("❌ Get Projects Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= UPDATE STATUS ================= */
// export const updateProjectStatus = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;

//     const payload = {
//       ...req.body,
//     };

//     const data = await ProjectService.updateProjectStatusService(
//       payload,
//       org_code
//     );

//     res.json({
//       success: true,
//       message: "Status updated successfully",
//       data,
//     });
//   } catch (error) {
//     console.error("❌ Update Status Error:", error);

//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= GET STATUS ================= */
// export const getProjectStatus = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const { project_id } = req.params;

//     const data = await ProjectService.getProjectStatusService(
//       project_id,
//       org_code
//     );

//     res.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("❌ Get Status Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= UPSERT WORKFLOW ================= */
// export const upsertProjectWorkflow = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const { project_id, workflow } = req.body; // workflow = [{department, sequence}, ...]

//     const data = await ProjectService.upsertProjectWorkflowService(project_id, workflow, org_code);

//     res.json({ success: true, message: "Workflow updated", data });
//   } catch (error) {
//     console.error("❌ Upsert Workflow Error:", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /* ================= FETCH PROJECTS FOR DEPARTMENT ================= */
// export const fetchProjectsForDepartment = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const { department } = req.params;

//     const data = await ProjectService.fetchProjectsForDepartmentService(department, org_code);

//     res.json({ success: true, data });
//   } catch (error) {
//     console.error("❌ Fetch Projects Error:", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

import * as ProjectService from "../../services/projectManagement/projectService.js";

/* ================= CREATE PROJECT ================= */
export const assignProject = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const payload = {
      ...req.body,
      assigned_date: new Date(),
    };

    const data = await ProjectService.createProjectService(payload, org_code);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data,
    });
  } catch (error) {
    console.error("❌ Create Project Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL PROJECTS ================= */
export const getAllProjects = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const data = await ProjectService.getAllProjectsService(org_code);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Get Projects Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateProjectStatus = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const payload = {
      project_management_id: req.body.project_management_id,
      department: req.body.department,
      status: req.body.status, // ENUM: PENDING | APPROVED | REJECTED
      comments: req.body.comments,
      updated_by: req.body.updated_by || req.user.username,
    };

    const data = await ProjectService.updateProjectStatusService(
      payload,
      org_code,
    );

    res.json({
      success: true,
      message: "Status updated successfully",
      data,
    });
  } catch (error) {
    console.error("❌ Update Status Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET STATUS HISTORY ================= */
export const getProjectStatus = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { project_id } = req.params;

    const data = await ProjectService.getProjectStatusService(
      project_id,
      org_code,
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Get Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPSERT WORKFLOW ================= */
export const upsertProjectWorkflow = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const payload = {
      project_id: req.params.project_id,
      workflow: req.body.workflow, // [{ department, sequence }]
    };

    const data = await ProjectService.upsertProjectWorkflowService(
      payload.project_id,
      payload.workflow,
      org_code,
    );

    res.json({
      success: true,
      message: "Workflow updated successfully",
      data,
    });
  } catch (error) {
    console.error("❌ Upsert Workflow Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectWorkflow = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { project_id } = req.params;

    const data = await ProjectService.getProjectWorkflowService(
      project_id,
      org_code,
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Fetch Workflow Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




export const getNextDepartmentController = async (req, res) => {
  try {
    const org_code = req.user.org_code; // assuming auth middleware
    const { project_id, current_department } = req.params;

    if (!project_id || !current_department) {
      return res.status(400).json({
        success: false,
        message: "project_id and current_department are required",
      });
    }

    const nextDept = await ProjectService.fetchNextDepartment(
      project_id,
      current_department,
      org_code,
    );

    return res.status(200).json({
      success: true,
      data: nextDept,
    });
  } catch (error) {
    console.error("Get Next Department Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getProjectByBDId = async (req, res) => {
  try {
    const { bd_request_id } = req.params;
    const org_code = req.user.org_code;

    const project = await ProjectService.getProjectByBDIdService(
      bd_request_id,
      org_code,
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found for this BD request",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("❌ Fetch Project Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= FETCH PROJECTS FOR DEPARTMENT ================= */
export const fetchProjectsForDepartment = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { department } = req.params;

    const data = await ProjectService.fetchProjectsForDepartmentService(
      department,
      org_code,
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Fetch Projects Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};