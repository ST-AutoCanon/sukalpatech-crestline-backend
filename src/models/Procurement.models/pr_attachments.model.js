// src/models/prAttachments.model.js
import pool from "../../config/db.js";

export const addPRAttachment = async (data) => {
  const query = `
    INSERT INTO pr_attachments
      (pr_id, file_name, file_path, uploaded_by,quotation_validity_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [
    data.pr_id,
    data.file_name,
    data.file_path,
    data.uploaded_by,
    data.quotation_validity_date,
  ]);
  return result.rows[0];
};

export const getPRAttachmentsByPR = async (pr_id) => {
  const result = await pool.query(
    `SELECT * FROM pr_attachments WHERE pr_id = $1 ORDER BY attachment_id`,
    [pr_id]
  );
  return result.rows;
};
