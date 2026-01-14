// import thirdDB from "../../config/dbThird.js";

// export async function getLastVariantCode() {
//   const result = await thirdDB.query(
//     "SELECT code FROM variants ORDER BY id DESC LIMIT 1"
//   );
//   return result.rows[0]?.code || null;
// }

// export async function insertVariant(code, name, category_id) {
//   const result = await thirdDB.query(
//     `INSERT INTO variants(code, name, category_id)
//      VALUES ($1,$2,$3)
//      RETURNING *`,
//     [code, name, category_id]
//   );
//   return result.rows[0];
// }

// export async function getVariantsByCategory(category_id) {
//   const result = await thirdDB.query(
//     "SELECT id, code, name FROM variants WHERE category_id=$1 AND is_active=true ORDER BY id",
//     [category_id]
//   );
//   return result.rows;
// }

import thirdDB from "../../config/dbfirst.js";

export async function getLastVariantCode() {
  const result = await thirdDB.query(
    "SELECT code FROM variants ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.code || null;
}

export async function insertVariant(code, name, product_id) {
  const result = await thirdDB.query(
    `INSERT INTO variants(code, name, product_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, product_id]
  );
  return result.rows[0];
}

export async function getVariantsByProduct(product_id) {
  const result = await thirdDB.query(
    "SELECT id, code, name FROM variants WHERE product_id=$1 AND is_active=true ORDER BY id",
    [product_id]
  );
  return result.rows;
}
