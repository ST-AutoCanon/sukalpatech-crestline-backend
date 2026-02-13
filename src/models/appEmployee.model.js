import thirdDB from "../config/dborg.js";
import { getSchemaFromOrgCode } from "./getSchemaFromOrgCode.js";
export const findAppUserBySTSId = async (stsId, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode); 
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.app_employees WHERE sts_employee_id = $1`,
    [stsId],
  );
  return result.rows[0];
};

export const createAppUser = async (data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode); 
  const query = `
    INSERT INTO ${schema}.app_employees 
      (sts_employee_id, first_name, last_name, email, role, permissions, department_id,org_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    data.sts_employee_id,
    data.first_name,
    data.last_name,
    data.email,
    data.role,
    data.permissions,
    data.department_id,
    data.org_code,
  ]);

  return result.rows[0];
};

export const getAllEmployees = async (orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);
  const result = await thirdDB.query(`SELECT * FROM ${schema}.app_employees ORDER BY id`);
  return result.rows;
};

// export const updateEmployeeById = async (id, data, orgCode) => {
//   const schema = await getSchemaFromOrgCode(orgCode);
//   const fields = [];
//   const values = [];
//   let index = 1;

//   for (const key in data) {
//     fields.push(`${key} = $${index}`);
//     values.push(data[key]);
//     index++;
//   }

//   if (fields.length === 0) return null;

//   const query = `
//     UPDATE ${schema}.app_employees
//     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
//     WHERE id = $${index}
//     RETURNING *
//   `;

//   values.push(id);

//   const result = await thirdDB.query(query, values);
//   return result.rows[0];
// };

export const updateEmployeeById = async (id, data, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);
  const fields = [];
  const values = [];
  let index = 1;

  const forbidden = ["id", "updated_at", "created_at"];

  for (const key in data) {
    if (forbidden.includes(key)) continue;

    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE ${schema}.app_employees
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};
