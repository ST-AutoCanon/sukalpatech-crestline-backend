import thirdDB from "../config/dborg.js";
import { getSchemaFromOrgCode } from "./getSchemaFromOrgCode.js";

// ---------------- DEPARTMENTS ----------------
export const getDepartments = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.departments ORDER BY department_id`,
  );
  return result.rows;
};

export const createDepartment = async (name, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `INSERT INTO ${schema}.departments (name) VALUES ($1) RETURNING *`,
    [name],
  );
  return result.rows[0];
};

// ---------------- USERS WITH DEPARTMENTS ----------------
export const getEmployeesWithDept = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(`
    SELECT 
      e.id, e.first_name, e.last_name, e.email, e.role,
      COALESCE(
        json_agg(
          json_build_object(
            'id', d.department_id,
            'name', d.name,
            'permission', ed.permission
          )
        ) FILTER (WHERE d.department_id IS NOT NULL), '[]'
      ) AS departments
    FROM ${schema}.org_users e
    LEFT JOIN ${schema}.employee_departments ed ON e.id = ed.employee_id
    LEFT JOIN ${schema}.departments d ON ed.department_id = d.department_id
    GROUP BY e.id
    ORDER BY e.id;
  `);
  return result.rows;
};

// calls all users of single department
export const getEmployeesByDepartment = async (departmentId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `
    SELECT 
      e.id, e.first_name, e.last_name, e.email, e.role,
      json_agg(
        json_build_object(
          'id', d.department_id,
          'name', d.name,
          'permission', ed.permission
        )
      ) AS departments
    FROM ${schema}.org_users e
    JOIN ${schema}.employee_departments ed ON e.id = ed.employee_id
    JOIN ${schema}.departments d ON ed.department_id = d.department_id
    WHERE d.department_id = $1
    GROUP BY e.id
    ORDER BY e.id;
    `,
    [departmentId],
  );

  return result.rows;
};

// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
export const assignEmployeeDepartment = async (
  employeeId,
  departmentId,
  org_code,
  permission = null,
) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `INSERT INTO ${schema}.employee_departments (employee_id, department_id, permission)
     VALUES ($1, $2, $3)
     ON CONFLICT (employee_id, department_id) DO UPDATE
     SET permission = EXCLUDED.permission
     RETURNING *`,
    [employeeId, departmentId, permission],
  );
  return result.rows[0];
};

export const unassignEmployeeDepartment = async (
  employeeId,
  departmentId,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `DELETE FROM ${schema}.employee_departments
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId],
  );
  return result.rows[0];
};

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
export const assignOrUpdatePermission = async (
  employeeId,
  departmentId,
  permission,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `UPDATE ${schema}.employee_departments
     SET permission = $3
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId, permission],
  );
  return result.rows[0];
};

export const unassignPermission = async (
  employeeId,
  departmentId,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `UPDATE ${schema}.employee_departments
     SET permission = NULL
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId],
  );
  return result.rows[0];
};
