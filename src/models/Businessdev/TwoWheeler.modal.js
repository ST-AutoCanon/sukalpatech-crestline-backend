// models/businessdev2/twoWheelerModal.js
import pool from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/* ---------------- Insert 2W Business ---------------- */
export const insertTwoWheelerBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.business_dev_2 (
      org_code,
      industry_type,
      company_name,
      contact_person,
      phone,
      email,
      project_title,
      expected_quantity,
      estimated_budget,
      vehicle_model,
      motor_capacity,
      battery_type,
      business_status,
      comment
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;
  `;

  const values = [
    org_code,
    data.industry_type || "2W",
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,
    data.project_title,
    data.expected_quantity,
    data.estimated_budget,
    data.vehicle_model,
    data.motor_capacity,
    data.battery_type,
    data.business_status,
    data.comment
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/* ---------------- Get All 2W Businesses ---------------- */
export const getTwoWheelerBusinesses = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT
      id,
      industry_type,
      company_name,
      contact_person,
      phone,
      email,
      project_title,
      expected_quantity,
      estimated_budget,
      vehicle_model,
      motor_capacity,
      battery_type,
      business_status,
      comment,
      created_at
    FROM ${schema}.business_dev_2
    WHERE industry_type = '2W'
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

/* ---------------- Update 2W Business ---------------- */
export const updateTwoWheelerBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET
      company_name = $1,
      contact_person = $2,
      phone = $3,
      email = $4,
      project_title = $5,
      expected_quantity = $6,
      estimated_budget = $7,
      vehicle_model = $8,
      motor_capacity = $9,
      battery_type = $10,
      updated_at = NOW()
    WHERE id = $11
    AND org_code = $12
    AND industry_type = '2W'
    RETURNING *;
  `;

  const values = [
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,
    data.project_title,
    data.expected_quantity,
    data.estimated_budget,
    data.vehicle_model,
    data.motor_capacity,
    data.battery_type,
    id,
    org_code,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/* ---------------- Delete 2W Business ---------------- */
export const deleteTwoWheelerBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    DELETE FROM ${schema}.business_dev_2
    WHERE id = $1
    AND org_code = $2
    AND industry_type = '2W'
    RETURNING *;
  `;

  const result = await pool.query(query, [id, org_code]);
  return result.rows[0];
};

export const reviewTwoWheelerBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET 
      feasibility_status = $1,
      comments = $2
    WHERE id = $3 AND industry_type = '2W'
    RETURNING *;
  `;

  const values = [
    data.feasibility_status,
    data.comments,
    data.id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/* ---------------- Get All 2W Feasibility Reviewed Businesses ---------------- */
export const getTwoWheelerFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT
      id,
      industry_type,
      company_name,
      contact_person,
      phone,
      email,
      project_title,
      expected_quantity,
      estimated_budget,
      vehicle_model,
      motor_capacity,
      battery_type,
      business_status,
      comment,
      feasibility_status,
      comments,
      created_at,
      updated_at
    FROM ${schema}.business_dev_2
    WHERE industry_type = '2W'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const reviewfinalTwoWheelerBusiness = async (org_code, payload) => {
  try {
    const result = await reviewModel(org_code, {
      ...payload,
      final_status: payload.final_status,
      final_comment: payload.final_comment
    });

    return {
      success: true,
      message: "2W feasibility updated",
      data: result
    };

  } catch (error) {
    console.error("Review 2W Error:", error);
    return { success: false, message: "Failed to update feasibility" };
  }
};