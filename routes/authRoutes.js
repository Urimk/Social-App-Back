import express from "express";
import { login } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", protectRoute);

export default router;
