import thirdDB from "../../config/dbfirst.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";
export async function getLastSubVariantCode(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT code FROM ${schema}.sub_variants ORDER BY id DESC LIMIT 1`
  );
  return result.rows[0]?.code || null;
}

export async function insertSubVariant(code, name, variant_id, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `INSERT INTO ${schema}.sub_variants(code, name, variant_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, variant_id]
  );
  return result.rows[0];
}

export async function getSubVariantsByVariant(variant_id, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT id, code, name FROM ${schema}.sub_variants WHERE variant_id=$1 AND is_active=true ORDER BY id`,
    [variant_id]
  );
  return result.rows;
}
