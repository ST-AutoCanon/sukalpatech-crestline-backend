import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const createPurchaseRequest = async (org_code, prData) => {
  // ✅ Fetch schema automatically
  console.log("pr org_codee:", org_code);
  const schema = await getSchemaFromOrgCode(org_code);

  // ✅ Dynamic schema query
  const query = `
    INSERT INTO ${schema}.purchase_requests
      (department, requested_by, description, priority, required_date, remarks, department_statuses)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id
  `;

  const values = [
    prData.department,
    prData.requested_by,
    prData.description,
    prData.priority,
    prData.required_date,
    prData.remarks,
    JSON.stringify(prData.department_statuses),
  ];

  const result = await thirdDB.query(query, values);

  return result.rows[0].id;
};

// -------------------------------
// Fetch All PRs
// -------------------------------
export const fetchAllPRs = async (org_code) => {
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
      ) FILTER (WHERE pi.id IS NOT NULL), '[]') AS items
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
    GROUP BY pr.id
    ORDER BY pr.id DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

// -------------------------------
// Fetch PR By ID
// -------------------------------
export const fetchPRById = async (prId, org_code) => {
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
      ) FILTER (WHERE pi.id IS NOT NULL), '[]') AS items
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
    WHERE pr.id = $1
    GROUP BY pr.id;
  `;

  const result = await thirdDB.query(query, [prId]);
  return result.rows[0] || null;
};

export const fetchFinanceApprovedPRs = async (org_code) => {
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
        FROM vendor_attachments
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
    WHERE (pr.department_statuses -> -1 ->> 'department_status') = 'FINANCE APPROVED'
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

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

  if (!statusesToAppend.length) return;

  const updatedStatuses = [...existingStatuses, ...statusesToAppend];

  const updateQuery = `
    UPDATE ${schema}.purchase_requests
    SET department_statuses = $1,
        updated_at = NOW()
    WHERE id = $2
  `;
  await thirdDB.query(updateQuery, [JSON.stringify(updatedStatuses), reqId]);
};

export const fetchFinanceRejectedPRs = async () => {
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
    FROM purchase_requests pr
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
      FROM item_vendors iv
      LEFT JOIN (
        SELECT item_vendor_id,
          jsonb_agg(jsonb_build_object(
            'id', id,
            'file_name', file_name,
            'file_path', file_path,
            'uploaded_by', uploaded_by,
            'uploaded_at', uploaded_at
          )) AS attachments
        FROM vendor_attachments
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
        FROM vendor_comments
        GROUP BY item_vendor_id
      ) com ON com.item_vendor_id = iv.id
      GROUP BY iv.purchase_item_id
    ) vendors_data ON vendors_data.purchase_item_id = pi.id
    WHERE (pr.department_statuses -> -1 ->> 'department_status') = 'FINANCE REJECTED'
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

// -------------------------------
// Update Full Purchase Request
// -------------------------------
// export const updateFullPR = async (prId, prData) => {
//   // 1️⃣ Update main PR fields
//   const updatePRQuery = `
//     UPDATE purchase_requests
//     SET
//       department = $1,
//       requested_by = $2,
//       description = $3,
//       priority = $4,
//       required_date = $5,
//       remarks = $6,
//       updated_at = NOW()
//     WHERE id = $7
//   `;
//   const prValues = [
//     prData.department,
//     prData.requested_by,
//     prData.description,
//     prData.priority,
//     prData.required_date,
//     prData.remarks,
//     prId,
//   ];
//   await thirdDB.query(updatePRQuery, prValues);

//   // 2️⃣ Update or Insert Department Statuses
//   if (prData.department_statuses) {
//     for (const ds of prData.department_statuses) {
//       if (ds.id) {
//         // Existing → update
//         const updateDSQuery = `
//           UPDATE department_statuses
//           SET department_status = $1,
//               department_comment = $2,
//               status_updated_by = $3,
//               updated_at = NOW()
//           WHERE id = $4
//         `;
//         await thirdDB.query(updateDSQuery, [
//           ds.department_status,
//           ds.department_comment,
//           ds.status_updated_by,
//           ds.id,
//         ]);
//       } else {
//         // New → insert
//         const insertDSQuery = `
//           INSERT INTO department_statuses
//           (purchase_request_id, department_status, department_comment, status_updated_by, updated_at)
//           VALUES ($1,$2,$3,$4,NOW())
//         `;
//         await thirdDB.query(insertDSQuery, [
//           prId,
//           ds.department_status,
//           ds.department_comment,
//           ds.status_updated_by,
//         ]);
//       }
//     }
//   }

//   // 3️⃣ Update or Insert Items
//   for (const item of prData.items) {
//     let itemId;

