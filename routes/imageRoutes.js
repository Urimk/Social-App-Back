import express from "express";
import {
  getProfilePic,
  uploadProfilePic,
  changeProfilePic,
} from "../controllers/imageController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protectRoute, getProfilePic);

router.post("/", uploadProfilePic);

router.patch("/", protectRoute, changeProfilePic);

export default router;
