import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../db.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.js";

const router = Router();

const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  const genericOk = {
    message: "If this email can be registered, a verification link has been sent.",
  };

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO users (name, email, password, is_verified, verification_token, verification_expires)
       VALUES ($1, $2, $3, false, $4, $5)`,
      [name, email, hashedPassword, hashToken(rawToken), expires]
    );

    await sendVerificationEmail(email, rawToken);
    res.status(201).json(genericOk);
  } catch (err) {
    if (err.code === "23505") return res.status(201).json(genericOk);
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (typeof token !== "string" || !token) {
      return res.status(400).json({ error: "Invalid or missing token" });
    }

    const result = await pool.query(
      "SELECT id, verification_expires FROM users WHERE verification_token = $1",
      [hashToken(token)]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or already-used token" });
    }

    const user = result.rows[0];
    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ error: "Verification link has expired" });
    }

    await pool.query(
      `UPDATE users
       SET is_verified = true, verification_token = NULL, verification_expires = NULL
       WHERE id = $1`,
      [user.id]
    );

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, name, email, password, is_verified FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user ? user.password : DUMMY_HASH
    );

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: "Please verify your email before logging in" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;