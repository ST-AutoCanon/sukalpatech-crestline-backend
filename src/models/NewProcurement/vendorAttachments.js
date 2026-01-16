import thirdDB from "../../config/dbfirst.js";

export const createVendorAttachment = async (attachment, vendorId) => {
  const query = `
    INSERT INTO vendor_attachments
      (item_vendor_id, file_name, file_path, uploaded_by)
    VALUES ($1,$2,$3,$4)
  `;
  const values = [
    vendorId,
    attachment.file_name,
    attachment.file_path,
    attachment.uploaded_by,
  ];
  await thirdDB.query(query, values);
};

export const fetchAttachmentsByVendor = async (vendorId) => {
  const result = await thirdDB.query(
    `SELECT * FROM vendor_attachments WHERE vendor_id = $1`,
    [vendorId]
  );
  return result.rows;
};
