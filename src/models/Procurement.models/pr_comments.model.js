import pool from "../../config/db.js";

// Add a comment to a PR
export const addPRComment = async (data) => {
  const query = `
    INSERT INTO pr_comments
      (pr_id, commented_by, department, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await pool.query(query, [
    data.pr_id,
    data.commented_by,
    data.department,
    data.comment,
  ]);
  return result.rows[0];
};

// Get all comments for a specific PR
export const getPRCommentsByPR = async (pr_id) => {
  const result = await pool.query(
    `SELECT * FROM pr_comments WHERE pr_id = $1 ORDER BY comment_id`,
    [pr_id]
  );
  return result.rows;
};
