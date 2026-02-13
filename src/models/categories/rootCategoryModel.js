import thirdDB from "../../config/dbfirst.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";
export async function getLastRootCategoryCode(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT code FROM ${schema}.root_categories ORDER BY id DESC LIMIT 1`
  );
  return result.rows[0]?.code || null;
}

export async function insertRootCategory(code, name, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `INSERT INTO ${schema}.root_categories(code, name)
     VALUES ($1,$2)
     RETURNING *`,
    [code, name]
  );
  return result.rows[0];
}

// Get all active root categories
export async function getAllRootCategories(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT id, code, name FROM ${schema}.root_categories WHERE is_active = true ORDER BY id`
  );
  return result.rows;
}
