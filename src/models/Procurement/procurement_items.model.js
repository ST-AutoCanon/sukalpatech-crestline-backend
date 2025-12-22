// src/models/procurementItems.model.js
import pool from "../../config/db.js";

// Add an item to a procurement request
export const addProcurementItem = async (data) => {
  const query = `
    INSERT INTO procurement_request_items
      (pr_id, item_code, item_name, specification, quantity_required, unit, expected_rate, reason)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;
  const result = await pool.query(query, [
    data.pr_id,
    data.item_code,
    data.item_name,
    data.specification,
    data.quantity_required,
    data.unit,
    data.expected_rate,
    data.reason,
  ]);
  return result.rows[0];
};

// Get items for a specific PR
export const getProcurementItemsByPR = async (pr_id) => {
  const result = await pool.query(
    `SELECT * FROM procurement_request_items WHERE pr_id = $1 ORDER BY item_id`,
    [pr_id]
  );
  return result.rows;
};


// Update an existing item by item_id
export const updateProcurementItem = async (item_id, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setQuery = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const query = `
    UPDATE procurement_request_items
    SET ${setQuery}
    WHERE item_id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, item_id]);
  return result.rows[0];
};

export const deleteProcurementItemsByPR = async (pr_id) => {
  await pool.query(`DELETE FROM procurement_request_items WHERE pr_id = $1`, [
    pr_id,
  ]);
};
