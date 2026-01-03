import thirdDB from "../../config/dbThird.js";

export async function getLastRootCategoryCode() {
  const result = await thirdDB.query(
    "SELECT code FROM root_categories ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.code || null;
}

export async function insertRootCategory(code, name) {
  const result = await thirdDB.query(
    `INSERT INTO root_categories(code, name)
     VALUES ($1,$2)
     RETURNING *`,
    [code, name]
  );
  return result.rows[0];
}


// Get all active root categories
export async function getAllRootCategories() {
  const result = await thirdDB.query(
    "SELECT id, code, name FROM root_categories WHERE is_active = true ORDER BY id"
  );
  return result.rows;
}