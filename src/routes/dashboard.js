import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/summary", async (req, res) => {
  try {
    const userId = req.userId;
    const projectsResult = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE user_id = $1", [userId]
    );

    const skillsResult = await pool.query(
      `SELECT s.id AS skill_id, s.name, s.category, us.level, us.last_practiced_at
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1`,
      [userId]
    );

    const DECAY_WINDOW_DAYS = 90;
    const FLOOR = 20;

    const skillsWithScore = skillsResult.rows.map((skill) => {
      const daysSince =
        (Date.now() - new Date(skill.last_practiced_at).getTime()) / (1000 * 60 * 60 * 24);

      const rawScore =
        100 - (daysSince / DECAY_WINDOW_DAYS) * (100 - FLOOR);

      const decayScore = Math.max(FLOOR, Math.min(100, Math.round(rawScore)));

      return { ...skill, decayScore };
    });

    const avgKnowledgeStrength = Math.round(
      skillsWithScore.reduce((sum, s) => sum + s.decayScore, 0) / skillsWithScore.length
    );

    res.status(200).json({
      totalProjects: parseInt(projectsResult.rows[0].count, 10),
      totalSkills: skillsWithScore.length,
      knowledgeStrength: avgKnowledgeStrength,
      skills: skillsWithScore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

router.get("/timeline", async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 'mistake' AS event_type, title, created_at AS event_time
       FROM mistakes
       WHERE user_id = $1

       UNION ALL

       SELECT 'practice' AS event_type, s.name AS title, us.last_practiced_at AS event_time
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1

       UNION ALL

       SELECT 'project' AS event_type, name AS title, created_at AS event_time
       FROM projects
       WHERE user_id = $1

       ORDER BY event_time DESC
       LIMIT 20`,
      [userId, userId, userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
});

export default router;