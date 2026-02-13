import db from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// -------------------------------
// Add a new status + comment
// -------------------------------
export const addFeasibilityStatus = async (requestId, data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    INSERT INTO ${schema}.bus_body_request_department_status
    (
      request_id,
      department_name,
      status,
      comment,
      updated_by,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id
  `;

  const values = [
    requestId,
    "Feasibility", // department fixed
    data.status, // e.g. PENDING, APPROVED, REJECTED
    data.comment || "",
    data.updated_by, // user making the update
    new Date(),
  ];

  const result = await db.query(query, values);
  return result.rows[0].id;
};

// -------------------------------
// Fetch all statuses for a request
// -------------------------------
export const fetchFeasibilityStatuses = async (requestId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    SELECT id, status, comment, updated_by, updated_at
    FROM ${schema}.bus_body_request_department_status
    WHERE request_id = $1
      AND department_name = 'Feasibility'
    ORDER BY updated_at ASC
  `;
  const result = await db.query(query, [requestId]);
  return result.rows;
};
