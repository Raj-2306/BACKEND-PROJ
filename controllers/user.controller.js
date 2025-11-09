import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  // 1️⃣ Get user data from frontend
  const { fullName, email, username, password } = req.body;

  // 2️⃣ Validate input
  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 3️⃣ Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // 4️⃣ Get local file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  // 5️⃣ Upload images to Cloudinary
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUrl = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

  // 6️⃣ Create user in DB
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  // 7️⃣ Fetch created user (without sensitive fields)
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  // 8️⃣ Send response
  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});
