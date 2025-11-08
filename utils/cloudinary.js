import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        }) 
        console.log("file uploaded successfully",response.url);
        return response.url
    } catch (error) {
        fs.unlinkSync(localFilePath)  
    }
}

cloudinary.v2.uploader.upload(""),
{ public_id :"olympic_flag"},
    function(error, result) {console.log(result, error);}