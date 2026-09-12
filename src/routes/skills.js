import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.put("/:skillId/practice", async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = 1;

    const result = await pool.query(
      `UPDATE user_skills
      SET last_practiced_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND skill_id = $2
      RETURNING *`,
      [userId, skillId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found for this user" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update practice timestamp" });
  }
});

export default router;