//     if (item.id) {
//       // Existing item → update
//       const updateItemQuery = `
//         UPDATE purchase_items
//         SET item_code = $1, item_name = $2, quantity_required = $3
//         WHERE id = $4
//       `;
//       await thirdDB.query(updateItemQuery, [
//         item.item_code,
//         item.item_name,
//         item.quantity_required,
//         item.id,
//       ]);
//       itemId = item.id;
//     } else {
//       // New item → insert
//       const insertItemQuery = `
//         INSERT INTO purchase_items (purchase_request_id, item_code, item_name, quantity_required)
//         VALUES ($1,$2,$3,$4)
//         RETURNING id
//       `;
//       const res = await thirdDB.query(insertItemQuery, [
//         prId,
//         item.item_code,
//         item.item_name,
//         item.quantity_required,
//       ]);
//       itemId = res.rows[0].id;
//     }

//     // 4️⃣ Update or Insert Vendors
//     if (item.vendors) {
//       for (const vendor of item.vendors) {
//         let vendorId;

//         if (vendor.id) {
//           // Existing vendor → update
//           const updateVendorQuery = `
//             UPDATE item_vendors
//             SET vendor_id = $1, status = $2, unit_price = $3, total_price = $4,
//                 quotation_validity_date = $5, vendor_status_updated_by = $6
//             WHERE id = $7
//           `;
//           await thirdDB.query(updateVendorQuery, [
//             vendor.vendor_id,
//             vendor.status,
//             vendor.unit_price,
//             vendor.total_price,
//             vendor.quotation_validity_date,
//             vendor.vendor_status_updated_by,
//             vendor.id,
//           ]);
//           vendorId = vendor.id;
//         } else {
//           // New vendor → insert
//           const insertVendorQuery = `
//             INSERT INTO item_vendors
//             (purchase_item_id, vendor_id, status, unit_price, total_price, quotation_validity_date, vendor_status_updated_by)
//             VALUES ($1,$2,$3,$4,$5,$6,$7)
//             RETURNING id
//           `;
//           const res = await thirdDB.query(insertVendorQuery, [
//             itemId,
//             vendor.vendor_id,
//             vendor.status,
//             vendor.unit_price,
//             vendor.total_price,
//             vendor.quotation_validity_date,
//             vendor.vendor_status_updated_by,
//           ]);
//           vendorId = res.rows[0].id;
//         }

//         // 5️⃣ Update / Insert Attachments
//         if (vendor.attachments) {
//           for (const att of vendor.attachments) {
//             if (att.id) {
//               const updateAttQuery = `
//                 UPDATE vendor_attachments
//                 SET file_name = $1, file_path = $2, uploaded_by = $3, uploaded_at = $4
//                 WHERE id = $5
//               `;
//               await thirdDB.query(updateAttQuery, [
//                 att.file_name,
//                 att.file_path.replace(/^.*[\\\/]/, ""),
//                 att.uploaded_by,
//                 att.uploaded_at,
//                 att.id,
//               ]);
//             } else {
//               const insertAttQuery = `
//                 INSERT INTO vendor_attachments (item_vendor_id, file_name, file_path, uploaded_by, uploaded_at)
//                 VALUES ($1,$2,$3,$4,$5)
//               `;
//               await thirdDB.query(insertAttQuery, [
//                 vendorId,
//                 att.file_name,
//                 att.file_path.replace(/^.*[\\\/]/, ""),
//                 att.uploaded_by,
//                 att.uploaded_at,
//               ]);
//             }
//           }
//         }

//         // 6️⃣ Update / Insert Comments
//         if (vendor.comments) {
//           for (const com of vendor.comments) {
//             if (com.id) {
//               const updateComQuery = `
//                 UPDATE vendor_comments
//                 SET commented_by = $1, comment = $2, commented_at = $3
//                 WHERE id = $4
//               `;
//               await thirdDB.query(updateComQuery, [
//                 com.commented_by,
//                 com.comment,
//                 com.commented_at,
//                 com.id,
//               ]);
//             } else {
//               const insertComQuery = `
//                 INSERT INTO vendor_comments (item_vendor_id, commented_by, comment, commented_at)
//                 VALUES ($1,$2,$3,$4)
//               `;
//               await thirdDB.query(insertComQuery, [
//                 vendorId,
//                 com.commented_by,
//                 com.comment,
//                 com.commented_at,
//               ]);
//             }
//           }
//         }
//       }
//     }
//   }
// };

