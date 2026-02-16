import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// Update department_statuses for a specific request
export const updateDepartmentStatuses = async (
  reqId,
  newStatuses,
  org_code,
) => {
  // ✅ Fetch schema automatically
  const schema = await getSchemaFromOrgCode(org_code);

  const fetchQuery = `
    SELECT department_statuses
    FROM ${schema}.purchase_requests
    WHERE id = $1
  `;
  const result = await thirdDB.query(fetchQuery, [reqId]);
  const existingStatuses = result.rows[0]?.department_statuses || [];

  const statusesToAppend = newStatuses.filter((newStatus) => {
    return !existingStatuses.some(
      (existing) =>
        existing.department_status === newStatus.department_status &&
        existing.department_comment === newStatus.department_comment,
    );
  });

  const updatedStatuses = [...existingStatuses, ...statusesToAppend];

  const updateQuery = `
    UPDATE ${schema}.purchase_requests
    SET department_statuses = $1,
        updated_at = NOW()
    WHERE id = $2
  `;
  await thirdDB.query(updateQuery, [JSON.stringify(updatedStatuses), reqId]);
};

// Fetch all Store PRs with FINANCE APPROVED status
// export const fetchFinanceApprovedStoreRequests = async () => {
//   const query = `
//     SELECT
//       pr.id,
//       pr.department,
//       pr.requested_by,
//       pr.description,
//       pr.priority,
//       pr.required_date,
//       pr.remarks,
//       pr.created_at,
//       pr.updated_at,
//       pr.department_statuses,
//       COALESCE(jsonb_agg(
//         DISTINCT jsonb_build_object(
//           'id', pi.id,
//           'item_code', pi.item_code,
//           'item_name', pi.item_name,
//           'quantity_required', pi.quantity_required,
//           'vendors', COALESCE(vendors_data.vendors, '[]'::jsonb)
//         )
//       ) FILTER (WHERE pi.id IS NOT NULL), '[]'::jsonb) AS items
//     FROM purchase_requests pr
//     LEFT JOIN purchase_items pi ON pi.purchase_request_id = pr.id
//     LEFT JOIN (
//       SELECT iv.purchase_item_id,
//         jsonb_agg(
//           DISTINCT jsonb_build_object(
//             'id', iv.id,
//             'vendor_id', iv.vendor_id,
//             'status', iv.status,
//             'unit_price', iv.unit_price,
//             'total_price', iv.total_price,
//             'quotation_validity_date', iv.quotation_validity_date,
//             'vendor_status_updated_by', iv.vendor_status_updated_by,
//             'attachments', COALESCE(att.attachments, '[]'::jsonb),
//             'comments', COALESCE(com.comments, '[]'::jsonb)
//           )
//         ) AS vendors
//       FROM item_vendors iv
//       LEFT JOIN (
//         SELECT item_vendor_id,
//           jsonb_agg(jsonb_build_object(
//             'id', id,
//             'file_name', file_name,
//             'file_path', file_path,
//             'uploaded_by', uploaded_by,
//             'uploaded_at', uploaded_at
//           )) AS attachments
//         FROM vendor_attachments
//         GROUP BY item_vendor_id
//       ) att ON att.item_vendor_id = iv.id
//       LEFT JOIN (
//         SELECT item_vendor_id,
//           jsonb_agg(jsonb_build_object(
//             'id', id,
//             'commented_by', commented_by,
//             'comment', comment,
//             'commented_at', commented_at
//           )) AS comments
//         FROM vendor_comments
//         GROUP BY item_vendor_id
//       ) com ON com.item_vendor_id = iv.id
//       GROUP BY iv.purchase_item_id
//     ) vendors_data ON vendors_data.purchase_item_id = pi.id
//     WHERE pr.department_statuses @> '[{"department_status": "FINANCE APPROVED"}]'
//     GROUP BY pr.id
//     ORDER BY pr.updated_at DESC;
//   `;

//   const result = await thirdDB.query(query);
//   return result.rows;
// };

// Fetch all Store PRs where the last department_status is FINANCE APPROVED
export const fetchFinanceApprovedStoreRequests = async (org_code) => {
  // ✅ Fetch schema automatically
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
    LEFT JOIN purchase_items pi ON pi.purchase_request_id = pr.id
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
      FROM  ${schema}.item_vendors iv
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
    WHERE (pr.department_statuses -> -1 ->> 'department_status') = 'PR APPROVED'
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};
