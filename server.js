import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import dns from "node:dns/promises";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
dotenv.config();

const normalizeOrigin = (url) => url?.replace(/\/$/, "").trim();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
]
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    console.warn(
      `CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(", ") || "(none configured)"}`,
    );
    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1);
  });

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/chat", chatRoutes);
app.use("/image", imageRoutes);

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "active", message: "Server is running" });
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    ...corsOptions,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.use(socketAuth);

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  if (!userId) {
    socket.disconnect(true);
    return;
  }

  socket.join(userId);
  console.log(`User connected: ${socket.id} (room: ${userId})`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
