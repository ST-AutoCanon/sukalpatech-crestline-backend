import thirdDB from "../../config/dbThird.js";

// export async function searchCategoriesHierarchy(query) {
//   const searchQuery = `
//     SELECT 
//       rc.id AS root_id, rc.name AS root_name, rc.code AS root_code,
//       c.id AS category_id, c.name AS category_name, c.code AS category_code,
//       v.id AS variant_id, v.name AS variant_name, v.code AS variant_code,
//       sv.id AS sub_variant_id, sv.name AS sub_variant_name, sv.code AS sub_variant_code
//     FROM root_categories rc
//     LEFT JOIN categories c ON c.root_category_id = rc.id
//     LEFT JOIN variants v ON v.category_id = c.id
//     LEFT JOIN sub_variants sv ON sv.variant_id = v.id
//     WHERE 
//       rc.name ILIKE $1 OR
//       rc.code ILIKE $1 OR
//       c.name ILIKE $1 OR
//       c.code ILIKE $1 OR
//       v.name ILIKE $1 OR
//       v.code ILIKE $1 OR
//       sv.name ILIKE $1 OR
//       sv.code ILIKE $1
//     ORDER BY rc.id, c.id, v.id, sv.id
//   `;

//   const result = await thirdDB.query(searchQuery, [`%${query}%`]);
//   return result.rows;
// }



export async function searchCategoriesHierarchy(query) {
  const searchQuery = `
    SELECT 
      rc.id AS root_id, rc.name AS root_name, rc.code AS root_code,

      c.id AS category_id, 
      c.name AS category_name, 
      c.code AS category_code,

      v.id AS variant_id, 
      v.name AS variant_name, 
      v.code AS variant_code,

      sv.id AS sub_variant_id, 
      sv.name AS sub_variant_name, 
      sv.code AS sub_variant_code,

      p.id AS product_id,
      p.name AS product_name,
      p.code AS product_code

    FROM root_categories rc
    LEFT JOIN categories c 
      ON c.root_category_id = rc.id

    LEFT JOIN products p 
      ON p.category_id = c.id

    LEFT JOIN variants v 
      ON v.product_id = p.id

    LEFT JOIN sub_variants sv 
      ON sv.variant_id = v.id

    -- PRODUCT ATTACHED TO CATEGORY
    

    WHERE 
      rc.name ILIKE $1 OR rc.code ILIKE $1 OR
      c.name ILIKE $1 OR c.code ILIKE $1 OR
      v.name ILIKE $1 OR v.code ILIKE $1 OR
      sv.name ILIKE $1 OR sv.code ILIKE $1 OR
      p.name ILIKE $1 OR p.code ILIKE $1

    ORDER BY rc.id, c.id, v.id, sv.id, p.id
  `;

  const result = await thirdDB.query(searchQuery, [`%${query}%`]);
  return result.rows;
}


// export async function searchItems(query) {
//   const q = `%${query}%`;

//   // 1️⃣ Check Sub Variant match → return ONLY its items
//   let res = await thirdDB.query(
//     `SELECT id FROM sub_variants WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `SELECT id, item_code, item_name FROM items WHERE sub_variant_id IN (${res.rows
//           .map((r) => r.id)
//           .join(",")})`
//       )
//       .then((r) => r.rows);
//   }

//   // 2️⃣ Check Variant match → return its + all sub-variant items
//   res = await thirdDB.query(
//     `SELECT id FROM variants WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `
//       SELECT id, item_code, item_name
//       FROM items
//       WHERE variant_id IN (${res.rows.map((r) => r.id).join(",")})
//       OR sub_variant_id IN (
//           SELECT id FROM sub_variants WHERE variant_id IN (${res.rows
//             .map((r) => r.id)
//             .join(",")})
//       )
//     `
//       )
//       .then((r) => r.rows);
//   }

//   // 3️⃣ Check Category match
//   res = await thirdDB.query(
//     `SELECT id FROM categories WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `
//       SELECT id, item_code, item_name
//       FROM items
//       WHERE category_id IN (${res.rows.map((r) => r.id).join(",")})
//     `
//       )
//       .then((r) => r.rows);
//   }

//   // 4️⃣ Check Root Category match
//   res = await thirdDB.query(
//     `SELECT id FROM root_categories WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `
//       SELECT i.id, i.item_code, i.item_name
//       FROM items i
//       JOIN categories c ON c.id = i.category_id
//       WHERE c.root_category_id IN (${res.rows.map((r) => r.id).join(",")})
//     `
//       )
//       .then((r) => r.rows);
//   }

//   return [];
// }





// export async function searchItems(query) {
//   const q = `%${query}%`;

//   // 1️⃣ Sub Variant match → return ONLY its items
//   let res = await thirdDB.query(
//     `SELECT id FROM sub_variants WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `SELECT id, item_code, item_name, product_id FROM items
//          WHERE sub_variant_id IN (${res.rows.map((r) => r.id).join(",")})`
//       )
//       .then((r) => r.rows);
//   }

