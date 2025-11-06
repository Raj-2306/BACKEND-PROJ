import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { use } from "react";

const userSchema = new Schema({
    fullName : {type: String, required: true},
    username : {type: String, required: true, unique: true,lowercase: true,index : true},
    email : {type: String, required: true, unique: true,lowercase: true},
    password : {type: String, required: true},
    createdAt : {type: Date, default: Date.now},
    watchHistory : [{type: Schema.Types.ObjectId, ref: "Video"}],
    refreshToken : {type: String},
},
{ 
    timestamps: true
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return  await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
        userId : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName,
        },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)}


userSchema.methods.generateRefreshToken = function (){
     return jwt.sign(
        {
        userId : this._id,
        },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const USer = mongoose.model("User", userSchema); 