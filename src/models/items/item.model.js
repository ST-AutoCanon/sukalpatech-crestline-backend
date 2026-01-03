import thirdDB from "../../config/dbThird.js";


// export const createItem = async (item) => {
//   // 1. Insert the item
//   const query = `
//     INSERT INTO items
//       (item_code, item_name, root_category_id, category_id, variant_id, sub_variant_id)
//     VALUES ($1,$2,$3,$4,$5,$6)
//     RETURNING *;
//   `;
//   const values = [
//     item.item_code,
//     item.item_name,
//     item.root_category_id,
//     item.category_id || null,
//     item.variant_id || null,
//     item.sub_variant_id || null,
//   ];

//   const result = await thirdDB.query(query, values);
//   const newItem = result.rows[0];

//   // 2. Insert vendors into items_suppliers
//   if (item.vendors && item.vendors.length > 0) {
//     const vendorValues = item.vendors
//       .map((v) => `(${newItem.id}, ${v.vendor_id})`)
//       .join(",");
//     await thirdDB.query(
//       `INSERT INTO items_suppliers (item_id, vendor_id) VALUES ${vendorValues}`
//     );
//   }

//   return newItem;
// };

export const createItem = async (item) => {
  const query = `
    INSERT INTO items 
      (item_code, item_name, root_category_id, category_id, variant_id, sub_variant_id, product_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
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
  ];

  const result = await thirdDB.query(query, values);
  const newItem = result.rows[0];

  if (item.vendors?.length) {
    const vendorValues = item.vendors
      .map((v) => `(${newItem.id}, ${v.vendor_id})`)
      .join(",");
    await thirdDB.query(
      `INSERT INTO items_suppliers (item_id, vendor_id) VALUES ${vendorValues}`
    );
  }

  return newItem;
};
  


export async function searchItems(query) {
  const sql = `
    WITH resolved AS (
      SELECT 
        i.id,
        i.item_code,
        i.item_name,
        COALESCE(i.sub_variant_id, sv.id) AS resolved_sub_variant,
        COALESCE(i.variant_id, sv.variant_id) AS resolved_variant,
        COALESCE(i.category_id, v.category_id) AS resolved_category
      FROM items i
      LEFT JOIN sub_variants sv ON sv.id = i.sub_variant_id
      LEFT JOIN variants v ON v.id = COALESCE(i.variant_id, sv.variant_id)
    )

    SELECT DISTINCT 
      i.id,
      i.item_code,
      i.item_name
    FROM resolved i
    LEFT JOIN variants v ON v.id = i.resolved_variant
    LEFT JOIN categories c ON c.id = i.resolved_category
    LEFT JOIN root_categories rc ON rc.id = c.root_category_id

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
export const getItemById = async (id) => {
  const result = await thirdDB.query(`SELECT * FROM items WHERE id = $1`, [id]);
  return result.rows[0];
};

// Get last item (for item_code generation)
export const getLastItem = async () => {
  const result = await thirdDB.query(
    `SELECT id FROM items ORDER BY id DESC LIMIT 1`
  );
  return result.rows[0];
};


export const updateItem = async (id, item) => {
  const query = `
    UPDATE items SET 
      item_name = $1,
      root_category_id = $2,
      category_id = $3,
      variant_id = $4,
      sub_variant_id = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *;
  `;
  const values = [
    item.item_name,
    item.root_category_id,
    item.category_id || null,
    item.variant_id || null,
    item.sub_variant_id || null,
    id,
  ];

  const result = await thirdDB.query(query, values);

  // Update vendors
  await thirdDB.query(`DELETE FROM items_suppliers WHERE item_id = $1`, [id]);
  if (item.vendors && item.vendors.length > 0) {
    const vendorValues = item.vendors
      .map((v) => `(${id}, ${v.vendor_id})`)
      .join(",");
    await thirdDB.query(
      `INSERT INTO items_suppliers (item_id, vendor_id) VALUES ${vendorValues}`
    );
  }

  return result.rows[0];
};


// Delete
export const deleteItem = async (id) => {
  await thirdDB.query(`DELETE FROM items WHERE id = $1`, [id]);
};
