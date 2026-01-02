import  ApiError  from "../utils/ApiError.js";
import  User  from "../models/user.models.js";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {

  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    // saving refresh token in db
    user.refreshToken = refreshToken;
    await user.save ({ validateBeforeSave : false});
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500,"Token generation failed");
  }
}

const registerUser = asyncHandler(async (req, res) => {
  //  Get user data from frontend
  const { fullName, email, username, password } = req.body;

  // Validate input
  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  //  Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  //  Get local file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  //  Upload images to Cloudinary
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUrl = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

  //  Create user in DB
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  //  Fetch created user (without sensitive fields)
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  //  Send response
  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req,res) => {
  //  req body - > data
  //  email/username, find the user
  // check password, compare password
  // access and refresh token generation
  // send cookies


  const {email,username,password} = req.body;
 if (!password || (!email && !username)) {
    throw new ApiError(400, "Email/username and password are required");
}
  const user = await User.findOne({
    $or : [{username},{email}]
  })

  if(!user){ 
    throw new ApiError(404,"User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){ 
    throw new ApiError(401,"Invalid credentials");
  }

  const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); //optional

  const option = {
    httpOnly : true,
    secure : true
  }
  return res
  .status(200)
  .cookie("accessToken",accessToken,option)
  .cookie("refreshToken", refreshToken, option)
  .json(new ApiResponse(200,{
    user : loggedInUser,
    accessToken,
    refreshToken,
    message : "Login successful"
  }))


// logout user
const logoutUser = asyncHandler (async (req,res) => {
  User.findById
})



})

const logoutUser = asyncHandler (async (req,res) => {
  await User.findByIdAndUpdate(req.user._id,{
    $set:
    {
      refreshToken : undefined
    }
  },
  {
      new : true
  })
  const options = {
    httpOnly : true,
    secure : true,
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse (200,{},"Logout successful"))
  
  })

const refershAccessToken = asyncHandler (async (req,res) =>{
  const incomingRefreshToken = req.cookies.refershToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError (401,"Refresh token is required")
  }}
)

  // verify token
  try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET, async (err,decoded) => {
    if(err){
      throw new ApiError (401,"Invalid refresh token")
    }
    const user = await User.findById (decoded?._id)
     if(!user){
    throw new ApiError (401,"invalid Refresh token ")
  }
  if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError (401,"Refresh token mismatch")
  }
  const options = {
    httpOnly : true,
    secure : true
  }
  const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken (user._id)
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken", newrefreshToken, options)
  .json (new ApiResponse (200,{
    accessToken,
    refreshToken : newrefreshToken
  },"New access token generated"))


})
  } catch (error) {
    throw new ApiError (404,"Could not refresh access token")
  }




export {
  logoutUser,
  loginUser,
  registerUser,
  refershAccessToken
}