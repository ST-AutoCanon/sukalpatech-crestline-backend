import thirdDB from "../../config/dbfirst.js";

export const createPurchaseItem = async (item, prId) => {
  const query = `
    INSERT INTO purchase_items 
      (purchase_request_id, item_code, item_name, quantity_required)
    VALUES ($1, $2, $3, $4) RETURNING id
  `;
  const values = [prId, item.item_code, item.item_name, item.quantity_required];
  const result = await thirdDB.query(query, values);
  return result.rows[0].id;
};

export const fetchItemsByPR = async (prId) => {
  const result = await thirdDB.query(
    `SELECT * FROM purchase_items WHERE purchase_request_id = $1`,
    [prId]
  );
  return result.rows;
};
