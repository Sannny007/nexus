import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import dashboardRouter from "./routes/dashboard.js";
import skillsRouter from "./routes/skills.js";
import mistakesRouter from "./routes/mistakes.js";
import authRouter from "./routes/auth.js";
import authenticate from "./middleware/auth.js";
import searchRouter from "./routes/search.js";


const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to NEXUS API", });
});

app.use("/api/auth", authRouter);
app.use("/api/users", authenticate, usersRouter);
app.use("/api/dashboard", authenticate, dashboardRouter);
app.use("/api/skills", authenticate, skillsRouter);
app.use("/api/mistakes", authenticate, mistakesRouter);
app.use("/api/search", authenticate, searchRouter);

app.listen(PORT, () => {
  console.log(`NEXUS server running on port ${PORT}`);
});