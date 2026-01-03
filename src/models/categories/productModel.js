import thirdDB from "../../config/dbThird.js";

export async function getLastProductCode() {
  const result = await thirdDB.query(
    "SELECT code FROM products ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.code || null;
}

export async function insertProduct(code, name, category_id) {
  const result = await thirdDB.query(
    `INSERT INTO products(code, name, category_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, category_id]
  );
  return result.rows[0];
}

export async function getProductsByCategory(category_id) {
  const result = await thirdDB.query(
    "SELECT id, code, name FROM products WHERE category_id=$1 AND is_active=true ORDER BY id",
    [category_id]
  );
  return result.rows;
}
