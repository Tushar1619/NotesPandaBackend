import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        defaul:Date.now
    }
});


const userInfo = mongoose.model('userInfo', userSchema);
export default userInfo;