import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";
export const createItem = async (item, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    INSERT INTO ${schema}.items 
      (item_code, item_name, root_category_id, category_id, variant_id, sub_variant_id, product_id,qty)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    item.item_code,
    item.item_name,
    item.root_category_id,
    item.category_id || null,
    item.variant_id || null,
    item.sub_variant_id || null,
    item.product_id || null,
    item.qty ?? 0,
  ];

  const result = await thirdDB.query(query, values);
  const newItem = result.rows[0];

  if (item.vendors?.length) {
    const vendorValues = item.vendors
      .map((v) => `(${newItem.id}, ${v.vendor_id})`)
      .join(",");
    await thirdDB.query(
      `INSERT INTO ${schema}.items_suppliers (item_id, vendor_id) VALUES ${vendorValues}`,
    );
  }

  return newItem;
};

export async function searchItems(query, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const sql = `
    WITH resolved AS (
      SELECT 
        i.id,
        i.item_code,
        i.item_name,
        COALESCE(i.sub_variant_id, sv.id) AS resolved_sub_variant,
        COALESCE(i.variant_id, sv.variant_id) AS resolved_variant,
        COALESCE(i.category_id, v.category_id) AS resolved_category
      FROM ${schema}.items i
      LEFT JOIN ${schema}.sub_variants sv ON sv.id = i.sub_variant_id
      LEFT JOIN ${schema}.variants v ON v.id = COALESCE(i.variant_id, sv.variant_id)
    )

    SELECT DISTINCT 
      i.id,
      i.item_code,
      i.item_name
    FROM resolved i
    LEFT JOIN ${schema}.variants v ON v.id = i.resolved_variant
    LEFT JOIN ${schema}.categories c ON c.id = i.resolved_category
    LEFT JOIN ${schema}.root_categories rc ON rc.id = c.root_category_id

    WHERE 
      rc.name ILIKE $1 OR rc.code ILIKE $1 OR
      c.name ILIKE $1 OR c.code ILIKE $1 OR
      v.name ILIKE $1 OR v.code ILIKE $1
    ORDER BY i.id;
  `;

  const result = await thirdDB.query(sql, [`%${query}%`]);
  return result.rows;
}

// Get by ID
export const getItemById = async (id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.items WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

// Get last item (for item_code generation)
export const getLastItem = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT id FROM ${schema}.items ORDER BY id DESC LIMIT 1`,
  );
  return result.rows[0];
};

export const updateItem = async (id, item, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    UPDATE ${schema}.items SET 
      item_name = $1,
      root_category_id = $2,
      category_id = $3,
      variant_id = $4,
      sub_variant_id = $5,
      qty = $6,
      updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    item.item_name,
    item.root_category_id,
    item.category_id || null,
    item.variant_id || null,
    item.sub_variant_id || null,
    item.qty || 0,
    id,
  ];

  const result = await thirdDB.query(query, values);

  // Update vendors
  await thirdDB.query(
    `DELETE FROM ${schema}.items_suppliers WHERE item_id = $1`,
    [id],
  );

  if (item.vendors && item.vendors.length > 0) {
    const vendorValues = item.vendors
      .map((v) => `(${id}, ${v.vendor_id})`)
      .join(",");

    await thirdDB.query(
      `INSERT INTO ${schema}.items_suppliers (item_id, vendor_id) VALUES ${vendorValues}`,
    );
  }

  return result.rows[0];
};

// Delete
export const deleteItem = async (id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  await thirdDB.query(`DELETE FROM ${schema}.items WHERE id = $1`, [id]);
};

export const getItems = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(`
    SELECT 
      i.id, 
      i.item_code, 
      i.item_name, 
      i.qty,
      ARRAY_REMOVE(ARRAY_AGG(isup.vendor_id), NULL) AS vendors
    FROM ${schema}.items i
    LEFT JOIN ${schema}.items_suppliers isup 
      ON i.id = isup.item_id
    GROUP BY i.id, i.item_code, i.item_name, i.qty
    ORDER BY i.id DESC
  `);

  return result.rows;
};

export async function searchItemsByCodeOrName(query, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const sql = `
    SELECT 
      id,
      item_code,
      item_name
    FROM ${schema}.items
    WHERE 
      item_code ILIKE $1 OR
      item_name ILIKE $1
    ORDER BY item_code ASC
    LIMIT 20;
  `;

  const result = await thirdDB.query(sql, [`%${query}%`]);
  return result.rows;
}