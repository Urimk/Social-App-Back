import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";

/**
 * Gets the profile picture URL for the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getProfilePic = async (req, res) => {
  return res.status(200).json({
    image: req.user.image,
  });
};

/**
 * Uploads a profile picture to Cloudinary.
 * Middleware array: multer upload + upload handler.
 */
export const uploadProfilePic = [
  upload.single("image"),
  async (req, res) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "chatapp" },
        (error, result) => {
          if (error) return res.status(500).json("Error uploading image");
          res.json({ url: result.secure_url });
        },
      );

      stream.end(req.file.buffer);
    } catch (err) {
      res.status(500).json("Error uploading image");
    }
  },
];

/**
 * Changes the profile picture for the authenticated user.
 * Middleware array: multer upload + update handler.
 */
export const changeProfilePic = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const stream = cloudinary.uploader.upload_stream(
        { folder: "chatapp" },
        async (error, result) => {
          if (error) return res.status(500).json("Error uploading image");

          await User.findByIdAndUpdate(userId, {
            image: result.secure_url,
          });

          res.json({ url: result.secure_url });
        },
      );

      stream.end(req.file.buffer);
    } catch (err) {
      res.status(500).json("Error uploading image");
    }
  },
];
