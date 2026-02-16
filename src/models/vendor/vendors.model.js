import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const createVendor = async (data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    INSERT INTO ${schema}.vendors 
    (
      vendor_name,
      contact_person,
      phone,
      email,
      gst_number,
      pan_number,
      address,
      rating,
      status,
      created_by,
      bank_name,
      bank_branch,
      account_number,
      ifsc_code
    )
    VALUES 
    (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    data.vendor_name,
    data.contact_person,
    data.phone,
    data.email,
    data.gst_number,
    data.pan_number,
    data.address,
    data.rating || 0,
    data.status || "active",
    data.created_by || null,
    data.bank_name || null,
    data.bank_branch || null,
    data.account_number || null,
    data.ifsc_code || null,
  ]);

  return result.rows[0];
};

export const updateVendor = async (vendor_id, data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    UPDATE ${schema}.vendors
    SET
      vendor_name = $1,
      contact_person = $2,
      phone = $3,
      email = $4,
      gst_number = $5,
      pan_number = $6,
      address = $7,
      rating = $8,
      status = $9,
      bank_name = $10,
      bank_branch = $11,
      account_number = $12,
      ifsc_code = $13,
      updated_at = NOW()
    WHERE vendor_id = $14
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    data.vendor_name,
    data.contact_person,
    data.phone,
    data.email,
    data.gst_number,
    data.pan_number,
    data.address,
    data.rating || 0,
    data.status || "active",
    data.bank_name || null,
    data.bank_branch || null,
    data.account_number || null,
    data.ifsc_code || null,
    vendor_id,
  ]);

  return result.rows[0];
};

export const getVendors = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.vendors ORDER BY vendor_id`,
  );
  return result.rows;
};

export const addItemsForVendor = async (vendorId, items, org_code) => {
  // ✅ Fetch schema automatically
  const schema = await getSchemaFromOrgCode(org_code);

  if (!vendorId) throw new Error("Vendor ID is required");
  if (!items) return [];

  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [items];
  if (!itemsArray.length) return [];

  // Prepare SQL placeholders and values for items insertion
  const itemValuesPlaceholders = itemsArray
    .map((_, idx) => {
      const offset = idx * 8;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${
        offset + 4
      }, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`;
    })
    .join(",");

  const itemValues = itemsArray.flatMap((item) => [
    item.item_code,
    item.item_name,
    item.root_category_id,
    item.category_id || null,
    item.variant_id || null,
    item.sub_variant_id || null,
    item.product_id || null,
    item.qty ?? 0,
  ]);

  // Insert items into the database
  const insertItemsQuery = `
    INSERT INTO ${schema}.items 
      (item_code, item_name, root_category_id, category_id, variant_id, sub_variant_id, product_id, qty)
    VALUES ${itemValuesPlaceholders}
    RETURNING *;
  `;
  const result = await thirdDB.query(insertItemsQuery, itemValues);
  const newItems = result.rows;

  // Associate all new items with the vendor safely
  if (newItems.length) {
    const vendorParams = newItems.flatMap((i) => [i.id, vendorId]);
    const vendorPlaceholders = newItems
      .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
      .join(",");

    await thirdDB.query(
      `INSERT INTO ${schema}.items_suppliers (item_id, vendor_id) VALUES ${vendorPlaceholders}`,
      vendorParams,
    );
  }

  return newItems;
};
