import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configure Cloudinary with environment variables.
 */
if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
} else {
  console.log("Cloudinary configuration failed");
}

export default cloudinary;
