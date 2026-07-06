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
import NotificationService from "../../services/notification/NotificationService.js";
/* ================= CREATE PROJECT ================= */
export const assignProject = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const payload = {
  ...req.body,

  assigned_date: new Date(),

  // 🔥 ADD THIS (CRITICAL)
  current_department: "PROJECT_MANAGER",

  status: "ASSIGNED_TO_MANAGER",

  assigned_project_manager: req.body.assigned_project_manager,
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

export const updateAssignedToController = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;

    const project =
      await ProjectService.updateAssignedToService(
        id,
        assigned_to,
        req.user.org_code
      );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL PROJECTS ================= */
export const getAllProjects = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { status } = req.query;   // ✅ GET STATUS

    const data = await ProjectService.getAllProjectsService(org_code, status);

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
      status: req.body.status,
      comments: req.body.comments,
      completion_percentage:req.body.completion_percentage,
      updated_by: req.body.updated_by || req.user.username,
    };

    // ✅ 1. SAVE STATUS
    const data = await ProjectService.updateProjectStatusService(
      payload,
      org_code,
    );

    // ✅ 2. GET WORKFLOW (dynamic)
    const workflow = await ProjectService.getProjectWorkflowService(
      payload.project_management_id,
      org_code
    );

    const orderedWorkflow = workflow.sort((a, b) => a.sequence - b.sequence);

    const currentIndex = orderedWorkflow.findIndex(
      (w) => w.department === payload.department
    );

    const nextDept = orderedWorkflow[currentIndex + 1]?.department || null;
    const prevDept = orderedWorkflow[currentIndex - 1]?.department || null;

    // ✅ 3. PREPARE NOTIFICATION
   // ✅ GET PROJECT
const project = await ProjectService.getProjectByIdService(
  payload.project_management_id,
  org_code
);
console.log(project);

// ✅ NOTIFICATION
let title = "";
let message = "";
let recipient_role = "manager";

if (payload.status === "IN_PROGRESS") {
  recipient_role = "manager";

  title = "Project In Progress";

  message =  `${data.department} started working on Project ID ${data.project_management_id}`;
}


if (payload.status === "APPROVED") {
  recipient_role = "manager";

  title = "Project Approved";

  message = `Project ${project.bd_request_id} approved and moved to ${nextDept}`;
}

if (payload.status === "REJECTED") {
  recipient_role = "manager";

  title = "Project Rejected";

  message = `Project ${project.bd_request_id} rejected in ${payload.department}`;
}

if (payload.status === "PENDING") {
  recipient_role = "manager";

  title = "Project Pending";

  message = `Project ${project.bd_request_id} pending in ${payload.department}`;
}

    // ✅ 4. SEND NOTIFICATION (IMPORTANT)
    if (recipient_role) {
      await NotificationService.createNotification(
  {
    title,
    message,
    type: payload.status.toLowerCase(),
    recipient_role,
    related_bd_id: payload.project_management_id,
  },
  org_code
);
    }

    res.json({
  success: true,
  message: "Status updated successfully",
  data,
  workflowInfo: {
    current: payload.department,
    next: nextDept,
    previous: prevDept,
    status: payload.status,
  },
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
      workflow: req.body.workflow,
    };

    const data = await ProjectService.upsertProjectWorkflowService(
      payload.project_id,
      payload.workflow,
      org_code,
    );

    // ✅ AFTER SUCCESS → send notification
    const firstDepartment = payload.workflow
      .sort((a, b) => a.sequence - b.sequence)[0]?.department;

    if (firstDepartment) {
      await NotificationService.createNotification(
        {
          title: "New Project Assigned",
          message: `Project ${payload.project_id} assigned to ${firstDepartment}`,
          type: "info",
          recipient_role: "manager",
          related_bd_id: payload.project_id,
        },
        org_code
      );
    }

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
export const getProjectTasks = async (req, res) => {
  try {
    const data = await ProjectService.getProjectTasksService(
      req.params.projectId,
      req.user.org_code
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const org_code = req.user.org_code;

    console.log("ORG CODE:", org_code); // <-- add this

    const employees = await ProjectService.getEmployeesByDepartment(
      department,
      org_code
    );

    res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const assignEmployeeTasks = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const result = await ProjectService.assignEmployeeTasksService(
      req.body,
      org_code
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getEmployeeTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const org_code = req.user.org_code;

    const tasks = await ProjectService.fetchEmployeeTasks(
      projectId,
      org_code
    );

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Employee Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee tasks",
    });
  }
};