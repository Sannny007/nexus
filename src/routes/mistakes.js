import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT
      m.id, m.title, m.description, m.root_cause, m.fix, m.status, m.created_at,
      s.name AS skill_name,
      p.name AS project_name
      FROM mistakes m
      LEFT JOIN skills s ON s.id = m.skill_id
      LEFT JOIN projects p ON p.id = m.project_id
      WHERE m.user_id = $1
      ORDER BY m.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch mistakes" });
  }
});


router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { skillId, projectId, title, description, rootcause, fix } =req.body;

    if (!title) {
      return res.status(400).json({ messagae: "Title is required" });
    }

    const result = await pool.query(
      `INSERT INTO mistakes (user_id, skill_id, project_id, title, description, root_cause, fix)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [userId, skillId || null, projectId || null, title, description, rootcause, fix]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create mistake" });
  }
});


router.put("/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE mistakes SET status = 'resolved' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Mistake not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resolve mistake" });
  }
});


router.get("/patterns", async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT s.id AS skill_id, s.name AS skill_name, COUNT(*) AS mistake_count
      FROM mistakes m
      JOIN skills s ON s.id = m.skill_id
      WHERE m.user_id = $1
      GROUP BY s.id, s.name
      HAVING COUNT(*) >= 2
      ORDER BY mistake_count DESC`,
      [userId]
    );

    const patterns = result.rows.map((row) => ({
      ...row,
      mistake_count: parseInt(row.mistake_count, 10),
    }));

    res.status(200).json(patterns);
    // res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch mistake patterns" });
  }
});


export default router;