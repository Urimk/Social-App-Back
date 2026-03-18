import express from "express";
import {
  getProfilePic,
  uploadProfilePic,
} from "../controllers/imageController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protectRoute, getProfilePic);

router.post("/", protectRoute, uploadProfilePic);

export default router;
