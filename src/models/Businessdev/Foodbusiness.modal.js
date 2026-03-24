import pool from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// CREATE
export const insertFoodBusiness = async (org_code, data) => {
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
      packaging_type,
      business_status,
      comment
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *;
  `;

  const values = [
    org_code,
    data.industry_type || "Food",
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,
    data.project_title,
    data.expected_quantity,
    data.estimated_budget,
    data.packaging_type,
    data.business_status,
    data.comment
  ];

  const result = await pool.query(query, values);
  return result.rows[0]; // ✅ only return the inserted row
};

// GET ALL
export const getAllFoodBusinesses = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `SELECT * FROM ${schema}.business_dev_2 WHERE industry_type = 'FOOD' ORDER BY created_at DESC;`;

  const result = await pool.query(query);
  return result.rows;
};

// UPDATE
export const updateFoodBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    UPDATE ${schema}.business_dev_2
    SET company_name=$1, contact_person=$2, phone=$3, email=$4,
        project_title=$5, expected_quantity=$6, estimated_budget=$7,
        packaging_type=$8, status=$9
    WHERE id=$10 AND industry_type='Food'
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
    data.packaging_type,
    data.status || "Pending",
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE
export const deleteFoodBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `DELETE FROM ${schema}.business_dev_2 WHERE id=$1 AND industry_type='Food' RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const reviewFoodBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET 
      feasibility_status = $1,
      comments = $2
    WHERE id = $3 AND industry_type = 'FOOD'
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

export const getFoodBusinessFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.business_dev_2
    WHERE industry_type = 'FOOD'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};
export const reviewFinalFoodBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_2
    SET 
      business_status = $1,
      comment = $2
    WHERE id = $3 AND industry_type = 'FOOD'
    RETURNING *;
  `;

  const values = [
    data.final_status,
    data.final_comment,
    data.id
  ];

  const result = await pool.query(query, values);

  return {
    success: true,
    message: "Food business final review updated",
    data: result.rows[0]
  };
};