import pool from "../db.js";

/**
 * GET all feasibility records
 */
export const getAllFeasibilityFromDB = async () => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM business_development
      ORDER BY id DESC
    `);

    return result.rows;
  } catch (error) {
    console.error("❌ Error fetching feasibility from DB:", error);
    throw error;
  }
};


/**
 * UPDATE feasibility status in DB
 */
export const updateFeasibilityInDB = async (id, status, comments) => {
  try {
    await pool.query(
      `UPDATE business_development
       SET feasibility_status = $1,
           feasibility_comments = $2
       WHERE id = $3`,
      [status, comments, id]
    );
  } catch (error) {
    console.error("❌ Error updating feasibility in DB:", error);
    throw error;
  }
};