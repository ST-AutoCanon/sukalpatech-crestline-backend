// import * as ProjectModel from "../../models/projectManagement/projectModel.js";

// /* ================= CREATE PROJECT ================= */
// export const createProjectService = async (data, org_code) => {
//   if (!data.bd_request_id) {
//     throw new Error("bd_request_id is required");
//   }

//   // 🔥 Prevent duplicate
//   const existing = await ProjectModel.findProjectByBDId(
//     data.bd_request_id,
//     org_code,
//   );

//   if (existing) {
//     throw new Error("Project already exists for this BD request");
//   }

//   const payload = {
//     ...data,
//     assigned_date: data.assigned_date || new Date(),
//     // assigned_by: data.assigned_by || "SYSTEM",
//   };

//   return await ProjectModel.createProject(payload, org_code);
// };

// /* ================= GET ALL ================= */
// export const getAllProjectsService = async (org_code) => {
//   return await ProjectModel.fetchAllProjects(org_code);
// };

// /* ================= UPDATE DEPARTMENT STATUS ================= */
// export const updateProjectStatusService = async (data, org_code) => {
//   if (!data.project_management_id || !data.department) {
//     throw new Error("project_management_id and department are required");
//   }

//   return await ProjectModel.upsertProjectStatus(data, org_code);
// };

// /* ================= GET PROJECT STATUS ================= */
// export const getProjectStatusService = async (project_id, org_code) => {
//   return await ProjectModel.getProjectStatuses(project_id, org_code);
// };

// /* ================= UPSERT WORKFLOW ================= */
// export const upsertProjectWorkflowService = async (project_id, workflowArray, org_code) => {
//   if (!project_id || !Array.isArray(workflowArray) || workflowArray.length === 0) {
//     throw new Error("project_id and workflow array are required");
//   }
//   return await ProjectModel.upsertProjectWorkflow(project_id, workflowArray, org_code);
// };

// /* ================= FETCH PROJECTS FOR DEPARTMENT ================= */
// export const fetchProjectsForDepartmentService = async (department, org_code) => {
//   if (!department) throw new Error("department is required");
//   return await ProjectModel.fetchProjectsForDepartment(department, org_code);
// };

import * as ProjectModel from "../../models/projectManagement/projectModel.js";

/* ================= CREATE PROJECT ================= */
export const createProjectService = async (data, org_code) => {
  if (!data.bd_request_id) throw new Error("bd_request_id is required");

  const existing = await ProjectModel.findProjectByBDId(
    data.bd_request_id,
    org_code,
  );

  if (existing) throw new Error("Project already exists");

  return await ProjectModel.createProject(
    {
      ...data,
      assigned_date: data.assigned_date || new Date(),
      assigned_by: data.assigned_by || "SYSTEM",
    },
    org_code,
  );
};

export const updateAssignedToService = async (
  projectId,
  assigned_to,
  org_code
) => {
  return await ProjectModel.updateAssignedTo(
    projectId,
    assigned_to,
    org_code
  );
};

/* ================= GET ALL ================= */
export const getAllProjectsService = async (org_code, status) => {
  return await ProjectModel.fetchAllProjects(org_code, status);
};
/* ================= UPDATE STATUS ================= */
export const updateProjectStatusService = async (data, org_code) => {
  if (!data.project_management_id || !data.department || !data.status) {
    throw new Error("Missing required fields");
  }

  const allowed = ["IN_PROGRESS","PENDING", "APPROVED", "REJECTED"];
  if (!allowed.includes(data.status)) {
    throw new Error("Invalid status");
  }

  return await ProjectModel.upsertProjectStatus(data, org_code);
};

/* ================= STATUS HISTORY ================= */
export const getProjectStatusService = async (project_id, org_code) => {
  return await ProjectModel.getProjectStatuses(project_id, org_code);
};

/* ================= WORKFLOW ================= */
export const upsertProjectWorkflowService = async (
  project_id,
  workflowArray,
  org_code,
) => {
  if (!project_id || !Array.isArray(workflowArray)) {
    throw new Error("Invalid workflow data");
  }

  return await ProjectModel.upsertProjectWorkflow(
    project_id,
    workflowArray,
    org_code,
  );
};

export const getProjectWorkflowService = async (project_id, org_code) => {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  return await ProjectModel.getProjectWorkflow(project_id, org_code);
};

export const getProjectByBDIdService = async (bd_request_id, org_code) => {
  if (!bd_request_id) {
    throw new Error("bd_request_id is required");
  }

  const project = await ProjectModel.findProjectByBDId1(bd_request_id, org_code);

  return project; // can be null
};

/* ================= GET PROJECT BY ID ================= */
export const getProjectByIdService = async (
  project_id,
  org_code,
) => {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  return await ProjectModel.findProjectById(
    project_id,
    org_code,
  );
};

export const fetchNextDepartment = async (
  project_id,
  current_department,
  org_code,
) => {
  const nextDept = await ProjectModel.getNextDepartment(
    project_id,
    current_department,
    org_code,
  );

  return nextDept;
};

/* ================= DEPARTMENT VIEW ================= */
export const fetchProjectsForDepartmentService = async (
  department,
  org_code,
) => {
  if (!department) throw new Error("department is required");

  return await ProjectModel.fetchProjectsForDepartment(department, org_code);
};   

export const getProjectTasksService = async (
  projectId,
  org_code
) => {
  return await ProjectModel.getProjectTasks(
    projectId,
    org_code
  );
};

export const getEmployeesByDepartment = async (
  department,
  org_code
) => {
  return await ProjectModel.getEmployeesByDepartment(
    department,
    org_code
  );
};

export const assignEmployeeTasksService = async (
  data,
  org_code
) => {
  return await ProjectModel.assignEmployeeTasks(
    data,
    org_code
  );
};

export const fetchEmployeeTasks = async (projectId, org_code) => {
  return await ProjectModel.getEmployeeTasksByProject(
    projectId,
    org_code
  );
};