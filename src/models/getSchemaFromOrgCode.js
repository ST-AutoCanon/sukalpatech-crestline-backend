import thirdDB from "../config/dborg.js";

export const getSchemaFromOrgCode = async (org_code) => {
  const query = `
    SELECT schema_name 
    FROM master.organisations
    WHERE org_code = $1
    LIMIT 1
  `;

  const result = await thirdDB.query(query, [org_code]);

  if (result.rows.length === 0) {
    throw new Error("Invalid Org Code");
  }

  return result.rows[0].schema_name;
};
