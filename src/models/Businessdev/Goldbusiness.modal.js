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
      comments)
    VALUES (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17,$18
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
    data.comments
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
      final_status=$20,
      final_comment=$21

    WHERE id = $22 AND industry_type = 'gold_business'
    RETURNING *;
  `;

  const values = [
  data.company_name,         //1
  data.contact_person,       //2
  data.phone,                //3
  data.email,                //4

  data.business_type,        //5
  data.gold_type,            //6
  data.product_type,         //7
  data.purity_required,      //8
  data.expected_quantity,    //9
  data.estimated_budget,     //10

  data.making_charges,       //11
  data.hallmark_required,    //12
  data.design_type,          //13
  data.delivery_location,    //14
  data.timeline,             //15

  data.business_status,      //16
  data.comment,              //17
  data.feasibility_status,   //18
  data.comments,             //19

  data.final_status,         // ✅ 20
  data.final_comment,        // ✅ 21

  id                         // ✅ 22
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

