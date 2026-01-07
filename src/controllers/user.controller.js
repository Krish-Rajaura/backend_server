import {AsyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {User} from '../models/User.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { UploadOnCloudinary } from '../utils/cloudinary.js'


const registerUser= AsyncHandler(async (req,res)=>{

    //take User details
    const {fullName,email,password,username}=req.body; 

    // validate details
    if([fullName,email,password,username].some((field)=>field?.trim()==="")){ 
        throw new ApiError(400,"all fields are required.")
    }

    // check wheter User exist already
    const userAlreadyExist= await User.findOne({
        $or : [{username},{email}]
    })

    if (userAlreadyExist){
        throw new ApiError(409,"username or email already exist")
    }


    // check for image and avatar

    const avatarLocalPath=req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file required")
    } 

    const coverImagePath=req.files?.coverImage[0]?.path;
    if(!coverImagePath){
        throw new ApiError(400,"Cover image file required")
    }


    //upload image and avatar to cloudinary
    const avatar=await UploadOnCloudinary(avatarLocalPath)
    const coverImage=await UploadOnCloudinary(coverImagePath)

    // create User in DB
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        username:username.toLowerCase(),
        email,
        password,
        refreshTokens
    })

    const createdUser=User.findById(user._id).select(
        "-password refreshTokens"
    )

    //check User is created
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering User")
        
    }



    return res.status(200).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

export default registerUser;
