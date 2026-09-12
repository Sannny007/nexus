import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" })
    }
    const result = await pool.query("INSERT INTO users (name, email) VALUES($1, $2) RETURNING *", [name, email] );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user", });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const result = await pool.query(
      `UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found", });
    }
    res.status(200).json(result.rows[0]); 
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to update user", });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *", [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found", });
    }

    res.status(200).json({ message: "User deleted successfully", user: result.rows[0], });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to delete user", });
  }
});

export default router;