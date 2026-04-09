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

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "active", message: "Server is running" });
});

const server = createServer(app);

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("setup", (userId) => {
    socket.join(userId.toString());
    console.log("User joined personal room: ", userId.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
