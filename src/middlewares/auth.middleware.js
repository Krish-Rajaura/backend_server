import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from '../models/User.model.js'

// check authorized user by token and attach user with req
const verifyJWT=AsyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(400,"unauthorized access")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    
        if(!user){
            throw new ApiError(400,"invalid token")
        }
    
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(500,"invalid token",error)
    }


})

export {verifyJWT}