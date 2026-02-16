import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const updateDepartmentStatuses = async (
  reqId,
  departmentStatuses,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    UPDATE ${schema}.purchase_requests
    SET department_statuses = $1,
        updated_at = NOW()
    WHERE id = $2
  `;
  await thirdDB.query(query, [JSON.stringify(departmentStatuses), reqId]);
};


export const fetchSubmittedPurchaseRequests = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
    SELECT 
      pr.id,
      pr.department,
      pr.requested_by,
      pr.description,
      pr.priority,
      pr.required_date,
      pr.remarks,
      pr.created_at,
      pr.updated_at,
      pr.department_statuses,
      COALESCE(jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', pi.id,
          'item_code', pi.item_code,
          'item_name', pi.item_name,
          'quantity_required', pi.quantity_required,
          'vendors', COALESCE(vendors_data.vendors, '[]'::jsonb)
        )
      ) FILTER (WHERE pi.id IS NOT NULL), '[]'::jsonb) AS items
    FROM ${schema}.purchase_requests pr
    LEFT JOIN ${schema}.purchase_items pi ON pi.purchase_request_id = pr.id
    LEFT JOIN (
      SELECT iv.purchase_item_id,
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id', iv.id,
            'vendor_id', iv.vendor_id,
            'status', iv.status,
            'unit_price', iv.unit_price,
            'total_price', iv.total_price,
            'quotation_validity_date', iv.quotation_validity_date,
            'vendor_status_updated_by', iv.vendor_status_updated_by,
            'attachments', COALESCE(att.attachments, '[]'::jsonb),
            'comments', COALESCE(com.comments, '[]'::jsonb)
          )
        ) AS vendors
      FROM ${schema}.item_vendors iv
      LEFT JOIN (
        SELECT item_vendor_id,
          jsonb_agg(jsonb_build_object(
            'id', id,
            'file_name', file_name,
            'file_path', file_path,
            'uploaded_by', uploaded_by,
            'uploaded_at', uploaded_at
          )) AS attachments
        FROM ${schema}.vendor_attachments
        GROUP BY item_vendor_id
      ) att ON att.item_vendor_id = iv.id
      LEFT JOIN (
        SELECT item_vendor_id,
          jsonb_agg(jsonb_build_object(
            'id', id,
            'commented_by', commented_by,
            'comment', comment,
            'commented_at', commented_at
          )) AS comments
        FROM ${schema}.vendor_comments
        GROUP BY item_vendor_id
      ) com ON com.item_vendor_id = iv.id
      GROUP BY iv.purchase_item_id
    ) vendors_data ON vendors_data.purchase_item_id = pi.id
    WHERE pr.department_statuses @> '[{"department_status": "CREATED"}]'
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};


// export const updateFullPR = async (reqId, data, userId) => {
//   // 1️⃣ Update purchase_requests table
//   const prQuery = `
//     UPDATE purchase_requests
//     SET description = $1,
//         priority = $2,
//         required_date = $3,
//         remarks = $4,
//         updated_at = NOW()
//     WHERE id = $5
//   `;
//   await thirdDB.query(prQuery, [
//     data.description,
//     data.priority,
//     data.required_date,
//     data.remarks,
//     reqId,
//   ]);

//   // 2️⃣ Update each item
//   for (const item of data.items) {
//     const itemQuery = `
//       UPDATE purchase_items
//       SET item_code = $1,
//           item_name = $2,
//           quantity_required = $3
//       WHERE id = $4
//     `;
//     await thirdDB.query(itemQuery, [
//       item.item_code,
//       item.item_name,
//       item.quantity_required,
//       item.id,
//     ]);

//     // 3️⃣ Update vendors for this item
//     for (const vendor of item.vendors) {
//       const vendorQuery = `
//         UPDATE item_vendors
//         SET vendor_id = $1,
//             unit_price = $2,
//             total_price = $3,
//             quotation_validity_date = $4,
//             status = $5,
//             vendor_status_updated_by = $6
//         WHERE id = $7
//       `;
//       await thirdDB.query(vendorQuery, [
//         vendor.vendor_id,
//         vendor.unit_price,
//         vendor.unit_price * item.quantity_required,
//         vendor.quotation_validity_date,
//         vendor.status || "CREATED",
//         userId,
//         vendor.id,
//       ]);

//       // 4️⃣ Upsert attachments
//       if (vendor.attachments && vendor.attachments.length > 0) {
//         for (const att of vendor.attachments) {
//           if (att.id) {
//             // update existing
//             await thirdDB.query(
//               `UPDATE vendor_attachments
//                SET file_name=$1, file_path=$2, uploaded_at=NOW(), uploaded_by=$3
//                WHERE id=$4`,
//               [att.file_name, att.file_path, userId, att.id],
//             );
//           } else {
//             // insert new
//             await thirdDB.query(
//               `INSERT INTO vendor_attachments(item_vendor_id, file_name, file_path, uploaded_by, uploaded_at)
//                VALUES ($1,$2,$3,$4,NOW())`,
//               [vendor.id, att.file_name, att.file_path, userId],
//             );
//           }
//         }
//       }

//       // 5️⃣ Upsert comments
//       if (vendor.comments && vendor.comments.length > 0) {
//         for (const comment of vendor.comments) {
//           if (comment.id) {
//             await thirdDB.query(
//               `UPDATE vendor_comments
//                SET comment=$1, commented_at=NOW(), commented_by=$2
//                WHERE id=$3`,
//               [comment.comment, userId, comment.id],
//             );
//           } else {
//             await thirdDB.query(
//               `INSERT INTO vendor_comments(item_vendor_id, comment, commented_by, commented_at)
//                VALUES ($1,$2,$3,NOW())`,
//               [vendor.id, comment.comment, userId],
//             );
//           }
//         }
//       }
//     }
//   }

//   return { success: true };
// };


export const updateFullPR = async (reqId, data, userId, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  // 1️⃣ Update purchase_requests table
  const prQuery = `
    UPDATE ${schema}.purchase_requests
    SET description = $1,
        priority = $2,
        required_date = $3,
        remarks = $4,
        updated_at = NOW()
    WHERE id = $5
  `;
  await thirdDB.query(prQuery, [
    data.description,
    data.priority,
    data.required_date,
    data.remarks,
    reqId,
  ]);

  // 2️⃣ Update each item
  for (const item of data.items) {
    const itemQuery = `
      UPDATE ${schema}.purchase_items
      SET item_code = $1,
          item_name = $2,
          quantity_required = $3
      WHERE id = $4
    `;
    await thirdDB.query(itemQuery, [
      item.item_code,
      item.item_name,
      item.quantity_required,
      item.id,
    ]);

    // 3️⃣ Update vendors for this item
    for (const vendor of item.vendors) {
      const vendorQuery = `
        UPDATE ${schema}.item_vendors
        SET vendor_id = $1,
            unit_price = $2,
            total_price = $3,
            quotation_validity_date = $4,
            status = $5,
            vendor_status_updated_by = $6
        WHERE id = $7
      `;
      await thirdDB.query(vendorQuery, [
        vendor.vendor_id,
        vendor.unit_price,
        vendor.unit_price * item.quantity_required,
        vendor.quotation_validity_date,
        vendor.status || "CREATED",
        userId,
        vendor.id,
      ]);

      // 4️⃣ Upsert attachments
      if (vendor.attachments && vendor.attachments.length > 0) {
        for (const att of vendor.attachments) {
          if (att.id) {
            await thirdDB.query(
              `UPDATE ${schema}.vendor_attachments
               SET file_name=$1, file_path=$2, uploaded_at=NOW(), uploaded_by=$3
               WHERE id=$4`,
              [att.file_name, att.file_path, userId, att.id],
            );
          } else {
            await thirdDB.query(
              `INSERT INTO ${schema}.vendor_attachments
               (item_vendor_id, file_name, file_path, uploaded_by, uploaded_at)
               VALUES ($1,$2,$3,$4,NOW())`,
              [vendor.id, att.file_name, att.file_path, userId],
            );
          }
        }
      }

      // 5️⃣ Upsert comments
      if (vendor.comments && vendor.comments.length > 0) {
        for (const comment of vendor.comments) {
          if (comment.id) {
            await thirdDB.query(
              `UPDATE ${schema}.vendor_comments
               SET comment=$1, commented_at=NOW(), commented_by=$2
               WHERE id=$3`,
              [comment.comment, userId, comment.id],
            );
          } else {
            await thirdDB.query(
              `INSERT INTO ${schema}.vendor_comments
               (item_vendor_id, comment, commented_by, commented_at)
               VALUES ($1,$2,$3,NOW())`,
              [vendor.id, comment.comment, userId],
            );
          }
        }
      }
    }
  }

  return { success: true };
};
