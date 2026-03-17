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

    const values = [];
    const conditions = [];

    // user-specific
    if (filters.recipient_id != null) {
      values.push(filters.recipient_id);
      conditions.push(`recipient_id = $${values.length}`);
    }

    // role-based
    if (filters.recipient_role) {
      values.push(filters.recipient_role);
      conditions.push(`recipient_role = $${values.length}`);
    }

    let query = `SELECT * FROM ${schema}.notifications`;
    if (conditions.length) {
      query += ` WHERE (${conditions.join(" OR ")})`;
    }
    query += ` ORDER BY created_at DESC`;

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
