import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minLength:4,
        maxLength:30,
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
        lowercase:true,
        match:[/\S+@\S+\.\S+/ , "please fill a valid email address."],
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }
},{timestamps:true})


const UserModel = mongoose.Model('User',UserSchema);

export default UserModel;