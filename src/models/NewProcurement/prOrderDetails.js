import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/**
 * Create Order Details (only if not exists)
 */
export const createOrderDetails = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.pr_order_details (
      purchase_request_id,
      selected_vendor_id,
      order_status,
      order_placed_at,
      expected_delivery_date,
      transport_mode,
      in_house_type,
      vendor_address,
      po_file_name,
      po_file_path,
      created_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *;
  `;

  const values = [
    data.purchase_request_id,
    data.selected_vendor_id || null,
    data.order_status || "NOT_PLACED",
    data.order_status === "PLACED" ? new Date() : null,
    data.expected_delivery_date || null,
    data.transport_mode || null,
    data.in_house_type || null,
    data.vendor_address || null,
    data.po_file_name || null,
    data.po_file_path || null,
    data.created_by || null,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/**
 * Update Order Details
 */
export const updateOrderDetails = async (
  purchase_request_id,
  data,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.pr_order_details
    SET
      selected_vendor_id = $1,
      order_status = $2,
      order_placed_at = $3,
      expected_delivery_date = $4,
      transport_mode = $5,
      in_house_type = $6,
      vendor_address = $7,
      po_file_name = $8,
      po_file_path = $9,
      updated_at = NOW()
    WHERE purchase_request_id = $10
    RETURNING *;
  `;

  const values = [
    data.selected_vendor_id || null,
    data.order_status || "NOT_PLACED",
    data.order_status === "PLACED" ? new Date() : null,
    data.expected_delivery_date || null,
    data.transport_mode || null,
    data.in_house_type || null,
    data.vendor_address || null,
    data.po_file_name || null,
    data.po_file_path || null,
    purchase_request_id,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/**
 * Get Order Details by PR ID
 */
export const getOrderDetailsByPR = async (purchase_request_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.pr_order_details
    WHERE purchase_request_id = $1;
  `;

  const result = await thirdDB.query(query, [purchase_request_id]);
  return result.rows[0] || null;
};
