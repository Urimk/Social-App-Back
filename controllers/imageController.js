import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";

export const getProfilePic = async (req, res) => {
  return res.status(200).json({
    image: req.user.image,
  });
};

export const uploadProfilePic = [
  upload.single("image"),
  async (req, res) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "chatapp" },
        (error, result) => {
          if (error) return res.status(500).json(error);
          res.json({ url: result.secure_url });
        },
      );

      stream.end(req.file.buffer);
    } catch (err) {
      res.status(500).json(err);
    }
  },
];

export const changeProfilePic = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const stream = cloudinary.uploader.upload_stream(
        { folder: "chatapp" },
        async (error, result) => {
          if (error) return res.status(500).json(error);

          await User.findByIdAndUpdate(userId, {
            image: result.secure_url,
          });

          res.json({ url: result.secure_url });
        },
      );

      stream.end(req.file.buffer);
    } catch (err) {
      res.status(500).json(err);
    }
  },
];
