// models/admin.model.js
import thirdDB from "../config/dborg.js";
import { getSchemaFromOrgCode } from "./getSchemaFromOrgCode.js";

/* ================= CREATE ================= */
export const createEmployeeModel = async (data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const { first_name, last_name, email, password, role, status } = data;

  const result = await thirdDB.query(
    `INSERT INTO ${schema}.org_users
     (first_name, last_name, email, password, role, status, org_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, first_name, last_name, email, role, status, created_at`,
    [
      first_name,
      last_name,
      email,
      password,
      role || "employee",
      status || "active",
      orgCode,
    ],
  );

  return result.rows[0];
};

/* ================= GET ALL ================= */
export const getAllEmployeesModel = async (orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const result = await thirdDB.query(
    `SELECT id, first_name, last_name, email, role, status, created_at
     FROM ${schema}.org_users
     WHERE role = $1
     ORDER BY created_at DESC`,
    ["employee"],
  );

  return result.rows;
};

/* ================= UPDATE ================= */
export const updateEmployeeModel = async (id, data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const { first_name, last_name, role, status } = data;

  const result = await thirdDB.query(
    `UPDATE ${schema}.org_users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         role       = COALESCE($3, role),
         status     = COALESCE($4, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, first_name, last_name, email, role, status, updated_at`,
    [first_name, last_name, role, status, id],
  );

  return result.rows[0];
};

/* ================= DELETE ================= */
export const deleteEmployeeModel = async (id, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const result = await thirdDB.query(
    `DELETE FROM ${schema}.org_users
     WHERE id = $1
     RETURNING id`,
    [id],
  );

  return result.rows[0];
};
