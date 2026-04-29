import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

export const updateDepartmentStatuses = async (
  reqId,
  newStatuses,
  org_code,
) => {
  // 1️⃣ Fetch existing department_statuses
  const schema = await getSchemaFromOrgCode(org_code);
  const fetchQuery = `
    SELECT department_statuses
    FROM ${schema}.purchase_requests
    WHERE id = $1
  `;
  const result = await thirdDB.query(fetchQuery, [reqId]);
  const existingStatuses = result.rows[0]?.department_statuses || [];

  // 2️⃣ Filter new statuses to append only if not already present
  const statusesToAppend = newStatuses.filter((newStatus) => {
    return !existingStatuses.some(
      (existing) =>
        existing.department_status === newStatus.department_status &&
        existing.department_comment === newStatus.department_comment,
    );
  });

  // 3️⃣ Append new statuses if any
  const updatedStatuses = [...existingStatuses, ...statusesToAppend];

  // 4️⃣ Update DB
  const updateQuery = `
    UPDATE ${schema}.purchase_requests
    SET department_statuses = $1,
        updated_at = NOW()
    WHERE id = $2
  `;
  await thirdDB.query(updateQuery, [JSON.stringify(updatedStatuses), reqId]);
};

/**
 * Fetch all Finance PRs with APPROVED department status
 * Includes items, vendors, attachments, and comments
 */
