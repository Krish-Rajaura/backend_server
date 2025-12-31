import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const UploadOnCloudinary= async(file)=>{
    try{
        if(!file) return null;
        const response=await cloudinary.uploader.upload(file,{resource_type:auto});
        console.log("file uploaded", response.url)
        return response

    }catch(error){
        fs.unlink(file);
        console.log("file upload failed");
    }
}

export {UploadOnCloudinary}