import mongoose, { Schema } from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshTokens:{
        type:String
    }
},

{
    timestamps:true
}

)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    
    this.password= await bcrypt.hash(this.password,10)
    next();
    
})

userSchema.methods.IsPasswordCorrect=async function(password){

    return await bcrypt.compare(password,this.password)
}

userSchema.methods.GenerateRefreshToken=function(){
    return jwt.sign({
        _id:this.id,
        _email:this.email,
        _username:this.username,
        _fullname:this.fullName
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE
    }
    )
}

userSchema.methods.GenerateAccessToken=function(){
    return jwt.sign({
        _id:this.id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRE
    }
    )
}

export const User=mongoose.model("User",userSchema)