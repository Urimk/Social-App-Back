import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

export const getProfilePic = async (req, res) => {
  console.log(req.user.id);
  return res.status(200).json({
    image: req.user.image,
  });
};

export const uploadProfilePic = () => {
  (upload.single("image"),
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
    });
};
