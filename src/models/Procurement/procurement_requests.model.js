// src/models/procurementRequests.model.js
import pool from "../../config/db.js";

export const createPR = async (data) => {
  const query = `
    INSERT INTO procurement_requests
      (pr_number, project_name, requested_by, requested_by_person, priority, required_delivery_date, remarks, status, requesting_department_id, requesting_department,quotationValidityDate)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;
  const result = await pool.query(query, [
    data.pr_number,
    data.project_name,
    data.requested_by,
    data.requested_by_person || null,
    data.priority,
    data.required_delivery_date,
    data.remarks,
    data.status || "draft",
    data.requesting_department_id || null,
    data.requesting_department || null, // NOW inserting department name
    data.quotationValidityDate || null,
  ]);
  return result.rows[0];
};


// Get all PRs with department ID
export const getAllProcurementRequests = async () => {
  const result = await pool.query(
    `SELECT * FROM procurement_requests ORDER BY pr_id DESC`
  );
  return result.rows;
};

// Get last PR number (no change needed)
export const getLastPRNumber = async () => {
  const result = await pool.query(
    `
    SELECT pr_number
    FROM procurement_requests
    WHERE pr_number LIKE $1
    ORDER BY pr_id DESC
    LIMIT 1
  `,
    [`PR-${new Date().getFullYear()}-%`]
  );
  return result.rows[0]?.pr_number || null;
};

// Get PR by ID (optional: join with department table to get name)
export const getPRById = async (pr_id) => {
  const result = await pool.query(
    `SELECT * FROM procurement_requests WHERE pr_id = $1`,
    [pr_id]
  );
  return result.rows[0];
};

// Update PR status
export const updatePRStatus = async (pr_id, status) => {
  const result = await pool.query(
    `UPDATE procurement_requests SET status = $1, updated_at = NOW() WHERE pr_id = $2 RETURNING *`,
    [status, pr_id]
  );
  return result.rows[0];
};



// Update PR main fields
export const updatePR = async (pr_id, data) => {
  const { project_name, priority, remarks } = data;

  const query = `
    UPDATE procurement_requests
    SET project_name = $1,
        priority = $2,
        remarks = $3,
        updated_at = NOW()
    WHERE pr_id = $4
    RETURNING *;
  `;

  const result = await pool.query(query, [project_name, priority, remarks, pr_id]);
  return result.rows[0];
};


export const deletePR = async (pr_id) => {
  const result = await pool.query(
    `DELETE FROM procurement_requests WHERE pr_id = $1`,
    [pr_id]
  );
  return result.rowCount;
};