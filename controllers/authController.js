import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Registers a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, displayName, password, image } = req.body;
    const existingUser = await User.findOne({ displayName });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      displayName,
      password: hashedPassword,
      image,
      pendingRequests: [],
      chats: [],
      contacts: [],
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.displayName },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logs in a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const login = async (req, res) => {
  try {
    const { displayName, password } = req.body;
    const user = await User.findOne({ displayName });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;
    res.status(200).json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
