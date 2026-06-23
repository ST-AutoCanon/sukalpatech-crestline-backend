import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

const NotificationModel = {
  // CREATE
  create: async (data, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);

    const query = `
      INSERT INTO ${schema}.notifications (
        title,
        message,
        type,
        recipient_id,
        recipient_role,
        related_bd_id,
        metadata,
        is_read,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      RETURNING *;
    `;

    const values = [
      data.title,
      data.message,
      data.type || "general",
      data.recipient_id || null,
      data.recipient_role || null,
      data.related_bd_id || null,
      data.metadata || null,
      false,
    ];

    const { rows } = await thirdDB.query(query, values);
    return rows[0];
  },

  // GET ALL
  findAll: async (org_code, filters = {}) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `
    SELECT *
    FROM ${schema}.notifications
    WHERE 1=1
  `;

  const values = [];

  // Department notifications
  // Department notifications (MULTI ROLE FIX)
if (filters.recipient_roles && filters.recipient_roles.length > 0) {
  values.push(filters.recipient_roles);

  query += `
    AND LOWER(recipient_role) = ANY($${values.length}::text[])
  `;
}

  // User-specific notifications
  if (filters.recipient_id) {
    values.push(filters.recipient_id);

    query += `
      AND (
        recipient_id = $${values.length}
        OR recipient_id IS NULL
      )
    `;
  }

  query += `
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const { rows } = await thirdDB.query(query, values);

  return rows;
},
  // MARK AS READ
  markAsRead: async (id, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);

    const { rows } = await thirdDB.query(
      `UPDATE ${schema}.notifications
       SET is_read = true
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    return rows[0];
  },

  // DELETE
  delete: async (id, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);

    const { rows } = await thirdDB.query(
      `DELETE FROM ${schema}.notifications
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    return rows[0];
  },
};

export default NotificationModel;