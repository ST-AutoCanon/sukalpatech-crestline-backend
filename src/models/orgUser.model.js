// models/orgUser.model.js
import thirdDB from "../config/dborg.js";
import { getSchemaFromOrgCode } from "./getSchemaFromOrgCode.js";

export const findOrgUserByEmail = async (email, orgCode) => {
  const schema = await getSchemaFromOrgCode(orgCode);

  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.org_users WHERE email = $1`,
    [email],
  );

  return result.rows[0];
};
