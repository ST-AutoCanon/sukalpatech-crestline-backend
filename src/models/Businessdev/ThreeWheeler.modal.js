// models/businessdev3/threeWheelerModal.js
import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const insertThreeWheelerBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
  INSERT INTO ${schema}.business_dev_3w (
    org_code,
    industry_type,
    company_name,
    contact_person,
    phone,
    email,
    address,
    project_title,
    required_date,
    description,
    expected_quantity,
    estimated_budget,
    vehicle_model,
    engine_capacity,
    fuel_type,
    load_capacity,
    business_status,
    comment
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
)
RETURNING *;
  `;

  const values = [
  org_code,
  data.industry_type || "3W",
  data.company_name,
  data.contact_person,
  data.phone,
  data.email,
  data.address,
  data.project_title,
  data.required_date,
  data.description,
  data.expected_quantity,
  data.estimated_budget,
  data.vehicle_model,
  data.engine_capacity,
  data.fuel_type,
  data.load_capacity,
  data.business_status,
  data.comment,
];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/// GET / LIST with optional status filter
export const getThreeWheelerBusinesses = async (org_code, statusFilter) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `SELECT * FROM ${schema}.business_dev_3w WHERE industry_type = '3W'`;
  const values = [];

  if (statusFilter && statusFilter !== "ALL") {
  if (statusFilter === "PENDING") {
    values.push("PENDING");
    query += ` AND business_status = $1`;
  } 
  else if (statusFilter === "REJECTED") {
    values.push("REJECTED");
    query += ` AND business_status = $1`;
  } 
  else if (statusFilter === "COMPLETED") {
    values.push("APPROVED");
    query += ` AND business_status = $1`;
  }
}

  query += ` ORDER BY created_at DESC;`;

  const result = await thirdDB.query(query, values);
  return result.rows;
};

// UPDATE
export const updateThreeWheelerBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
   UPDATE ${schema}.business_dev_3w
SET
  company_name = $1,
  contact_person = $2,
  phone = $3,
  email = $4,
  address=$5,
  project_title = $6,
  required_date = $7,
  description = $8,
  expected_quantity = $9,
  estimated_budget = $10,
  vehicle_model = $11,
  engine_capacity = $12,
  fuel_type = $13,
  load_capacity = $14,
  business_status = $15,
  comment = $16,
  feasibility_status = $17,
  comments = $18,
  final_status = $19,
  final_comment = $20
WHERE id = $21
  AND industry_type = '3W'
RETURNING *;
  `;

 const values = [
  data.company_name,
  data.contact_person,
  data.phone,
  data.email,
  data.address,
  data.project_title,
  data.required_date,
  data.description,
  data.expected_quantity,
  data.estimated_budget,
  data.vehicle_model,
  data.engine_capacity,
  data.fuel_type,
  data.load_capacity,
  data.business_status || "PENDING",
  data.comment || null,
  data.feasibility_status || null,
  data.comments || null,
  data.final_status || null,
  data.final_comment || null,
  id,
];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

// DELETE
export const deleteThreeWheelerBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    DELETE FROM ${schema}.business_dev_3w
    WHERE id = $1 AND industry_type = '3W'
    RETURNING *;
  `;

  const result = await thirdDB.query(query, [id]);
  return result.rows[0];
};

// REVIEW
export const reviewThreeWheelerBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_3w
    SET 
      feasibility_status = $1,
      comments = $2
    WHERE id = $3 AND industry_type = '3W'
    RETURNING *;
  `;

  const values = [
    data.feasibility_status,
    data.comments,
    data.id
  ];

  const result = await thirdDB.query(query, values);

  return result.rows[0];
};
/* ---------------- Get All 2W Feasibility Reviewed Businesses ---------------- */
export const getThreeWheelerFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
   SELECT
id,
industry_type,
company_name,
contact_person,
phone,
email,
address,
project_title,
required_date,
description,
expected_quantity,
estimated_budget,
vehicle_model,
engine_capacity,
fuel_type,
load_capacity,
business_status,
comment,
feasibility_status,
comments,
final_status,
final_comment,
created_at
FROM ${schema}.business_dev_3w
WHERE industry_type='3W'
AND feasibility_status IS NOT NULL
AND feasibility_status <> ''
ORDER BY created_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

export const reviewfinalThreeWheelerBusiness = async (org_code, payload) => {
  try {
    const schema = await getSchemaFromOrgCode(org_code);

    const query = `
      UPDATE ${schema}.business_dev_3w
      SET
        final_status = $1,
        final_comment = $2
      WHERE id = $3
        AND industry_type = '3W'
      RETURNING *;
    `;

    const values = [
      payload.final_status,
      payload.final_comment,
      payload.id
    ];

    const result = await thirdDB.query(query, values);

    return {
      success: true,
      message: "3W final review updated",
      data: result.rows[0]
    };

  } catch (error) {
    console.error("Review 3W Error:", error);
    return { success: false, message: "Failed to update final review" };
  }
};