import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import auth from './routes/auth.mjs'
import notes from './routes/notes.mjs'
import { Schema } from "mongoose";
import * as dotenv from 'dotenv' 
dotenv.config()
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send("Hello World!")
})

//clean lage code isliye use kia hai ise '/api/auth' ke baad ye auth.mjs se lega aage ka url
// basically is particular route '/api/auth' ke liye hai auth.mjs

app.use('/api/auth', auth)
app.use('/api/notes',notes)


let dbURI = process.env.MONGO_URL
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log("mongoose is connected");
});

mongoose.connection.on('disconnected', () => {
    console.log("mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
    process.exit(1);
});

//   SIGINT  it means agar koi ctrl se close kr raha hai server ko to mongoose ko bhi close krdo
process.on('SIGINT', () => {
    console.log("App is terminating");
    mongoose.connection.close(() => {
        console.log("Mongoose default connection closed");
        process.exit(0);
    })
})



app.listen(port,()=>{
    console.log("Listening On port 4000");
})