import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/chat", chatRoutes);
app.use("/image", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "active", message: "Server is running" });
});
