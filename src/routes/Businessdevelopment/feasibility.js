const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all feasibility requests
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM business_development
      ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE feasibility status
router.put("/:id", async (req, res) => {
  const { feasibility_status, feasibility_comments } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE business_development
       SET feasibility_status = $1,
           feasibility_comments = $2
       WHERE id = $3`,
      [feasibility_status, feasibility_comments, id]
    );

    res.json({ message: "Feasibility updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
