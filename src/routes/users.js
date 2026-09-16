import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";

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



router.get("/me", async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1", [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});



router.put("/me", async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const existing = await pool.query(
      "SELECT users FROM users WHERE email = $1 AND id != $2", [email, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email", [name, email, userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


router.put("/me/password", async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1", [userId]
    );

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

export default router;