import mongoose, { Schema } from 'mongoose'

const userSchema= new Schema({
    username:{
        required:true,
        unique:true,
        

    }
})
