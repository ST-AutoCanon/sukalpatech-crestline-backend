// models/Businessdev/Goldbusiness.modal.js

import pool from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/* ---------------- CREATE ---------------- */
export const insertGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.business_dev_2 (
      org_code,
      industry_type,
      company_name,
      contact_person,
      phone,
      email,

      business_type,
      gold_type,
      product_type,
      purity_required,
      expected_quantity,
      estimated_budget,

      making_charges,
      hallmark_required,
      design_type,
      delivery_location,
      timeline,
      business_status,
      comment,
      feasibility_status,
      comments,
      
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17,$18,$19,$20,$21
    )
    RETURNING *;
  `;

  const values = [
    org_code,
    "gold_business",
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,

    data.business_type,
    data.gold_type,
    data.product_type,
    data.purity_required,
    data.expected_quantity,
    data.estimated_budget,

    data.making_charges,
    data.hallmark_required,
    data.design_type,
    data.delivery_location,
    data.timeline,
    data.business_status,
    data.comment,
    data.feasibility_status,
    data.comments
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


/* ---------------- GET ALL ---------------- */
export const getGoldBusinesses = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT * FROM ${schema}.business_dev_2
    WHERE industry_type = 'gold_business'
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};


/* ---------------- UPDATE ---------------- */
export const updateGoldBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET
      company_name = $1,
      contact_person = $2,
      phone = $3,
      email = $4,

      business_type = $5,
      gold_type = $6,
      product_type = $7,
      purity_required = $8,
      expected_quantity = $9,
      estimated_budget = $10,

      making_charges = $11,
      hallmark_required = $12,
      design_type = $13,
      delivery_location = $14,
      timeline = $15,
      business_status=$16,
      comment=$17,
      feasibility_status=$18,
      comments=$19,

    WHERE id = $16 AND industry_type = 'gold_business'
    RETURNING *;
  `;

  const values = [
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,

    data.business_type,
    data.gold_type,
    data.product_type,
    data.purity_required,
    data.expected_quantity,
    data.estimated_budget,

    data.making_charges,
    data.hallmark_required,
    data.design_type,
    data.delivery_location,
    data.timeline,
    data.business_status,
    data.comment,
    data.feasibility_status,
    data.comments,

    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


/* ---------------- DELETE ---------------- */
export const deleteGoldBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    DELETE FROM ${schema}.business_dev_2
    WHERE id = $1 AND industry_type = 'gold_business'
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};


/* ---------------- FEASIBILITY REVIEW ---------------- */
export const reviewGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET 
      feasibility_status = $1,
      comments = $2
    WHERE id = $3 AND industry_type = 'gold_business'
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


/* ---------------- FETCH FEASIBILITY REVIEWED ---------------- */
export const getGoldFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.business_dev_2
    WHERE industry_type = 'gold_business'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};


/* ---------------- FINAL REVIEW ---------------- */
export const reviewFinalGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET 
      final_status = $1,
      final_comment = $2
    WHERE id = $3 AND industry_type = 'gold_business'
    RETURNING *;
  `;

  const values = [
    data.final_status,
    data.final_comment,
    data.id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};