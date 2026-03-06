// models/admin.model.js
import thirdDB from "../config/dborg.js";
import { getSchemaFromOrgCode } from "./getSchemaFromOrgCode.js";

/* ================= CREATE ================= */
export const createEmployeeModel = async (data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const { first_name, last_name, email, password, role, category,status } = data;

  const result = await thirdDB.query(
    `INSERT INTO ${schema}.org_users
     (first_name, last_name, email, password, role, status, category,org_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING id, first_name, last_name, email, role, status, category,created_at`,
    [
      first_name,
      last_name,
      email,
      password,
      role || "employee",
      status || "active",
      category,
      orgCode,
    ],
  );

  return result.rows[0];
};

/* ================= GET ALL ================= */
export const getAllEmployeesModel = async (orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  // const result = await thirdDB.query(
  //   `SELECT id, first_name, last_name, email, role, status,category, created_at
  //    FROM ${schema}.org_users
  //    WHERE role = $1
  //    ORDER BY created_at DESC`,
  //   ["employee"],
  // );
  const result = await thirdDB.query(
    `SELECT id, first_name, last_name, email, role, status, category, created_at
   FROM ${schema}.org_users
   WHERE role = ANY($1)
   ORDER BY created_at DESC`,
    [["employee", "manager"]],
  );

  return result.rows;
};

/* ================= UPDATE ================= */
export const updateEmployeeModel = async (id, data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const { first_name, last_name, email, role, status, category } = data;

  const result = await thirdDB.query(
    `UPDATE ${schema}.org_users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         email      = COALESCE($3, email),
         role       = COALESCE($4, role),
         status     = COALESCE($5, status),
         category   = COALESCE($6, category),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, first_name, last_name, email, role, status, category, updated_at`,
    [first_name, last_name, email, role, status, category, id]
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

export const updateEmployeeCategoryModel = async (
  employeeId,
  category,
  orgCode
) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const result = await thirdDB.query(
    `UPDATE ${schema}.org_users
     SET category = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, first_name, last_name, email, role, status, category`,
    [category, employeeId]
  );

  if (result.rowCount === 0) {
    throw new Error("Employee not found");
  }

  return result.rows[0];
};

