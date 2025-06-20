import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if(!DB_URI){
    console.log(DB_URI);
    throw new Error("please define the database url in your environment variable inside .env");
}

const connectToDatabase = async ()=>{

    try{
        await mongoose.connect(DB_URI);
        console.log("Connected to the database...");
    }catch(error){
        console.log("Getting error connecting to database in file db.js : ", error);
    }
}

export default connectToDatabase;