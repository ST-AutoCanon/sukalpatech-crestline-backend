import thirdDB from "../config/dbfirst.js";

export const findAppUserBySTSId = async (stsId) => {
  const result = await thirdDB.query(
    `SELECT * FROM app_employees WHERE sts_employee_id = $1`,
    [stsId]
  );
  return result.rows[0];
};

export const createAppUser = async (data) => {
  const query = `
    INSERT INTO app_employees 
      (sts_employee_id, first_name, last_name, email, role, permissions, department_id,category)
    VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    RETURNING *
  `;

  const result = await pool.query(query, [
    data.sts_employee_id,
    data.first_name,
    data.last_name,
    data.email,
    data.role,
    data.permissions,
    data.department_id,
    data.category
  ]);

  return result.rows[0];
};

export const getAllEmployees = async () => {
  const result = await thirdDB.query(`SELECT * FROM app_employees ORDER BY id`);
  return result.rows;
};

//update category
export const updateEmployeeCategory = async (employeeId, category) => {
  const query = `
    UPDATE app_employees
    SET category = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await thirdDB.query(query, [category, employeeId]);
  return result.rows[0];
};