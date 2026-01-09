import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_ClOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const UploadOnCloudinary= async(filepath)=>{
    try{
        if(!filepath) return null;
        const response=await cloudinary.uploader.upload(filepath,{resource_type:"auto"});
        console.log("filepath uploaded\n","response: ", response)
        return response
    }catch(error){
        fs.unlinkSync(filepath);
        console.log("filepath upload failed",error );
    }
}

export {UploadOnCloudinary}