import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, required: true },
    coverImage: { type: String },
    password: { type: String, required: true },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    refreshToken: { type: String },
}, { timestamps: true });




// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Password comparison
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

    
// Generate access token (short lived[mins])
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate refresh token(long lived[hourss])
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            userId: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
