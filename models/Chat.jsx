import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    Users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    Messages: [
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
