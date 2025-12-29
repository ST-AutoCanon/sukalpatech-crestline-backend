import thirdDB from "../../config/dbThird.js";

export const createItemVendor = async (vendor, itemId) => {
  const query = `
    INSERT INTO item_vendors
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

export const fetchVendorsByItem = async (itemId) => {
  const result = await thirdDB.query(
    `SELECT * FROM item_vendors WHERE purchase_item_id = $1`,
    [itemId]
  );
  return result.rows;
};

export const updateVendorStatus = async (vendorId, status, updatedBy) => {
  const query = `
    UPDATE item_vendors
    SET status = $1,
        vendor_status_updated_by = $2,
        updated_at = NOW()
    WHERE id = $3
  `;
  await thirdDB.query(query, [status, updatedBy, vendorId]);
};
