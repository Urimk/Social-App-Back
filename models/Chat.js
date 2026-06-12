import mongoose from "mongoose";

/**
 * Chat model schema.
 * Represents a chat between users with messages.
 */
const ChatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

export const Chat = mongoose.model("Chat", ChatSchema);
