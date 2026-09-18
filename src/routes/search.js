import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const messages = [
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenRouter request failed");
    }

    const answer = data.choices[0].message.content;

    res.status(200).json({ answer, citations: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get search response" });
  }
});

export default router;