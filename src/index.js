import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../src/constants.js";
import express from "express";
import connectDB from "../db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
});



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


 




// const app = express();


// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI/{ DB_NAME}}`)
//         app.on("error", (error) => {
//             console.error("Error connecting to Express server:", error);
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//     } catch (error) { 
//         console.error("Error connecting to MongoDB:", error);
//     }
// })();