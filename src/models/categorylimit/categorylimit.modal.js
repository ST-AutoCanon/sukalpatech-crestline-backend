// models/categorylimit.model.js
import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../../models/getSchemaFromOrgCode.js";


export const addCategoryLimit = async (org_code, limits) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.category_limit (high, medium, low)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    limits.high,
    limits.medium,
    limits.low,
  ]);

  return result.rows[0];
};

export const updateCategoryLimit = async (org_code, limits) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.category_limit
    SET high = $1,
        medium = $2,
        low = $3,
        updated_at = NOW()
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    limits.high,
    limits.medium,
    limits.low,
  ]);

  if (result.rowCount === 0) {
    throw new Error("No category limit exists to update");
  }

  return result.rows[0];
};



export const getCategoryLimit = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT high, medium, low
    FROM ${schema}.category_limit
    LIMIT 1
  `;

  const result = await thirdDB.query(query);

  if (result.rowCount === 0) {
    return null; // no limits configured yet
  }

  return result.rows[0];
};

export const getApprovalLimitByCategory = async (category, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const result = await thirdDB.query(
    `SELECT ${category.toLowerCase()} AS limit
     FROM ${schema}.category_limit
     LIMIT 1`
  );

  if (!result.rows.length) {
    throw new Error("Category limits not configured");
  }

  return result.rows[0].limit;
};
 