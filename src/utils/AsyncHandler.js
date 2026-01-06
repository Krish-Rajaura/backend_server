import express from "express"
import mongoose from "mongoose"

// const AsyncHandler=(fn)=async(req,res,next)=>{
//     try{
//         const MongoDBConnector= await fn(res,req,next);

//     }catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

const AsyncHandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((error)=>next(error))
    }
}

export {AsyncHandler}