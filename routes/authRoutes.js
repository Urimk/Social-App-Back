import express from "express";
import { login } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Authentication routes
router.post("/login", login);
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json({ message: "Authorized", userId: req.user.id }),
);

export default router;
