import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// export const createVendorComment = async (comment, vendorId) => {
//   const query = `
//     INSERT INTO vendor_comments
//       (item_vendor_id, commented_by, comment)
//     VALUES ($1,$2,$3)
//   `;
//   const values = [vendorId, comment.commented_by, comment.comment];
//   await thirdDB.query(query, values);
// };

export const createVendorComment = async (
  comment,
  vendorId,
  departmentId,
  org_code,
) => {
  // ✅ Fetch schema automatically
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.vendor_comments
      (item_vendor_id, commented_by, comment, department_id)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [
    vendorId,
    comment.commented_by,
    comment.comment,
    departmentId,
  ];
  await thirdDB.query(query, values);
};

// export const fetchCommentsByVendor = async (vendorId) => {
//   const result = await thirdDB.query(
//     `SELECT * FROM vendor_comments WHERE vendor_id = $1`,
//     [vendorId]
//   );
//   return result.rows;
// };
export const fetchCommentsByVendor = async (vendorId, org_code) => {
  // ✅ Fetch schema automatically
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `SELECT * FROM ${schema}.vendor_comments WHERE item_vendor_id = $1`,
    [vendorId],
  );
  return result.rows;
};
