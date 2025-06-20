import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { jwt } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        //logic to create a new user
        const {username, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            const err = new Error("User already exists");
            err.statusCode = 400;
            throw err;
        }

        // hash the password for the new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // create a new user
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword,
        },{session})

        const token = jwt.sign({userId: newUser._id}, JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req,res) => {

}

export const signOut = async (req,res) => {
    
}