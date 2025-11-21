import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connectionInstance= await mongoose.connect(`${process.env.DATABSE_URL}/${DB_NAME}`);
        console.log(`MongoDB connected !! DB host: ${connectionInstance.connection.host}`)
    } 
    catch(error){
        console.log(`cant connect to mongoDB `, error)
    }
}

export default connectDB;