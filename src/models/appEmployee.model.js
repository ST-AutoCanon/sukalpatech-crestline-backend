import pool from "../config/db.js";

export const findAppUserBySTSId = async (stsId) => {
  const result = await pool.query(
    `SELECT * FROM app_employees WHERE sts_employee_id = $1`,
    [stsId]
  );
  return result.rows[0];
};

export const createAppUser = async (data) => {
  const query = `
    INSERT INTO app_employees 
      (sts_employee_id, first_name, last_name, email, role, permissions, department_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
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
  ]);

  return result.rows[0];
};


export const getAllEmployees = async () => {
  const result = await pool.query(`SELECT * FROM app_employees ORDER BY id`);
  return result.rows;
};
