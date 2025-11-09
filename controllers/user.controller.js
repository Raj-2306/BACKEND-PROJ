import{ ApiError }from "../utils/ApiError.js";
import{ User }from "../models/user.model.js";         
import  { ApiError } from "../utils/ApiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const registerUser = async (req, res) => {
// get user data from frontend
// validate user data - not empty
// check if user already exists
// hash the passwordcheck for images 
// upload image to cloudinary
// create user object - create db entry 
// remove password from response & refresh token field
// check for user creation success/failure
// send response to frontend


console.log(req.body);

if (fullName === ""){
    throw new ApiError("Full name is required", 400);
}

 const userExists = User.findOne({
    $or :[{username},{email}]
 })

 if(userExists){
    throw new ApiError("User already exists", 400);
 }

 const avatarLocalPath = req.files?.avatar[0]?.path
 const coverImageLocalPath = req.files?.coverImage[0]?.path

if(!avatarLocalPath){
    throw new ApiError("Avatar image is required", 400);
}

const avatar = await uploadImageToCloudinary( avatarLocalPath)
const coverImage = await uploadImageToCloudinary(coverImageLocalPath) 
if(!avatar){
    throw new ApiError("Avatar is required",400)
}

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username:username.toLowerCase(),
    password,
})

const createdUser = await user.findById(user._id).select("-password -refreshToken ")

if(!createdUser){
    throw new ApiError("User registration failed", 500);
}

return res.status(201).json(
    new ApiResponse(200,"User registered successfully", createdUser)
)

}

