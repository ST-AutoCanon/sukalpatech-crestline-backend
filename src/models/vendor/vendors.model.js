import thirdDB from "../../config/db.js";

export const createVendor = async (data) => {
  const query = `
    INSERT INTO vendors 
      (vendor_name, contact_person, phone, email, gst_number, pan_number, address, rating, status, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
  ]);

  return result.rows[0];
};

export const getVendors = async () => {
  const result = await thirdDB.query(
    `SELECT * FROM vendors ORDER BY vendor_id`
  );
  return result.rows;
};
