import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

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
