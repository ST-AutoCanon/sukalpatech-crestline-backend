// models/Businessdev/Goldbusiness.modal.js

import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/* ---------------- CREATE ---------------- */
export const insertGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
   INSERT INTO ${schema}.business_dev_gold (
  org_code,
  industry_type,
  company_name,
  contact_person,
  phone,
  email,
  address,

  required_date,
  description,

  gold_type,
  purity_required,
  expected_quantity,
  estimated_budget,

  making_charges,
  hallmark_required,
  design_type,
  timeline,
  business_status,
  comment,
  feasibility_status,
  comments
)
VALUES (
  $1,$2,$3,$4,$5,$6,
  $7,$8,
  $9,$10,$11,$12,
  $13,$14,$15,$16,
  $17,$18,$19,$20,$21
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
  data.address,

  data.required_date,
  data.description,

  data.gold_type,
  data.purity_required,
  data.expected_quantity,
  data.estimated_budget,

  data.making_charges,
  data.hallmark_required,
  data.design_type,
  data.timeline,
  data.business_status,
  data.comment,
  data.feasibility_status,
  data.comments,
];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/*get all*/
export const getGoldBusinesses = async (org_code, statusFilter) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `
    SELECT * FROM ${schema}.business_dev_gold
    WHERE industry_type = 'gold_business'
  `;
  const values = [];

  if (statusFilter && statusFilter !== "ALL") {
    switch (statusFilter) {
      case "PENDING":
        query += ` AND UPPER(business_status) = $1`;
        values.push("PENDING");
        break;

      case "REJECTED":
        query += ` AND UPPER(business_status) = $1`;
        values.push("REJECTED");
        break;

      case "COMPLETED":
        // Completed: business_status = Approved OR feasibility_status = Feasibility Approved
        query += ` AND (UPPER(business_status) = $1 OR UPPER(feasibility_status) = $2)`;
        values.push("APPROVED", "FEASIBILITY APPROVED");
        break;
    }
  }

  query += ` ORDER BY created_at DESC;`;

  const result = await thirdDB.query(query, values);
  return result.rows;
};

/* ---------------- UPDATE ---------------- */
export const updateGoldBusiness = async (org_code, id, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_gold
SET
  company_name = $1,
  contact_person = $2,
  phone = $3,
  email = $4,
  address=$5

  required_date = $6,
  description = $7,

  business_type = $8,
  gold_type = $9,
  product_type = $10,
  purity_required = $11,
  expected_quantity = $12,
  estimated_budget = $13,

  making_charges = $14,
  hallmark_required = $15,
  design_type = $16,
  timeline = $17,
  business_status = $18,
  comment = $19,
  feasibility_status = $20,
  comments = $21,
  final_status = $22,
  final_comment = $23

WHERE id = $24
  AND industry_type = 'gold_business'
RETURNING *;
  `;

  const values = [
  data.company_name,        // 1
  data.contact_person,      // 2
  data.phone,               // 3
  data.email, 
  data.address,              // 4

  data.required_date,       // 5
  data.description,         // 6

  data.business_type,       // 7
  data.gold_type,           // 8
  data.product_type,        // 9
  data.purity_required,     // 10
  data.expected_quantity,   // 11
  data.estimated_budget,    // 12

  data.making_charges,      // 13
  data.hallmark_required,   // 14
  data.design_type,         // 15
  data.timeline,            // 16

  data.business_status,     // 17
  data.comment,             // 18
  data.feasibility_status,  // 19
  data.comments,            // 20

  data.final_status,        // 21
  data.final_comment,       // 22

  id                        // 23
];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};


/* ---------------- DELETE ---------------- */
export const deleteGoldBusiness = async (org_code, id) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    DELETE FROM ${schema}.business_dev_gold
    WHERE id = $1 AND industry_type = 'gold_business'
    RETURNING *;
  `;

  const result = await thirdDB.query(query, [id]);
  return result.rows[0];
};


/* ---------------- FEASIBILITY REVIEW ---------------- */
export const reviewGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_gold
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

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};


/* ---------------- FETCH FEASIBILITY REVIEWED ---------------- */
export const getGoldFeasibilityReviewed = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.business_dev_gold
    WHERE industry_type = 'gold_business'
      AND feasibility_status IS NOT NULL
      AND feasibility_status <> ''
    ORDER BY created_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};


/* ---------------- FINAL REVIEW ---------------- */
export const reviewFinalGoldBusiness = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.business_dev_gold
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

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

