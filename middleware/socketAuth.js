import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Socket.io middleware that verifies JWT from handshake auth
 * and attaches the authenticated user id to socket.data.
 */
export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = user._id.toString();
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
