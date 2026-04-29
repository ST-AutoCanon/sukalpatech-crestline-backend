import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/**
 * Create Store Receiving Details
 */
export const createStoreReceivingDetails = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.pr_store_receiving_details (
      purchase_request_id,
      quantity_status,
      partial_quantity,
      rejection_reason,
      building,
      rack,
      received_by,
      received_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    data.purchase_request_id,
    data.quantity_status || null,
    data.partial_quantity || null,
    data.rejection_reason || null,
    data.building || null,
    data.rack || null,
    data.received_by || null,
    data.received_at || new Date(),
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/**
 * Update Store Receiving Details by PR ID
 */
export const updateStoreReceivingDetails = async (
  purchase_request_id,
  data,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.pr_store_receiving_details
    SET
      quantity_status = $1,
      partial_quantity = $2,
      rejection_reason = $3,
      building = $4,
      rack = $5,
      received_by = $6,
      received_at = $7,
      updated_at = NOW()
    WHERE purchase_request_id = $8
    RETURNING *;
  `;

  const values = [
    data.quantity_status || null,
    data.partial_quantity || null,
    data.rejection_reason || null,
    data.building || null,
    data.rack || null,
    data.received_by || null,
    data.received_at || new Date(),
    purchase_request_id,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/**
 * Get Store Receiving Details by PR ID
 */
export const getStoreReceivingDetailsByPR = async (
  purchase_request_id,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.pr_store_receiving_details
    WHERE purchase_request_id = $1;
  `;

  const result = await thirdDB.query(query, [purchase_request_id]);
  return result.rows;
};
