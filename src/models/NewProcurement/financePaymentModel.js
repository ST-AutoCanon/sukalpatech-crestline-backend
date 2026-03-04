import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/**
 * Create Finance Payment Details
 */
export const createFinancePaymentDetails = async (org_code, data) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.pr_finance_payment_details (
      purchase_request_id,
      payment_stage,
      partial_percentage,
      final_completed,
      payment_proof_file_name,
      payment_proof_file_path,
      finance_comment,
      payment_updated_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    data.purchase_request_id,
    data.payment_stage || null,
    data.partial_percentage || null,
    data.final_completed ?? false,
    data.payment_proof_file_name || null,
    data.payment_proof_file_path || null,
    data.finance_comment || null,
    data.payment_updated_by || null,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};

/**
 * Update Finance Payment Details by PR ID
 */
// export const updateFinancePaymentDetails = async (
//   purchase_request_id,
//   data,
//   org_code,
// ) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     UPDATE ${schema}.pr_finance_payment_details
//     SET
//       payment_stage = $1,
//       partial_percentage = $2,
//       final_completed = $3,
//       payment_proof_file_name = $4,
//       payment_proof_file_path = $5,
//       finance_comment = $6,
//       payment_updated_by = $7,
//       updated_at = NOW()
//     WHERE purchase_request_id = $8
//     RETURNING *;
//   `;

//   const values = [
//     data.payment_stage || null,
//     data.partial_percentage || null,
//     data.final_completed ?? false,
//     data.payment_proof_file_name || null,
//     data.payment_proof_file_path || null,
//     data.finance_comment || null,
//     data.payment_updated_by || null,
//     purchase_request_id,
//   ];

//   const result = await thirdDB.query(query, values);
//   return result.rows[0];
// };

export const updateFinancePaymentDetails = async (
  purchase_request_id,
  data,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.pr_finance_payment_details (
      purchase_request_id,
      payment_stage,
      partial_percentage,
      final_completed,
      payment_proof_file_name,
      payment_proof_file_path,
      finance_comment,
      payment_updated_by,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())

    ON CONFLICT (purchase_request_id)
    DO UPDATE SET
      payment_stage = EXCLUDED.payment_stage,
      partial_percentage = EXCLUDED.partial_percentage,
      final_completed = EXCLUDED.final_completed,
      payment_proof_file_name = EXCLUDED.payment_proof_file_name,
      payment_proof_file_path = EXCLUDED.payment_proof_file_path,
      finance_comment = EXCLUDED.finance_comment,
      payment_updated_by = EXCLUDED.payment_updated_by,
      updated_at = NOW()

    RETURNING *;
  `;

  const values = [
    purchase_request_id,
    data.payment_stage || null,
    data.partial_percentage || null,
    data.final_completed ?? false,
    data.payment_proof_file_name || null,
    data.payment_proof_file_path || null,
    data.finance_comment || null,
    data.payment_updated_by || null,
  ];

  const result = await thirdDB.query(query, values);
  return result.rows[0];
};
/**
 * Get Finance Payment Details by PR ID
 */
export const getFinancePaymentDetailsByPR = async (
  purchase_request_id,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.pr_finance_payment_details
    WHERE purchase_request_id = $1;
  `;

  const result = await thirdDB.query(query, [purchase_request_id]);
  return result.rows[0] || null;
};
