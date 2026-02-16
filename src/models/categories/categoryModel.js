import thirdDB from "../../config/dbfirst.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";
export async function getLastCategoryCode(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT code FROM ${schema}.categories ORDER BY id DESC LIMIT 1`,
  );
  return result.rows[0]?.code || null;
}

export async function insertCategory(code, name, root_category_id, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `INSERT INTO ${schema}.categories(code, name, root_category_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [code, name, root_category_id],
  );
  return result.rows[0];
}

export async function getCategoriesByRoot(root_id, org_code) {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT id, code, name FROM ${schema}.categories WHERE root_category_id=$1 AND is_active=true ORDER BY id`,
    [root_id],
  );
  return result.rows;
}

// export async function getAllCategories(org_code) {
//   const schema = await getSchemaFromOrgCode(org_code);
  
//   const result = await thirdDB.query(
//     "SELECT c.id, c.code, c.name, r.id AS root_id, r.name AS root_name FROM categories c LEFT JOIN root_categories r ON c.root_category_id = r.id ORDER BY c.id",
//   );
//   return result.rows;
// }
export async function getAllCategories(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT 
        c.id, 
        c.code, 
        c.name, 
        r.id AS root_id, 
        r.name AS root_name
     FROM ${schema}.categories c
     LEFT JOIN ${schema}.root_categories r 
        ON c.root_category_id = r.id
     ORDER BY c.id`,
  );

  return result.rows;
}


/* ================= PRODUCT ================= */
// export async function getAllProducts() {
//   const result = await thirdDB.query(
//     `SELECT p.id, p.name, p.category_id, c.name AS category_name, r.name AS root_name
//      FROM products p
//      LEFT JOIN categories c ON p.category_id = c.id
//      LEFT JOIN root_categories r ON c.root_category_id = r.id
//      ORDER BY p.id`,
//   );
//   return result.rows;
// }
export async function getAllProducts(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT 
        p.id, 
        p.name, 
        p.category_id, 
        c.name AS category_name, 
        r.name AS root_name
     FROM ${schema}.products p
     LEFT JOIN ${schema}.categories c 
        ON p.category_id = c.id
     LEFT JOIN ${schema}.root_categories r 
        ON c.root_category_id = r.id
     ORDER BY p.id`,
  );

  return result.rows;
}


/* ================= VARIANT ================= */
// export async function getAllVariants() {
//   const result = await thirdDB.query(
//     `SELECT v.id, v.name, v.product_id, p.name AS product_name, c.name AS category_name, r.name AS root_name
//      FROM variants v
//      LEFT JOIN products p ON v.product_id = p.id
//      LEFT JOIN categories c ON p.category_id = c.id
//      LEFT JOIN root_categories r ON c.root_category_id = r.id
//      ORDER BY v.id`,
//   );
//   return result.rows;
// }

export async function getAllVariants(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT 
        v.id, 
        v.name, 
        v.product_id, 
        p.name AS product_name, 
        c.name AS category_name, 
        r.name AS root_name
     FROM ${schema}.variants v
     LEFT JOIN ${schema}.products p 
        ON v.product_id = p.id
     LEFT JOIN ${schema}.categories c 
        ON p.category_id = c.id
     LEFT JOIN ${schema}.root_categories r 
        ON c.root_category_id = r.id
     ORDER BY v.id`,
  );

  return result.rows;
}


/* ================= SUB-VARIANT ================= */
// export async function getAllSubVariants() {
//   const result = await thirdDB.query(
//     `SELECT s.id, s.name, s.variant_id, v.name AS variant_name, p.name AS product_name, c.name AS category_name, r.name AS root_name
//      FROM sub_variants s
//      LEFT JOIN variants v ON s.variant_id = v.id
//      LEFT JOIN products p ON v.product_id = p.id
//      LEFT JOIN categories c ON p.category_id = c.id
//      LEFT JOIN root_categories r ON c.root_category_id = r.id
//      ORDER BY s.id`,
//   );
//   return result.rows;
// }

export async function getAllSubVariants(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT 
        s.id, 
        s.name, 
        s.variant_id, 
        v.name AS variant_name, 
        p.name AS product_name, 
        c.name AS category_name, 
        r.name AS root_name
     FROM ${schema}.sub_variants s
     LEFT JOIN ${schema}.variants v 
        ON s.variant_id = v.id
     LEFT JOIN ${schema}.products p 
        ON v.product_id = p.id
     LEFT JOIN ${schema}.categories c 
        ON p.category_id = c.id
     LEFT JOIN ${schema}.root_categories r 
        ON c.root_category_id = r.id
     ORDER BY s.id`,
  );

  return result.rows;
}


/* ================= FULL HIERARCHY (TABLE VIEW) ================= */
// export async function getFullHierarchy() {
//   const result = await thirdDB.query(`
//     SELECT 
//       r.id   AS root_id,
//       r.name AS root_name,

//       c.id   AS category_id,
//       c.code AS category_code,
//       c.name AS category_name,

//       p.id   AS product_id,
//       p.name AS product_name,

//       v.id   AS variant_id,
//       v.name AS variant_name,

//       s.id   AS sub_variant_id,
//       s.name AS sub_variant_name

//     FROM root_categories r
//     LEFT JOIN categories c ON c.root_category_id = r.id
//     LEFT JOIN products p ON p.category_id = c.id
//     LEFT JOIN variants v ON v.product_id = p.id
//     LEFT JOIN sub_variants s ON s.variant_id = v.id

//     ORDER BY r.id, c.id, p.id, v.id, s.id
//   `);

//   return result.rows;
// }


export async function getFullHierarchy(org_code) {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT 
        r.id   AS root_id,
        r.name AS root_name,

        c.id   AS category_id,
        c.code AS category_code,
        c.name AS category_name,

        p.id   AS product_id,
        p.name AS product_name,

        v.id   AS variant_id,
        v.name AS variant_name,

        s.id   AS sub_variant_id,
        s.name AS sub_variant_name

     FROM ${schema}.root_categories r
     LEFT JOIN ${schema}.categories c 
        ON c.root_category_id = r.id
     LEFT JOIN ${schema}.products p 
        ON p.category_id = c.id
     LEFT JOIN ${schema}.variants v 
        ON v.product_id = p.id
     LEFT JOIN ${schema}.sub_variants s 
        ON s.variant_id = v.id

     ORDER BY r.id, c.id, p.id, v.id, s.id`,
  );

  return result.rows;
}
