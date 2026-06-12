import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Middleware to protect routes by verifying JWT token.
 * Attaches the authenticated user to req.user if token is valid.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const protectRoute = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error.message);
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};
