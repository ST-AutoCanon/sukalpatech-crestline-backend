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
    "pr_finance_payment_details",
    "pr_order_details",
    "pr_store_receiving_details",
    "purchase_items",
    "item_vendors",
    "vendor_attachments",
    "vendor_comments",
    "business_development",
    "business_dev_2",
    "category_limit",
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


export const getAllOrgCodesAndNames = async () => {
  const result = await db.query(
    `
    SELECT org_code, name
    FROM master.organisations
    ORDER BY org_code ASC
    `,
  );

  return result.rows; // Each row will be { org_code: '...', name: '...' }
};

export const getAllDepartments = async () => {
  try {
    const result = await db.query(
      `SELECT id, name FROM master.departments ORDER BY name ASC`,
    );
    return result.rows; // [{id, name}, ...]
  } catch (error) {
    console.error("Departments Model Error:", error);
    throw new Error("Failed to fetch departments");
  }
};

export const updateOrganisation = async (client, id, name, admin) => {
  // Update master.organisations (org_code is NOT updated)
  const orgResult = await client.query(
    `
    UPDATE master.organisations
    SET 
      name = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [name, id],
  );

  const organisation = orgResult.rows[0];
  if (!organisation) return null;

  const schemaName = organisation.schema_name;

  // Update admin user inside org schema
  if (admin && admin.email) {
    await client.query(
      `
      UPDATE ${schemaName}.org_users
      SET 
        first_name = $1,
        last_name = $2,
        email = $3
      WHERE role = 'admin'
      `,
      [admin.first_name, admin.last_name, admin.email],
    );
  }

  return organisation;
};

export const getDepartments = async (client, schemaName) => {
  const result = await client.query(
    `SELECT name FROM ${schemaName}.departments`,
  );

  return result.rows; // [{ name: 'HR' }, ...]
};

export const deleteDepartments = async (client, schemaName, department_name) => {
  await client.query(
    `
    DELETE FROM ${schemaName}.departments
    WHERE name = $1
    `,
    [department_name],
  );
};

export const insertDepartments = async (
  client,
  schemaName,
  departmentNames,
) => {
  for (const name of departmentNames) {
    await client.query(
      `INSERT INTO ${schemaName}.departments (name)
       VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [name],
    );
  }
};

export const deleteOrganisation = async (client, id) => {
  // 1️⃣ Get organisation first
  const orgResult = await client.query(
    `SELECT * FROM master.organisations WHERE id = $1`,
    [id],
  );

  const organisation = orgResult.rows[0];
  if (!organisation) return null;

  const schemaName = organisation.schema_name;

  // Security validation
  if (!/^org_\d+$/.test(schemaName)) {
    throw new Error("Invalid schema name");
  }

  // 2️⃣ Drop the schema and everything inside it
  await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);

  // 3️⃣ Delete from master table
  const deleteResult = await client.query(
    `
    DELETE FROM master.organisations
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return deleteResult.rows[0];
};

/* Get Single Organisation By ID (for service layer) */
export const getOrganisationById = async (client, id) => {
  // 1️⃣ Get organisation from master table
  const orgResult = await client.query(
    `
    SELECT *
    FROM master.organisations
    WHERE id = $1
    `,
    [id]
  );

  const organisation = orgResult.rows[0];

  if (!organisation) return null;

  const schemaName = organisation.schema_name;

  // 2️⃣ Get admin user
  const adminResult = await client.query(
    `
    SELECT first_name, last_name, email
    FROM ${schemaName}.org_users
    WHERE role = 'admin'
    LIMIT 1
    `
  );

  const admin = adminResult.rows[0] || null;

  // 3️⃣ Get departments
  const deptResult = await client.query(
    `
    SELECT name
    FROM ${schemaName}.departments
    ORDER BY name ASC
    `
  );

  const departments = deptResult.rows.map((d) => d.name);

  return {
    ...organisation,
    admin,
    departments,
  };
};