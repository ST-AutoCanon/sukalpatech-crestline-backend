import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// CREATE
export const insertFoodBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

 const query = `
INSERT INTO ${schema}.business_dev_food (
    org_code,
    industry_type,
    company_name,
    contact_person,
    phone,
    email,
    project_title,
    required_date,
    description,
    expected_quantity,
    estimated_budget,
    product_category,
    product_name,
    packaging_type,
    shelf_life,
    storage_condition,
    business_status,
    comment,
    feasibility_status,
    comments
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
)
RETURNING *;
`;

  const values = [
    org_code,
    data.industry_type || "FOOD",
    data.company_name,
    data.contact_person,
    data.phone,
    data.email,
    data.project_title,
    data.required_date,   // ✅
    data.description, 
    data.expected_quantity,
    data.estimated_budget,
    data.product_category,
    data.product_name,
    data.packaging_type,
    data.shelf_life,
    data.storage_condition,
    data.business_status,
    data.comment,
    data.feasibility_status,
    data.comments
];

  const result = await thirdDB.query(query, values);
  return result.rows[0]; // ✅ only return the inserted row
};

// GET ALL with optional status filter
export const getAllFoodBusinesses = async (org_code, status) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `SELECT * FROM ${schema}.business_dev_food WHERE industry_type = 'FOOD'`;
  const values = [];
if (status && status !== "ALL") {
  if (status === "PENDING") {
    values.push("PENDING");
    query += ` AND business_status = $${values.length}`;
  } else if (status === "REJECTED") {
    values.push("REJECTED");
    query += ` AND business_status = $${values.length}`;
  } else if (status === "COMPLETED") {
    values.push("APPROVED", "FEASIBILITY APPROVED");
    query += ` AND business_status IN ($${values.length - 1}, $${values.length})`;
  }
}
  query += ` ORDER BY created_at DESC`;

  const result = await thirdDB.query(query, values);
  return result.rows;
};

// UPDATE
export const updateFoodBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
  UPDATE ${schema}.business_dev_food
SET
  company_name = $1,
  contact_person = $2,
  phone = $3,
  email = $4,
  project_title = $5,
  required_date = $6,
  description = $7,
  expected_quantity = $8,
  estimated_budget = $9,
  product_category = $10,
  product_name = $11,
  packaging_type = $12,
  shelf_life = $13,
  storage_condition = $14,
  business_status = $15,
  comment = $16,
  feasibility_status = $17,
  comments = $18,
  final_status = $19,
  final_comment = $20
WHERE id = $21
  AND industry_type = 'FOOD'
RETURNING *;
`;
 const values = [
  data.company_name,
  data.contact_person,
  data.phone,
  data.email,
  data.project_title,
  data.required_date,
  data.description,
  data.expected_quantity,
  data.estimated_budget,
  data.product_category,
  data.product_name,
  data.packaging_type,
  data.shelf_life,
  data.storage_condition,
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
export const deleteFoodBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `DELETE FROM ${schema}.business_dev_food WHERE id=$1 AND industry_type='Food' RETURNING *;`;
  const result = await thirdDB.query(query, [id]);
  return result.rows[0];
};

export const reviewFoodBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_food
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

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

export const getFoodBusinessFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.business_dev_food
    WHERE industry_type = 'FOOD'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};
export const reviewFinalFoodBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_food
    SET 
  final_status = $1,
  final_comment = $2
    WHERE id = $3 AND industry_type = 'FOOD'
    RETURNING *;
  `;

  const values = [
    data.final_status,
    data.final_comment,
    data.id
  ];

  const result = await thirdDB.query(query, values);

  return {
    success: true,
    message: "Food business final review updated",
    data: result.rows[0]
  };
};