import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";


/* ================= CREATE PROJECT ================= */
export const createProject = async (data) => {
  const schema = await getSchemaFromOrgCode(data.org_code);

  const query = `
    INSERT INTO ${schema}.project_management
    (
      bd_request_id,
      description,
      required_date,
      assigned_date,
      assigned_by,
      assigned_to,
      assigned_project_manager,
      current_department,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
    RETURNING *
  `;

const values = [
  data.bd_request_id,
  data.description,
  data.required_date,
  data.assigned_date,
  data.assigned_by,
  data.assigned_to,
    data.assigned_project_manager,
  data.current_department,
];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};


export const getPendingProjectsModel = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE assigned_project_manager IS NULL
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query);

  return result.rows;
};

export const getProjectManagers = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT
      id,
      first_name,
      last_name,
      role
    FROM ${schema}.org_users
    WHERE role = 'project_manager'
    ORDER BY first_name
  `;

  const result = await thirdDB.query(query);

  return result.rows;
};
/* ================= FETCH PROJECTS ================= */
export const fetchProjectsForProjectManager = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE current_department = 'PROJECT_MANAGER'
      
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

export const fetchAllProjectsForProjectManager = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE current_department = 'PROJECT_MANAGER'
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

/* ================= FIND BY ID ================= */
export const findProjectById = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE id = $1
  `;

  const result = await thirdDB.query(query, [project_id]);
  return result.rows[0];
};

/* ================= UPSERT STATUS ================= */
export const upsertProjectStatus = async (data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.project_status_history
    (
      project_management_id,
      department,
      status,
      comments,
      updated_by,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,NOW())
    RETURNING *
  `;

  const values = [
    data.project_management_id,
    data.department,
    data.status,
    data.comments,
    data.updated_by,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/* ================= STATUS HISTORY ================= */
export const getProjectStatuses = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_status_history
    WHERE project_management_id = $1
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query, [project_id]);
  return result.rows;
};

/* ================= WORKFLOW ================= */
export const getProjectWorkflow = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_workflow
    WHERE project_management_id = $1
    ORDER BY sequence ASC
  `;

  const result = await thirdDB.query(query, [project_id]);
  return result.rows;
};

/* ================= NEXT DEPARTMENT ================= */
export const getNextDepartment = async (
  project_id,
  current_department,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_workflow
    WHERE project_management_id = $1
      AND sequence > (
        SELECT sequence
        FROM ${schema}.project_workflow
        WHERE project_management_id = $1
          AND department = $2
        LIMIT 1
      )
    ORDER BY sequence ASC
    LIMIT 1
  `;

  const result = await thirdDB.query(query, [
    project_id,
    current_department,
  ]);

  return result.rows[0] || null;
};

/////////PROJECTMANAGER A///////////

export const assignManager = async (
  projectId,
  assigned_project_manager,
  assigned_by,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
  UPDATE ${schema}.project_management
  SET 
    assigned_project_manager = LOWER($1),
    assigned_by = $2,
    assigned_date = NOW(),
    current_department = 'PROJECT_MANAGER'
  WHERE id = $3
  RETURNING *
`;

  const values = [
    assigned_project_manager,
    assigned_by,
    projectId
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};
export const fetchProjectsForAssignedManager = async (
  org_code,
  first_name
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE LOWER(assigned_project_manager) = LOWER($1)
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query, [first_name]);

  return result.rows;
};

export const saveDepartmentTasksModel = async (
  projectId,
  tasks,
  assignedBy,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  await thirdDB.query(
    `DELETE FROM ${schema}.project_department_tasks
     WHERE project_id = $1`,
    [projectId]
  );

  for (const task of tasks) {
    await thirdDB.query(
      `
      INSERT INTO ${schema}.project_department_tasks
      (
        project_id,
        department,
        task_description,
        assigned_by
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        projectId,
        task.department,
        task.task_description,
        assignedBy,
      ]
    );
  }

  return true;
};

export const getProjectTasksModel = async (
  projectId,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `
    SELECT *
    FROM ${schema}.project_department_tasks
    WHERE project_id = $1
    `,
    [projectId]
  );

  return result.rows;
};

export const getDashboardTaskStatsModel = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT
      COUNT(pw.id) AS total_tasks,

      COUNT(ps.id) FILTER (WHERE ps.status = 'APPROVED') AS completed_tasks,

      COUNT(ps.id) FILTER (WHERE ps.status = 'IN_PROGRESS') AS in_progress_tasks,

      COUNT(ps.id) FILTER (WHERE ps.status = 'PENDING') AS pending_tasks,

      COUNT(ps.id) FILTER (WHERE ps.status = 'REJECTED') AS rejected_tasks

    FROM ${schema}.project_workflow pw

    LEFT JOIN LATERAL (
      SELECT status, id
      FROM ${schema}.project_management_status ps
      WHERE ps.project_management_id = pw.project_management_id
        AND ps.department = pw.department
      ORDER BY ps.updated_at DESC
      LIMIT 1
    ) ps ON true
  `;

  const result = await thirdDB.query(query);
  return result.rows[0];
};
export const getWorkflowSummaryModel = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(`
SELECT DISTINCT ON (department)
       department,
       status,
       completion_percentage,
       updated_at
FROM ${schema}.project_management_status
ORDER BY department, updated_at DESC;
  `);

  return result.rows;
};

export const getDepartmentDetailsModel = async (org_code, department) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(`
    SELECT
      department,

      COUNT(*) AS total_tasks_assigned,
      SUM(estimated_days) AS total_estimated_days,

      MIN(start_date) AS start_date,
      MAX(due_date) AS due_date

    FROM ${schema}.project_workflow
    WHERE department = $1
    GROUP BY department
  `, [department]);

  return result.rows[0];
};

export const getAllProjectWorkflowModel = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(`
    SELECT
      pw.project_management_id,
      pm.bd_request_id,
      pw.task_title,
      pw.task_description,
      pw.department,
      pw.assigned_to,
      pw.priority,
      pw.start_date,
      pw.due_date,
      pw.estimated_days,
      pw.sequence,

      ps.status,
      ps.completion_percentage,
      ps.updated_at
   FROM ${schema}.project_workflow pw
INNER JOIN ${schema}.project_management pm
ON pm.id = pw.project_management_id
    LEFT JOIN LATERAL (
      SELECT *
      FROM ${schema}.project_management_status ps
      WHERE ps.department = pw.department
      ORDER BY ps.updated_at DESC
      LIMIT 1
    ) ps ON true
    ORDER BY pw.project_management_id, pw.sequence ASC;
  `);

  return result.rows;
};

export const getActiveProjectsModel = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(`
    SELECT
      pw.project_management_id,
      pw.task_title,
      pw.department,
      pw.due_date,
      ps.status,
      ps.completion_percentage
    FROM ${schema}.project_workflow pw

    LEFT JOIN LATERAL (
      SELECT status, completion_percentage
      FROM ${schema}.project_management_status ps
      WHERE ps.project_management_id = pw.project_management_id
        AND ps.department = pw.department
      ORDER BY ps.updated_at DESC
      LIMIT 1
    ) ps ON true

    WHERE ps.status = 'IN_PROGRESS'

    ORDER BY pw.due_date ASC
  `);

  return result.rows;
};

// services/userService.js or ProjectManagerService.js

export const getManagersModal = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `
    SELECT id, first_name, last_name, role
    FROM ${schema}.org_users
    WHERE role='manager'
      AND org_code = $1
    ORDER BY first_name ASC
    `,
    [org_code]
  );

  return result.rows;
};