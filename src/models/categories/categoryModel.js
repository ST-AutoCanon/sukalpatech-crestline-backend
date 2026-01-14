import thirdDB from "../../config/dbfirst.js";

export async function getLastCategoryCode() {
  const result = await thirdDB.query(
    "SELECT code FROM categories ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.code || null;
}

export async function insertCategory(code, name, root_category_id) {
  const result = await thirdDB.query(
    `INSERT INTO categories(code, name, root_category_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, root_category_id]
  );
  return result.rows[0];
}

export async function getCategoriesByRoot(root_id) {
  const result = await thirdDB.query(
    "SELECT id, code, name FROM categories WHERE root_category_id=$1 AND is_active=true ORDER BY id",
    [root_id]
  );
  return result.rows;
}
