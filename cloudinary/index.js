import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export const cloudConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  folder: "YelpCamp",
  allowedFormats: ["jpeg", "png", "jpg"],
});