export const updateFullPR = async (prId, prData, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const updatePRQuery = `
    UPDATE ${schema}.purchase_requests
    SET
      department = $1,
      requested_by = $2,
      description = $3,
      priority = $4,
      required_date = $5,
      remarks = $6,
      updated_at = NOW()
    WHERE id = $7
  `;
  await thirdDB.query(updatePRQuery, [
    prData.department,
    prData.requested_by,
    prData.description,
    prData.priority,
    prData.required_date,
    prData.remarks,
    prId,
  ]);

  if (prData.department_statuses) {
    for (const ds of prData.department_statuses) {
      if (ds.id) {
        await thirdDB.query(
          `UPDATE ${schema}.department_statuses
           SET department_status = $1,
               department_comment = $2,
               status_updated_by = $3,
               updated_at = NOW()
           WHERE id = $4`,
          [
            ds.department_status,
            ds.department_comment,
            ds.status_updated_by,
            ds.id,
          ],
        );
      } else {
        await thirdDB.query(
          `INSERT INTO ${schema}.department_statuses
           (purchase_request_id, department_status, department_comment, status_updated_by, updated_at)
           VALUES ($1,$2,$3,$4,NOW())`,
          [
            prId,
            ds.department_status,
            ds.department_comment,
            ds.status_updated_by,
          ],
        );
      }
    }
  }

  for (const item of prData.items) {
    let itemId;

    if (item.id) {
      await thirdDB.query(
        `UPDATE ${schema}.purchase_items
         SET item_code = $1, item_name = $2, quantity_required = $3
         WHERE id = $4`,
        [item.item_code, item.item_name, item.quantity_required, item.id],
      );
      itemId = item.id;
    } else {
      const res = await thirdDB.query(
        `INSERT INTO ${schema}.purchase_items
         (purchase_request_id, item_code, item_name, quantity_required)
         VALUES ($1,$2,$3,$4)
         RETURNING id`,
        [prId, item.item_code, item.item_name, item.quantity_required],
      );
      itemId = res.rows[0].id;
    }

    if (item.vendors) {
      for (const vendor of item.vendors) {
        let vendorId;

        if (vendor.id) {
          await thirdDB.query(
            `UPDATE ${schema}.item_vendors
             SET vendor_id = $1, status = $2, unit_price = $3, total_price = $4,
                 quotation_validity_date = $5, vendor_status_updated_by = $6
             WHERE id = $7`,
            [
              vendor.vendor_id,
              vendor.status,
              vendor.unit_price,
              vendor.total_price,
              vendor.quotation_validity_date,
              vendor.vendor_status_updated_by,
              vendor.id,
            ],
          );
          vendorId = vendor.id;
        } else {
          const res = await thirdDB.query(
            `INSERT INTO ${schema}.item_vendors
             (purchase_item_id, vendor_id, status, unit_price, total_price, quotation_validity_date, vendor_status_updated_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING id`,
            [
              itemId,
              vendor.vendor_id,
              vendor.status,
              vendor.unit_price,
              vendor.total_price,
              vendor.quotation_validity_date,
              vendor.vendor_status_updated_by,
            ],
          );
          vendorId = res.rows[0].id;
        }

        if (vendor.attachments) {
          for (const att of vendor.attachments) {
            if (att.id) {
              await thirdDB.query(
                `UPDATE ${schema}.vendor_attachments
                 SET file_name=$1, file_path=$2, uploaded_by=$3, uploaded_at=$4
                 WHERE id=$5`,
                [
                  att.file_name,
                  att.file_path.replace(/^.*[\\\/]/, ""),
                  att.uploaded_by,
                  att.uploaded_at,
                  att.id,
                ],
              );
            } else {
              await thirdDB.query(
                `INSERT INTO ${schema}.vendor_attachments
                 (item_vendor_id, file_name, file_path, uploaded_by, uploaded_at)
                 VALUES ($1,$2,$3,$4,$5)`,
                [
                  vendorId,
                  att.file_name,
                  att.file_path.replace(/^.*[\\\/]/, ""),
                  att.uploaded_by,
                  att.uploaded_at,
                ],
              );
            }
          }
        }

        if (vendor.comments) {
          for (const com of vendor.comments) {
            if (com.id) {
              await thirdDB.query(
                `UPDATE ${schema}.vendor_comments
                 SET commented_by=$1, comment=$2, commented_at=$3
                 WHERE id=$4`,
                [com.commented_by, com.comment, com.commented_at, com.id],
              );
            } else {
              await thirdDB.query(
                `INSERT INTO ${schema}.vendor_comments
                 (item_vendor_id, commented_by, comment, commented_at)
                 VALUES ($1,$2,$3,$4)`,
                [vendorId, com.commented_by, com.comment, com.commented_at],
              );
            }
          }
        }
      }
    }
  }
};


// export const fetchFinancePendingPRs = async () => {
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
//     WHERE (pr.department_statuses -> -1 ->> 'department_status') = 'FINANCE PENDING'
//     GROUP BY pr.id
//     ORDER BY pr.updated_at DESC;
//   `;

//   const result = await thirdDB.query(query);
//   return result.rows;
// };

// models/purchaseRequestModel.ts


export const fetchFinancePendingPRs = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT ...
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
    WHERE (pr.department_statuses -> -1 ->> 'department_status') = 'FINANCE PENDING'
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};


// export const fetchPRsByStatus = async (statusKeyword = "") => {
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
//     WHERE (pr.department_statuses -> -1 ->> 'department_status') ILIKE $1
//     GROUP BY pr.id
//     ORDER BY pr.updated_at DESC;
//   `;

//   const result = await thirdDB.query(query, [
//     `%${statusKeyword.toUpperCase()}%`,
//   ]);
//   return result.rows;
// };


export const fetchPRsByStatus = async (statusKeyword = "", org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT ...
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
    WHERE (pr.department_statuses -> -1 ->> 'department_status') ILIKE $1
    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query, [
    `%${statusKeyword.toUpperCase()}%`,
  ]);

  return result.rows;
};
