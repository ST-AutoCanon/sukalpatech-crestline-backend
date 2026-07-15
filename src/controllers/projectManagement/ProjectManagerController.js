import {
  getProjectsForAssignedManagerService,
  getAssignedProjectsService,
  getProjectByIdService,
  updateProjectStatusService,
  getProjectStatusHistoryService,
  getWorkflowService,
  getNextDepartmentService,
  createProjectService,
  assignManagerService,
  getProjectManagersService,
  getPendingProjectsService,
  saveDepartmentTasksService,
  getProjectTasksService,
  getDashboardTaskStatsService,
  getWorkflowSummaryService,
  getDepartmentDetailsService,
  getAllProjectWorkflowService,
  getActiveProjectsService,
  getManagersService,
  updateWorkflowTaskService,
  getProjectRequestDetailsService
} from "../../services/projectManagement/ProjectManagerService.js";
import NotificationService from "../../services/notification/NotificationService.js";

/* ================= GET ASSIGNED PROJECTS ================= */

export const assignProjectToProjectManager = async (req, res) => {
  try {
    const {
      bd_request_id,
      industry_type,
      description,
      required_date,
      current_department
    } = req.body;

    const safeRequiredDate = req.body.required_date?.split("T")[0];

   const created = await createProjectService({
  bd_request_id,
  industry_type,
  description,
  required_date: safeRequiredDate,
  assigned_date: new Date(),
  assigned_by: req.user.first_name, // ✅ save assigned by
  assigned_project_manager: req.body.assigned_project_manager, // ✅ ADD THIS
  org_code: req.user.org_code,
  current_department: "PROJECT_MANAGER",
});

console.log("📢 About to create notification");

await NotificationService.createNotification(
  {
    recipient_id: created.assigned_project_manager,
    recipient_role: "project_manager",
    title: "New Project Assigned",
    message: `Project ${created.id} has been assigned to project-manager`,
    type: "PROJECT_ASSIGNED",
    metadata: {
      project_id: created.id,
    },
  },
  req.user.org_code
);


    return res.status(201).json({
      success: true,
      data: created
    });

  } catch (err) {
  console.error(err);

  return res.status(400).json({
    success: false,
    message: err.message || "Assignment failed",
  });
}
};

export const getAssignedProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await getAssignedProjectsService(
        req.user.org_code
      );

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProjectManagers = async (
  req,
  res
) => {
  try {
    const org_code = req.user.org_code;

    const managers =
      await getProjectManagersService(
        org_code
      );

    return res.status(200).json({
      success: true,
      data: managers,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project managers",
    });
  }
};

