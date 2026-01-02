import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

//  Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.warn(" No file path provided to uploadOnCloudinary");
      return null;
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", result.secure_url);

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (error) {
    console.error(" Cloudinary upload error:", error.message);

    // Remove the temp file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;
