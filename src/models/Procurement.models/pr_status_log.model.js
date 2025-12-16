import pool from "../../config/db.js";

export const createPRStatusLog = async (data) => {
  const query = `
    INSERT INTO pr_status_log
      (pr_id, old_status, new_status, updated_by, department, note)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `;
  const result = await pool.query(query, [
    data.pr_id,
    data.old_status || null,
    data.new_status,
    data.updated_by,
    data.department,
    data.note || "",
  ]);

  return result.rows[0];
};

export const getPRStatusLogsByPR = async (pr_id) => {
  const result = await pool.query(
    `SELECT * FROM pr_status_log WHERE pr_id=$1 ORDER BY updated_at ASC`,
    [pr_id]
  );
  return result.rows;
};
