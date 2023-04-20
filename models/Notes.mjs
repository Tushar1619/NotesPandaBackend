import mongoose from "mongoose";
import { Schema } from "mongoose";

const notesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userInfo'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        dafault:"HomeWork"
    },
    date:{
        type:Date,
        default:Date.now
    }
});


const notes = mongoose.model('notesSchema', notesSchema);

export default notes;