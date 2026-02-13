import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const createPurchaseItem = async (item, prId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    INSERT INTO ${schema}.purchase_items 
      (purchase_request_id, item_code, item_name, quantity_required)
    VALUES ($1, $2, $3, $4) RETURNING id
  `;
  const values = [prId, item.item_code, item.item_name, item.quantity_required];
  const result = await thirdDB.query(query, values);
  return result.rows[0].id;
};

export const fetchItemsByPR = async (prId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.purchase_items WHERE purchase_request_id = $1`,
    [prId],
  );
  return result.rows;
};
