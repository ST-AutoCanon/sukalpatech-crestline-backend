import {
  fetchProjectsForAssignedManager,
  fetchProjectsForProjectManager,
  upsertProjectStatus,
  getProjectStatuses,
  getProjectWorkflow,
  getNextDepartment,
  findProjectById,
  createProject,
  assignManager,
  getProjectManagers,
  getPendingProjectsModel,
  saveDepartmentTasksModel,
  getProjectTasksModel,
  getDashboardTaskStatsModel,
  getWorkflowSummaryModel,
  getDepartmentDetailsModel,
  getAllProjectWorkflowModel,
  getActiveProjectsModel
  
} from "../../models/projectManagement/ProjectManagerModal.js";

export const createProjectService = async (data) => {
  return await createProject(data);
};

/* ================= GET PROJECTS ================= */

export const getProjectManagersService = async (
  org_code
) => {
  return await getProjectManagers(org_code);
};

export const getPendingProjectsService = async (org_code) => {
  return await getPendingProjectsModel(org_code);
};

export const getAssignedProjectsService = async (org_code) => {
  return await fetchProjectsForProjectManager(org_code);
};

/* ================= GET SINGLE PROJECT ================= */

export const getProjectByIdService = async (
  project_id,
  org_code
) => {
  return await findProjectById(project_id, org_code);
};

/* ================= UPDATE PROJECT STATUS ================= */

export const updateProjectStatusService = async (
  data,
  org_code
) => {
  return await upsertProjectStatus(data, org_code);
};

/* ================= GET PROJECT STATUS HISTORY ================= */

export const getProjectStatusHistoryService = async (
  project_id,
  org_code
) => {
  return await getProjectStatuses(project_id, org_code);
};

/* ================= GET WORKFLOW ================= */

export const getWorkflowService = async (
  project_id,
  org_code
) => {
  return await getProjectWorkflow(project_id, org_code);
};

/* ================= NEXT DEPARTMENT ================= */

export const getNextDepartmentService = async (
  project_id,
  current_department,
  org_code
) => {
  return await getNextDepartment(
    project_id,
    current_department,
    org_code
  );
};

////////PM A/////////

export const assignManagerService = async (
  projectId,
  assigned_project_manager,
   assigned_by,
  org_code
) => {
  return await assignManager(
    projectId,
    assigned_project_manager,
     assigned_by,
    org_code
  );
};
export const getProjectsForAssignedManagerService = async (
  org_code,
  first_name
) => {
  return await fetchProjectsForAssignedManager(
    org_code,
    first_name
  );
};

export const saveDepartmentTasksService = async (
  projectId,
  tasks,
  assignedBy,
  org_code
) => {
  return await saveDepartmentTasksModel(
    projectId,
    tasks,
    assignedBy,
    org_code
  );
};

export const getProjectTasksService = async (
  projectId,
  org_code
) => {
  return await getProjectTasksModel(
    projectId,
    org_code
  );
};
export const getDashboardTaskStatsService = async (org_code, first_name) => {
  return await getDashboardTaskStatsModel(org_code, first_name);
};

export const getWorkflowSummaryService = async (
  org_code
) => {
  return await getWorkflowSummaryModel(org_code);
};

export const getDepartmentDetailsService = async (
  org_code,
  department
) => {

  return await getDepartmentDetailsModel(org_code, department);
};


export const getAllProjectWorkflowService = async (org_code) => {
  try {
    const data = await getAllProjectWorkflowModel(org_code);
    return data;
  } catch (error) {
    console.error("Service Error - getAllProjectWorkflow:", error);
    throw error;
  }
};

export const getActiveProjectsService = async (
  org_code
) => {
  return await getActiveProjectsModel(org_code);
};