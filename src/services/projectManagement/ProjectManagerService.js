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
  getPendingProjectsModel
  
} from "../../models/projectManagement/ProjectManagerModal.js";

export const createProjectService = async (data) => {
  return await createProject(data);
};

/* ================= GET PROJECTS ================= */

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
  org_code
) => {

  return await assignManager(
    projectId,
    assigned_project_manager,
    org_code
  );
};
export const getProjectsForAssignedManagerService = async (
  org_code,
  manager_name,role
) => {
  return await fetchProjectsForAssignedManager(
    org_code,
    manager_name,role
  );
};