import secondDB from "../config/dbSecond.js";

export const findSTSUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM employees
    WHERE email = $1 AND status = 'Active'
  `;

  const result = await secondDB.query(query, [email]);
  return result.rows[0];
};