//   // 2️⃣ Variant match → return its + all sub-variant items
//   res = await thirdDB.query(
//     `SELECT id FROM variants WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     const ids = res.rows.map((r) => r.id).join(",");
//     return thirdDB
//       .query(
//         `SELECT id, item_code, item_name, product_id FROM items
//          WHERE variant_id IN (${ids})
//          OR sub_variant_id IN (SELECT id FROM sub_variants WHERE variant_id IN (${ids}))`
//       )
//       .then((r) => r.rows);
//   }

//   // 3️⃣ Product match
//   res = await thirdDB.query(
//     `SELECT id FROM products WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `SELECT id, item_code, item_name, product_id FROM items
//          WHERE product_id IN (${res.rows.map((r) => r.id).join(",")})`
//       )
//       .then((r) => r.rows);
//   }

//   // 4️⃣ Category match
//   res = await thirdDB.query(
//     `SELECT id FROM categories WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `SELECT id, item_code, item_name, product_id FROM items
//          WHERE category_id IN (${res.rows.map((r) => r.id).join(",")})`
//       )
//       .then((r) => r.rows);
//   }

//   // 5️⃣ Root Category match
//   res = await thirdDB.query(
//     `SELECT id FROM root_categories WHERE name ILIKE $1 OR code ILIKE $1`,
//     [q]
//   );
//   if (res.rows.length) {
//     return thirdDB
//       .query(
//         `SELECT i.id, i.item_code, i.item_name, i.product_id,i.vendors
//          FROM items i
//          JOIN categories c ON c.id = i.category_id
//          WHERE c.root_category_id IN (${res.rows.map((r) => r.id).join(",")})`
//       )
//       .then((r) => r.rows);
//   }

//   return [];
// }



export async function searchItems(query) {
  const q = `%${query}%`;

  const vendSelect = `
    SELECT 
      i.id,
      i.item_code,
      i.item_name,
      i.product_id,
      i.qty,
      COALESCE(
        json_agg(s.vendor_id) FILTER (WHERE s.vendor_id IS NOT NULL),
        '[]'
      ) AS vendors
    FROM items i
    LEFT JOIN items_suppliers s ON s.item_id = i.id
  `;

  // 1️⃣ Sub Variant match → ONLY those items
  let res = await thirdDB.query(
    `SELECT id FROM sub_variants WHERE name ILIKE $1 OR code ILIKE $1`,
    [q]
  );
  if (res.rows.length) {
    const ids = res.rows.map((r) => r.id);
    const r = await thirdDB.query(
      `${vendSelect}
       WHERE i.sub_variant_id = ANY($1::int[])
       GROUP BY i.id`,
      [ids]
    );
    return r.rows;
  }

  // 2️⃣ Variant match → variant + its sub variants
  res = await thirdDB.query(
    `SELECT id FROM variants WHERE name ILIKE $1 OR code ILIKE $1`,
    [q]
  );
  if (res.rows.length) {
    const ids = res.rows.map((r) => r.id);
    const r = await thirdDB.query(
      `${vendSelect}
       WHERE 
         i.variant_id = ANY($1::int[])
         OR i.sub_variant_id IN (
            SELECT id FROM sub_variants WHERE variant_id = ANY($1::int[])
         )
       GROUP BY i.id`,
      [ids]
    );
    return r.rows;
  }

  // 3️⃣ Product match
  res = await thirdDB.query(
    `SELECT id FROM products WHERE name ILIKE $1 OR code ILIKE $1`,
    [q]
  );
  if (res.rows.length) {
    const ids = res.rows.map((r) => r.id);
    const r = await thirdDB.query(
      `${vendSelect}
       WHERE i.product_id = ANY($1::bigint[])
       GROUP BY i.id`,
      [ids]
    );
    return r.rows;
  }

  // 4️⃣ Category match
  res = await thirdDB.query(
    `SELECT id FROM categories WHERE name ILIKE $1 OR code ILIKE $1`,
    [q]
  );
  if (res.rows.length) {
    const ids = res.rows.map((r) => r.id);
    const r = await thirdDB.query(
      `${vendSelect}
       WHERE i.category_id = ANY($1::int[])
       GROUP BY i.id`,
      [ids]
    );
    return r.rows;
  }

  // 5️⃣ Root Category match
  res = await thirdDB.query(
    `SELECT id FROM root_categories WHERE name ILIKE $1 OR code ILIKE $1`,
    [q]
  );
  if (res.rows.length) {
    const ids = res.rows.map((r) => r.id);
    const r = await thirdDB.query(
      `${vendSelect}
       JOIN categories c ON c.id = i.category_id
       WHERE c.root_category_id = ANY($1::int[])
       GROUP BY i.id`,
      [ids]
    );
    return r.rows;
  }

  return [];
}



export async function getTables() {
  const res = await thirdDB.query(`
    SELECT
      table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  return res.rows;
}
