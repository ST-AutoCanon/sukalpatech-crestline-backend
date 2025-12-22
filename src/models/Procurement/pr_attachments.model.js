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


// Update attachment by attachment_id
export const updatePRAttachment = async (attachment_id, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setQuery = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const query = `
    UPDATE pr_attachments
    SET ${setQuery}, updated_at = NOW()
    WHERE attachment_id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, attachment_id]);
  return result.rows[0];
};

export const deletePRAttachmentsByPR = async (pr_id) => {
  await pool.query(`DELETE FROM pr_attachments WHERE pr_id = $1`, [pr_id]);
};
