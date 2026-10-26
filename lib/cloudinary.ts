import { v2 as cloudinary } from "cloudinary";

// Server-only: never import this file from a "use client" component —
// api_secret must not reach the browser bundle.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
