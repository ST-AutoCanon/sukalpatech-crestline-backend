// models/businessdev3/threeWheelerModal.js
import pool from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const insertThreeWheelerBusiness = async (org_code, data) => {
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
    data.industry_type || "3W",
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

// GET / LIST
export const getThreeWheelerBusinesses = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `SELECT * FROM ${schema}.business_dev_2 WHERE industry_type = '3W' ORDER BY created_at DESC;`;

  const result = await pool.query(query);
  return result.rows;
};

// UPDATE
export const updateThreeWheelerBusiness = async (org_code, id, data) => {
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
      status = $11
    WHERE id = $12 AND industry_type = '3W'
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
    data.status || "Pending",
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE
export const deleteThreeWheelerBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    DELETE FROM ${schema}.business_dev_2
    WHERE id = $1 AND industry_type = '3W'
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// REVIEW
export const reviewThreeWheelerBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
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

  const result = await pool.query(query, values);

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
    WHERE industry_type = '3W'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const reviewfinalThreeWheelerBusiness = async (org_code, payload) => {
  try {
    const result = await reviewModel(org_code, {
      ...payload,
      final_status: payload.final_status,
      final_comment: payload.final_comment
    });

    return {
      success: true,
      message: "3W feasibility updated",
      data: result
    };

  } catch (error) {
    console.error("Review 3W Error:", error);
    return { success: false, message: "Failed to update feasibility" };
  }
};