import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/auth.js";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.userId]
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

router.put("/me", validate(updateProfileSchema), async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, req.userId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
      [name, email, req.userId]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.put("/me/password", validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.userId]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      req.userId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

export default router;