export const getPendingProjects = async (req, res) => {
  try {
    const projects =
      await getPendingProjectsService(
        req.user.org_code
      );

    return res.status(200).json({
      success: true,
      data: projects,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE PROJECT ================= */

export const getProjectById = async (
  req,
  res
) => {
  try {
    const project =
      await getProjectByIdService(
        req.params.id,
        req.user.org_code
      );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

/* ================= UPDATE STATUS ================= */

export const updateProjectStatus = async (
  req,
  res
) => {
  try {
    const payload = {
      project_management_id: req.params.id,

      department: "PROJECT_MANAGER",

      status: req.body.status,

      comments: req.body.comments,

      updated_by: req.user.first_name,
    };

    const updated =
      await updateProjectStatusService(
        payload,
        req.user.org_code
      );

    await NotificationService.createNotification(
  {
    recipient_id: req.user.id,
    recipient_role: req.user.role,
    title: "Project Updated",
    message: `Project ${req.params.id} moved to ${req.body.status}`,
    type: "project_moved",
  },
  req.user.org_code
);

console.log("✅ Notification service called successfully");

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

/* ================= GET STATUS HISTORY ================= */

export const getProjectStatusHistory = async (
  req,
  res
) => {
  try {
    const history =
      await getProjectStatusHistoryService(
        req.params.id,
        req.user.org_code
      );

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};

/* ================= GET WORKFLOW ================= */

export const getWorkflow = async (
  req,
  res
) => {
  try {
    const workflow =
      await getWorkflowService(
        req.params.id,
        req.user.org_code
      );

    return res.status(200).json({
      success: true,
      data: workflow,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workflow",
    });
  }
};

/* ================= NEXT DEPARTMENT ================= */

export const getNextDepartmentController =
  async (req, res) => {
    try {
      const nextDepartment =
        await getNextDepartmentService(
          req.params.id,
          "PROJECT_MANAGER",
          req.user.org_code
        );

      return res.status(200).json({
        success: true,
        data: nextDepartment,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch next department",
      });
    }
  };
  //////////////PM A////////////

 export const assignManager = async (req, res) => {
  try {
    console.log("ASSIGN MANAGER API HIT");
    const { assigned_project_manager } = req.body;

    const updated = await assignManagerService(
      req.params.id,
      assigned_project_manager,
      req.user.first_name,
      req.user.org_code
    );

    // Notification for selected PM
    await NotificationService.createNotification(
      {
        recipient_role: "project_manager",
        title: "New Project Assigned",
        message: `Project ${updated.id} has been assigned to you`,
        type: "PROJECT_ASSIGNED",
        metadata: {
          project_id: updated.id,
          assigned_project_manager,
        },
      },
      req.user.org_code
    );

    // Notification for Project Manager dashboard
    await NotificationService.createNotification(
      {
        recipient_role: "project_manager",
        title: "Project Moved",
        message: `Project ${updated.id} moved to project_manager ${assigned_project_manager}`,
        type: "PROJECT_MOVED",
        metadata: {
          project_id: updated.id,
          assigned_project_manager,
        },
      },
      req.user.org_code
    );

    // New notification
await NotificationService.createNotification(
  {
    recipient_role: assigned_project_manager,
    title: "Project Assigned",
    message: `Project ${updated.id} assigned to manager`,
    type: "PROJECT_ASSIGNED_TO_MANAGER",
    metadata: {
      project_id: updated.id,
      assigned_project_manager,
    },
  },
  req.user.org_code
);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to assign manager",
    });
  }
};
export const getProjectsForAssignedManager = async (req, res) => {
  try {
    const firstName = req.user.first_name.toLowerCase();

    console.log("Logged user:", firstName);

    const projects = await getProjectsForAssignedManagerService(
      req.user.org_code,
      firstName
    );

    console.log("Assigned Projects:", projects);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
export const saveDepartmentTasks = async (
  req,
  res
) => {
  try {
     console.log("SAVE TASK API HIT");
    const { projectId } = req.params;
    const { tasks } = req.body;

    await saveDepartmentTasksService(
      projectId,
      tasks,
      req.user.first_name,
       req.user.org_code
    );

    return res.status(200).json({
      success: true,
      message: "Tasks saved successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save tasks",
    });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await getProjectTasksService(
      projectId,
      req.user.org_code
    );

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const getDashboardTaskStats = async (req, res) => {
  try {
    const data = await getDashboardTaskStatsService(
      req.user.org_code,
      req.user.first_name
    );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to load task dashboard",
      error: err.message,
    });
  }
};

export const getWorkflowSummary = async (
  req,
  res
) => {
  try {
    const data =
      await getWorkflowSummaryService(
        req.user.org_code
      );

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const getDepartmentDetails = async (req, res) => {
  try {
    const { department } = req.params;

    const data = await getDepartmentDetailsService(
      req.user.org_code,
      department
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getDepartmentDetails Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllProjectWorkflowController = async (req, res) => {
  try {
    const org_code = req.user?.org_code;

    const data = await getAllProjectWorkflowService(org_code);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Controller Error - getAllProjectWorkflow:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all project workflows",
    });
  }
};

export const getActiveProjects = async (req, res) => {
  try {
    const data = await getActiveProjectsService(
      req.user.org_code
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ACTIVE PROJECT ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active projects",
      error: error.message,
    });
  }
};


export const getManagers = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const managers = await getManagersService(org_code);

    return res.status(200).json({
      success: true,
      data: managers,
    });

  } catch (error) {
    console.error("getManagers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch managers",
    });
  }
};
export const updateWorkflowTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const updated = await updateWorkflowTaskService(
      projectId,
      taskId,
      req.body,
      req.user.first_name,
      req.user.org_code
    );

    return res.status(200).json({
      success: true,
      message: "Workflow task updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectRequestDetailsController = async(req,res)=>{

   const data = await getProjectRequestDetailsService(
      req.params.projectId,
      req.user.org_code
   );

   res.json({
      success:true,
      data
   });
}