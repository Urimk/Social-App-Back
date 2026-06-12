import mongoose from "mongoose";

/**
 * User model schema.
 * Represents a user with authentication and social features.
 */
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 20,
    },
    displayName: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
