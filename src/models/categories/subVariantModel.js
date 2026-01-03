import thirdDB from "../../config/dbThird.js";

export async function getLastSubVariantCode() {
  const result = await thirdDB.query(
    "SELECT code FROM sub_variants ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.code || null;
}

export async function insertSubVariant(code, name, variant_id) {
  const result = await thirdDB.query(
    `INSERT INTO sub_variants(code, name, variant_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, variant_id]
  );
  return result.rows[0];
}

export async function getSubVariantsByVariant(variant_id) {
  const result = await thirdDB.query(
    "SELECT id, code, name FROM sub_variants WHERE variant_id=$1 AND is_active=true ORDER BY id",
    [variant_id]
  );
  return result.rows;
}