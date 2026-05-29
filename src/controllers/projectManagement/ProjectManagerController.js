import {
  getAssignedProjectsService,
  getProjectByIdService,
  updateProjectStatusService,
  getProjectStatusHistoryService,
  getWorkflowService,
  getNextDepartmentService,
  createProjectService
} from "../../services/projectManagement/ProjectManagerService.js";

/* ================= GET ASSIGNED PROJECTS ================= */

export const assignProjectToProjectManager = async (req, res) => {
  try {
    const {
      bd_request_id,
      description,
      required_date,
      current_department
    } = req.body;

   const created = await createProjectService({
  bd_request_id,
  description,
  required_date,
  assigned_date: new Date(), // ✅ save assigned date
  assigned_by: req.user.first_name, // ✅ save assigned by
  org_code: req.user.org_code,
  current_department: "PROJECT_MANAGER", // ✅ save current department
});

    return res.status(201).json({
      success: true,
      data: created
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Assignment failed"
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