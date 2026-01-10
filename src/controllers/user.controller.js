import {AsyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {User} from '../models/User.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { UploadOnCloudinary } from '../utils/cloudinary.js'


const GenerateRefreshAndAccessTokens=async(userId)=>{
    try{
        const user=await User.findOne(userId);
        const refreshToken=user.GenerateRefreshToken()
        const accessToken=user.GenerateAccessToken()

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})

        return{refreshToken,accessToken}
    }catch(error){
        console.log(error)
        throw new ApiError(501,"unable generate refresh or access tokens")
    }
}


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
    console.log(req.files);
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file required")
    } 

    const coverImagePath=req.files?.coverImage?.[0]?.path;

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
        password
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check User is created
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering User")
        
    }

    return res.status(200).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

const loginUser=AsyncHandler(async(req,res)=>{
    //take user details
   
    const {username,email,password}=req.body;

    //validate
    if(!(username || email)){
        throw new ApiError(400,"username or email required");
    }

    if (!password){
        throw new ApiError(400,"password is required");
    }

    //check user
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"user not found")
    }

    //check password
    const isPasswordCorrect= user.IsPasswordCorrect(password);
    
    if(!isPasswordCorrect){
        throw new ApiError(403,"password is incorrect")
    }

    //generate tokens
    console.log(user._id);
    const {refreshToken,accessToken}=await GenerateRefreshAndAccessTokens(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpsOnly:true,
        secure:true
    }

    //send res
    res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,"login successfull",{user:loggedInUser,accessToken,refreshToken})
    )

})

const logoutUser=AsyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $set: refreshToken=undefined
        }
    )

    res
    .status(200)
    .clearCookies("accessToken",options)
    .clearCookies("refreshToken",options)
    .json(
        new ApiResponse(200,"logout successfull")
    )
})


export{ registerUser,loginUser,logoutUser}
