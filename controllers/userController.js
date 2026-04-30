import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * Sends a friend request to another user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const displayName = req.params.display;
    if (displayName === req.user.displayName) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }
    const receiver = await User.findOne({ displayName });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user.contacts.some((objId) => objId.equals(receiver.id))) {
      return res.status(400).json({ message: "Already friends" });
    }
    if (receiver.pendingRequests.some((objId) => objId.equals(senderId))) {
      return res.status(400).json({ message: "Already requested" });
    }
    receiver.pendingRequests.addToSet(senderId);
    await receiver.save();
    return res.status(200).json({
      message: "Friend request sent",
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Gets pending friend requests for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let requests = [];
    for (const otherUserId of existingUser.pendingRequests) {
      const user = await User.findById(otherUserId);
      if (user) {
        requests.push({ displayName: user.displayName, image: user.image });
      }
    }
    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Error loading request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes a friend request.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteRequest = async (req, res) => {
  try {
    const displayName = req.params.display;
    const sender = await User.findOne({ displayName });
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const receiverId = req.user.id;
    if (!sender.pendingRequests.some((objId) => objId.equals(receiverId))) {
      return res.status(400).json({ message: "Not requested" });
    }
    await User.findByIdAndUpdate(receiverId, {
      $pull: { pendingRequests: sender._id },
    });
    res.status(200).json({ message: "Deleted request" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Deletes the authenticated user account.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Deleted User" });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
