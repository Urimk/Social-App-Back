import express from "express";
import { register } from "../controllers/authController.js";
import {
  sendRequest,
  getRequests,
  deleteRequest,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/:display/request", protectRoute, sendRequest);
router.get("/requests", protectRoute, getRequests);
router.delete("/:display/request", protectRoute, deleteRequest);

export default router;
