import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const createItemVendor = async (vendor, itemId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    INSERT INTO ${schema}.item_vendors
      (purchase_item_id, vendor_id, unit_price, total_price, quotation_validity_date, status, vendor_status_updated_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
  `;
  const values = [
    itemId,
    vendor.vendor_id,
    vendor.unit_price,
    vendor.total_price,
    vendor.quotation_validity_date,
    vendor.status,
    vendor.vendor_status_updated_by,
  ];
  const result = await thirdDB.query(query, values);
  return result.rows[0].id;
};

export const fetchVendorsByItem = async (itemId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.item_vendors WHERE purchase_item_id = $1`,
    [itemId],
  );
  return result.rows;
};

export const updateVendorStatus = async (vendorId, status, updatedBy, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    UPDATE ${schema}.item_vendors
    SET status = $1,
        vendor_status_updated_by = $2,
        updated_at = NOW()
    WHERE id = $3
  `;
  await thirdDB.query(query, [status, updatedBy, vendorId]);
};
