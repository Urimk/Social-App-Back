import mongoose from "mongoose";

/**
 * Message model schema.
 * Represents a message in a chat.
 */
const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", MessageSchema);
