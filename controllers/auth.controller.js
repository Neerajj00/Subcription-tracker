import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req,res,next) => {
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
        const newUsers = await User.create([{
            username,
            email,
            password:hashedPassword,
        }],{session})
        
        const newUser = newUsers[0]; 
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();
        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: true , // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: JWT_EXPIRES_IN * 1000 // Set cookie expiration to match JWT expiration
        })
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            token
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req,res,next) => {
    try{
        const {email, password} = req.body;
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        }
        // Check if password is correct
        const ispasswrodValid = await bcrypt.compare(password,user.password);

        if(ispasswrodValid){
            // generate jwt token 
            const token = jwt.sign({userId:user.id}, JWT_SECRET, {expiresIn:JWT_EXPIRES_IN});
            res.status(200).json({
                message:"user Logged in Successfully",
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                },
                token
            })
        }else{
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        }

    }catch(error){
        next(error);
    }
}

export const signOut = async (req,res,next) => {
    
}