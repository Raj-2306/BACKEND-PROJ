import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../src/constants.js";
import express from "express";
import connectDB from "../db/index.js";
import dotenv from "dotenv";
import userRouter from '../routes/user.routes.js'
import cookieParser from "cookie-parser";


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());


dotenv.config({
    path: "./env"
});



connectDB()
.then(() => {
    
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});




app.get("/", (req, res) => {
    res.send("API is running...");
}); 



// routes declaration
app.use("/api/v1/users",userRouter)
 





app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });


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