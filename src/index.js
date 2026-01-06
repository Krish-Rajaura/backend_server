import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({path:'.env'});

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("app is running and listening on port ",process.env.PORT)
    })

})











/*
first approach to connect DB 
use try-catch block
use async-await

const app=express();
(async()=>{
    
    try{
       await mongoose.connect(`${process.env.DATABSE_URL}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log(error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`)
        })
    }catch(error){
        console.log(error);
        throw error;
    }


})()
*/