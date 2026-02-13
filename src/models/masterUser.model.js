// models/masterUser.model.js
import db from "../config/dborg.js";

export const findMasterUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM master.users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};
