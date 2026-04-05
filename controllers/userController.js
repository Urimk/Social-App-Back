import { User } from "../models/User.js";

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
    receiver.pendingRequests.push(senderId);
    receiver.save();
    return res.status(200).json({
      message: "Friend request sent",
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let requests = [];
    for (const userId of existingUser.pendingRequests) {
      const user = await User.findById(userId);
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

export const deleteRequest = async (req, res) => {
  try {
    const displayName = req.params.display;
    const sender = await User.findOne({ displayName });
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const receiverId = req.user.id;
    await User.findByIdAndUpdate(receiverId, {
      $pull: { pendingRequests: sender._id },
    });
    res.status(200).json({ message: "Deleted request" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isPasswordCorrect = bcrypt.compare(req.body.password, user.password);
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
