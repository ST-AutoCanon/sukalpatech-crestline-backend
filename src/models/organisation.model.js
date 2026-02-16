// // models/organisation.model.js
// import db from "../config/dborg.js";

// /* Get last organisation id */
// export const getLastOrgId = async () => {
//   const result = await db.query(
//     "SELECT id FROM master.organisations ORDER BY id DESC LIMIT 1",
//   );

//   return result.rows[0]?.id || 0;
// };

// /* Insert organisation */
// export const createOrganisation = async (name, schemaName, org_code) => {
//   const result = await db.query(
//     `INSERT INTO master.organisations(name, schema_name,org_code)
//      VALUES ($1, $2 ,$3)
//      RETURNING *`,
//     [name, schemaName, org_code],
//   );

//   return result.rows[0];
// };

// /* Create Schema */
// export const createOrgSchema = async (schemaName) => {
//   await db.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
// };

// /* Copy Template Tables */
// export const copyTemplateTables = async (schemaName) => {
//   const templateTables = [
//     "app_employees",
//     "departments",
//     "employee_departments",
//     "root_categories",
//     "categories",
//     "products",
//     "variants",
//     "sub_variants",
//     "items",
//     "vendors",
//     "items_suppliers",
//     "purchase_requests",
//     "purchase_items",
//     "item_vendors",
//     "vendor_attachments",
//     "vendor_comments",
//     "business_development",
//   ];

//   for (const table of templateTables) {
//     await db.query(`
//       CREATE TABLE ${schemaName}.${table}
//       (LIKE org_template.${table} INCLUDING ALL)
//     `);
//   }
// };

// /* Get all organisations */
// export const getOrganisations = async () => {
//   const result = await db.query(
//     "SELECT * FROM master.organisations ORDER BY id",
//   );

//   return result.rows;
// };

// models/organisation.model.js
import db from "../config/dborg.js";

/* Get last organisation id */
export const getLastOrgId = async (client) => {
  const result = await client.query(
    "SELECT id FROM master.organisations ORDER BY id DESC LIMIT 1",
  );

  return result.rows[0]?.id || 0;
};

/* Insert organisation */
export const createOrganisation = async (
  client,
  name,
  schemaName,
  org_code,
) => {
  const result = await client.query(
    `
    INSERT INTO master.organisations(name, schema_name, org_code)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, schemaName, org_code],
  );

  return result.rows[0];
};

/* Create Schema */
export const createOrgSchema = async (client, schemaName) => {
  await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
};

/* Copy Template Tables */
export const copyTemplateTables = async (client, schemaName) => {
  const templateTables = [
    "app_employees",
    "org_users",
    "departments",
    "employee_departments",
    "root_categories",
    "categories",
    "products",
    "variants",
    "sub_variants",
    "items",
    "vendors",
    "items_suppliers",
    "purchase_requests",
    "purchase_items",
    "item_vendors",
    "vendor_attachments",
    "vendor_comments",
    "business_development",
  ];

  for (const table of templateTables) {
    await client.query(`
      CREATE TABLE ${schemaName}.${table}
      (LIKE org_template.${table} INCLUDING ALL)
    `);
  }
};

/* Get all organisations (READ ONLY → pool is fine) */
export const getOrganisations = async () => {
  const result = await db.query(
    "SELECT * FROM master.organisations ORDER BY id",
  );

  return result.rows;
};

/* Create admin employee */
// export const createOrgAdmin = async (
//   client,
//   schemaName,
//   admin
// ) => {
//   const {
//     sts_employee_id,
//     first_name,
//     last_name,
//     email,
//     org_code,
//   } = admin;

//   await client.query(
//     `
//     INSERT INTO ${schemaName}.app_employees
//     (sts_employee_id, first_name, last_name, email, role, permissions, org_code)
//     VALUES ($1, $2, $3, $4, 'admin', ARRAY['*'], $5)
//     `,
//     [sts_employee_id, first_name, last_name, email, org_code]
//   );
// };

/* Insert default departments while creating org */
export const insertDefaultDepartments = async (
  client,
  schemaName,
  departments, // array of department names
) => {
  if (!departments || departments.length === 0) return;

  for (const dept of departments) {
    await client.query(
      `
      INSERT INTO ${schemaName}.departments (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      `,
      [dept],
    );
  }
};

/* Create org admin user (AUTH TABLE) */
export const createOrgAdmin = async (client, schemaName, admin) => {
  const { first_name, last_name, email, org_code } = admin;

  // 🔐 Static hashed password for now
  const password =
    "$2b$10$7WNEDjohk7W5RUwCozXkKuYYKOkJsIi1MCcBCybQlAWXcEYHRceQ2";
  await client.query(
    `
    INSERT INTO ${schemaName}.org_users
      (first_name, last_name, email, password, role, status, org_code)
    VALUES
      ($1, $2, $3, $4, 'admin', 'active', $5)
    `,
    [first_name, last_name, email, password, org_code],
  );
};

/* Add department */
export const insertDepartment = async (client, schemaName, department_name) => {
  await client.query(
    `
    INSERT INTO ${schemaName}.departments (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    `,
    [department_name],
  );
};

/* Remove department */
export const deleteDepartment = async (client, schemaName, department_name) => {
  await client.query(
    `
    DELETE FROM ${schemaName}.departments
    WHERE name = $1
    `,
    [department_name],
  );
};

export const getAllOrgCodes = async () => {
  const result = await db.query(
    `
    SELECT org_code
    FROM master.organisations
    ORDER BY org_code ASC
    `,
  );

  return result.rows;
};