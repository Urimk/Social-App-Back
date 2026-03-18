import express from "express";
import {
  getLastMessage,
  addChat,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id/lastMessage", protectRoute, getLastMessage);
router.post("/:display/acceptRequest", protectRoute, addChat);
router.get("/", protectRoute, getChats);
router.get("/:id/messages", protectRoute, getMessages);
router.post("/:id/message", protectRoute, sendMessage);

export default router;
