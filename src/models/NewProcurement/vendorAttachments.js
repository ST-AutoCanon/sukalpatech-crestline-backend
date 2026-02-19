import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const createVendorAttachment = async (
  attachment,
  vendorId,
  org_code,
) => {
  // ✅ Fetch schema automatically
  console.log("Creating attachment  org_code:", org_code);
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.vendor_attachments
      (item_vendor_id, file_name, file_path, uploaded_by)
    VALUES ($1,$2,$3,$4)
  `;
  const values = [
    vendorId,
    attachment.file_name,
    attachment.file_path,
    attachment.uploaded_by,
  ];
  console.log("Values to insert:", values);
  await thirdDB.query(query, values);
};

export const fetchAttachmentsByVendor = async (vendorId, org_code) => {
  // ✅ Fetch schema automatically
  const schema = await getSchemaFromOrgCode(org_code);
  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.vendor_attachments WHERE item_vendor_id = $1`,
    [vendorId],
  );
  return result.rows;
};
