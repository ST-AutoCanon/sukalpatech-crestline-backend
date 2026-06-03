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
      current_department,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
    RETURNING *
  `;

const values = [
  data.bd_request_id,
  data.description,
  data.required_date,
  data.assigned_date,
  data.assigned_by,
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
/* ================= FETCH PROJECTS ================= */
export const fetchProjectsForProjectManager = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE current_department = 'PROJECT_MANAGER'
      AND (
        assigned_project_manager IS NULL
        OR assigned_project_manager = ''
      )
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

export const assignManager = async (projectId, assigned_project_manager, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.project_management
    SET assigned_project_manager = LOWER($1)
    WHERE id = $2
    RETURNING *
  `;

  const values = [assigned_project_manager, projectId];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};
export const fetchProjectsForAssignedManager = async (org_code,role) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE LOWER(assigned_project_manager) = LOWER($1)
    ORDER BY created_at DESC
  `;

  const result = await thirdDB.query(query, [role]);

  return result.rows;
};