export const fetchApprovedFinanceRequests = async (org_code) => {
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

      -- ✅ PAYMENT FIELDS ADDED HERE
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name,

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

    LEFT JOIN ${schema}.pr_finance_payment_details fpd
      ON fpd.purchase_request_id = pr.id

    LEFT JOIN ${schema}.purchase_items pi
      ON pi.purchase_request_id = pr.id

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

    WHERE pr.department_statuses @> '[{"department_status": "Feasibility APPROVED"}]'
    AND NOT (
      LOWER(COALESCE(fpd.payment_stage, '')) LIKE '%final%'
      OR COALESCE(fpd.final_completed::text, 'false') = 'true'
    )

    GROUP BY pr.id,
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name

    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

/**
 * Fetch all Finance PRs with APPROVED department status
 * Includes items, vendors, attachments, and comments
 */
export const fetchRejectedFinanceRequests = async (org_code) => {
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

    LEFT JOIN ${schema}.purchase_items pi
      ON pi.purchase_request_id = pr.id

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

    WHERE pr.department_statuses @> '[{"department_status": "Feasibility REJECTED"}]'

    GROUP BY pr.id
    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

/**
 * Fetch all Finance PRs with APPROVED department status
 * Includes items, vendors, attachments, and comments
 */
export const fetchPendingFinanceRequests = async (org_code) => {
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

      -- ✅ PAYMENT FIELDS ADDED
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name,

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

    LEFT JOIN ${schema}.pr_finance_payment_details fpd
      ON fpd.purchase_request_id = pr.id

    LEFT JOIN ${schema}.purchase_items pi
      ON pi.purchase_request_id = pr.id

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

    WHERE 
      pr.department_statuses @> '[{"department_status": "Feasibility PENDING"}]'

    GROUP BY pr.id,
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name

    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

export const fetchPartialPaymentFinanceRequests = async (org_code) => {
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

      -- ✅ PAYMENT FIELDS ADDED
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name,

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

    LEFT JOIN ${schema}.pr_finance_payment_details fpd
      ON fpd.purchase_request_id = pr.id

    LEFT JOIN ${schema}.purchase_items pi
      ON pi.purchase_request_id = pr.id

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

    WHERE 
      pr.department_statuses @> '[{"department_status": "Feasibility APPROVED"}]'
      AND LOWER(TRIM(fpd.payment_stage)) = 'partial'
      AND NOT (
        LOWER(COALESCE(fpd.payment_stage, '')) LIKE '%final%'
        OR COALESCE(fpd.final_completed::text, 'false') = 'true'
      )

    GROUP BY pr.id,
      fpd.payment_stage,
      fpd.partial_percentage,
      fpd.final_completed,
      fpd.finance_comment,
      fpd.payment_proof_file_path,
      fpd.payment_proof_file_name

    ORDER BY pr.updated_at DESC;
  `;

  const result = await thirdDB.query(query);
  return result.rows;
};

export const getFinanceRequestById = async (id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `
    SELECT 
      pr.*,

      -- ✅ Payment
      json_build_object(
        'payment_stage', fpd.payment_stage,
        'partial_percentage', fpd.partial_percentage,
        'final_completed', fpd.final_completed,
        'finance_comment', fpd.finance_comment,
        'payment_proof_file_path', fpd.payment_proof_file_path,
        'payment_proof_file_name', fpd.payment_proof_file_name
      ) AS finance_payment_details,

      -- ✅ Order Details
      json_build_object(
        'order_placed_at', od.order_placed_at,
        'expected_delivery_date', od.expected_delivery_date,
        'transport_mode', od.transport_mode,
        'in_house_type', od.in_house_type,
        'vendor_address', od.vendor_address,
        'po_file_path', od.po_file_path,
        'po_file_name', od.po_file_name
      ) AS order_details,

      -- ✅ Store Receiving Details (FIXED)
      json_build_object(
        'quantity_status', sr.quantity_status,
        'partial_quantity', sr.partial_quantity,
        'rejection_reason', sr.rejection_reason,
        'building', sr.building,
        'rack',
  CASE 
    WHEN sr.rack = 'R1' THEN 'Rack1'
    WHEN sr.rack = 'R2' THEN 'Rack2'
    ELSE sr.rack
  END
      ) AS order_receiving_details,

      -- ✅ Items + Vendors + Comments
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

    LEFT JOIN ${schema}.pr_finance_payment_details fpd
      ON pr.id = fpd.purchase_request_id

    LEFT JOIN ${schema}.pr_order_details od
      ON pr.id = od.purchase_request_id

    -- ✅ FIXED TABLE
    LEFT JOIN ${schema}.pr_store_receiving_details sr
      ON pr.id = sr.purchase_request_id

    LEFT JOIN ${schema}.purchase_items pi
      ON pi.purchase_request_id = pr.id

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

    GROUP BY 
      pr.id,
      fpd.payment_stage, fpd.partial_percentage, fpd.final_completed,
      fpd.finance_comment, fpd.payment_proof_file_path, fpd.payment_proof_file_name,

      od.order_placed_at, od.expected_delivery_date, od.transport_mode,
      od.in_house_type, od.vendor_address, od.po_file_path, od.po_file_name,

      sr.quantity_status, sr.partial_quantity, sr.rejection_reason,
      sr.building, sr.rack
    `,
    [id]
  );
  // ✅ FETCH FINANCE PAYMENT HISTORY
const historyResult = await thirdDB.query(
  `
  SELECT 
    id,
    purchase_request_id,
    payment_stage,
    partial_percentage,
    final_completed,
    finance_comment,
    payment_proof_file_name,
    payment_proof_file_path,
    created_at
    
  FROM ${schema}.pr_finance_payment_details
  WHERE purchase_request_id = $1
  ORDER BY created_at DESC
  `,
  [id]
);

// ✅ Attach to response
result.rows[0].finance_payment_details_history = historyResult.rows;

  return result.rows[0];
};
export const getFinancePaymentHistory = async (id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `
    SELECT 
      id,
      purchase_request_id,
      payment_stage,
      partial_percentage,
      final_completed,
      finance_comment,
      payment_proof_file_name,
      payment_proof_file_path,
      created_at
    FROM ${schema}.pr_finance_payment_history   -- ✅ FIXED TABLE
    WHERE purchase_request_id = $1
    ORDER BY created_at DESC
    `,
    [id]
  );

  return result.rows;
};