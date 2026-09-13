import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import dashboardRouter from "./routes/dashboard.js";
import skillsRouter from "./routes/skills.js";
import mistakesRouter from "./routes/mistakes.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to NEXUS API", });
});

app.use("/api/users", usersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/mistakes", mistakesRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`NEXUS server running on port ${PORT}`);
});