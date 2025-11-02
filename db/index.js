import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";



const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected to MongoDB successfully at ${connection.connection.host}`);
        

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB;