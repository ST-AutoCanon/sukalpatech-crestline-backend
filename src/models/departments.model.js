import thirdDB from "../config/dbfirst.js";

// ---------------- DEPARTMENTS ----------------
export const getDepartments = async () => {
  const result = await thirdDB.query(
    `SELECT * FROM departments ORDER BY department_id`
  );
  return result.rows;
};

export const createDepartment = async (name) => {
  const result = await thirdDB.query(
    `INSERT INTO departments (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
};

// ---------------- EMPLOYEES WITH DEPARTMENTS ----------------
export const getEmployeesWithDept = async () => {
  const result = await thirdDB.query(`
    SELECT 
      e.id, e.first_name, e.last_name, e.email, e.role,
      COALESCE(
        json_agg(
          json_build_object(
            'id', d.department_id,
            'name', d.name,
            'permission', ed.permission,
             'category', ed.category
          )
        ) FILTER (WHERE d.department_id IS NOT NULL), '[]'
      ) AS departments
    FROM app_employees e
    LEFT JOIN employee_departments ed ON e.id = ed.employee_id
    LEFT JOIN departments d ON ed.department_id = d.department_id
    GROUP BY e.id
    ORDER BY e.id;
  `);
  return result.rows;
};

//calls all employees of single department
export const getEmployeesByDepartment = async (departmentId) => {
  const result = await thirdDB.query(
    `
    SELECT 
      e.id, e.first_name, e.last_name, e.email, e.role,
      json_agg(
        json_build_object(
          'id', d.department_id,
          'name', d.name,
          'permission', ed.permission,
          'category', ed.category
        )
      ) AS departments
    FROM app_employees e
    JOIN employee_departments ed ON e.id = ed.employee_id
    JOIN departments d ON ed.department_id = d.department_id
    WHERE d.department_id = $1
    GROUP BY e.id
    ORDER BY e.id;
    `,
    [departmentId]
  );

  return result.rows;
};

// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
export const assignEmployeeDepartment = async (
  employeeId,
  departmentId,
  permission = null,
  category=null,
) => {
  const result = await thirdDB.query(
    `INSERT INTO employee_departments (employee_id, department_id, permission)
     VALUES ($1, $2, $3)
     ON CONFLICT (employee_id, department_id) DO UPDATE
     SET permission = EXCLUDED.permission,
     category = EXCLUDED.category
     RETURNING *`,
    [employeeId, departmentId, permission,category]
  );
  return result.rows[0];
};

export const unassignEmployeeDepartment = async (employeeId, departmentId) => {
  const result = await thirdDB.query(
    `DELETE FROM employee_departments
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId]
  );
  return result.rows[0];
};

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
export const assignOrUpdatePermission = async (
  employeeId,
  departmentId,
  permission,
  category
) => {
  const result = await thirdDB.query(
    `UPDATE employee_departments
     SET permission = $3
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId, permission,category]
  );
  return result.rows[0];
};

export const unassignPermission = async (employeeId, departmentId) => {
  const result = await thirdDB.query(
    `UPDATE employee_departments
     SET permission = NULL
     WHERE employee_id = $1 AND department_id = $2
     RETURNING *`,
    [employeeId, departmentId]
  );
  return result.rows[0];
};
