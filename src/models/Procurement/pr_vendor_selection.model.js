// src/models/prVendorSelection.model.js
import pool from "../../config/db.js";

// Add single vendor for a PR
export const addPRVendorSelection = async (data) => {
  const query = `
    INSERT INTO pr_vendor_selection (pr_id, vendor_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [data.pr_id, data.vendor_id]);
  return result.rows[0];
};

// Add multiple vendors for a PR
export const addMultiplePRVendors = async (pr_id, vendorIds = []) => {
  if (!vendorIds.length) return;

  const inserts = vendorIds.map((vendor_id) =>
    pool.query(
      `INSERT INTO pr_vendor_selection (pr_id, vendor_id)
       VALUES ($1, $2)`,
      [pr_id, vendor_id]
    )
  );

  await Promise.all(inserts);
};

// Get vendors linked to a PR
export const getPRVendorSelections = async (pr_id) => {
  const query = `
    SELECT pvs.id, v.vendor_id, v.vendor_name
    FROM pr_vendor_selection pvs
    JOIN vendors v ON v.vendor_id = pvs.vendor_id
    WHERE pvs.pr_id = $1
    ORDER BY pvs.id
  `;

  const result = await pool.query(query, [pr_id]);
  return result.rows;
};



// Update vendor selection by id
export const updatePRVendorSelection = async (id, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setQuery = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const query = `
    UPDATE pr_vendor_selection
    SET ${setQuery}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};


// Delete all vendors for a PR
export const deletePRVendorsByPR = async (pr_id) => {
  await pool.query("DELETE FROM pr_vendor_selection WHERE pr_id = $1", [pr_id]);
};
