import {JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const authorize = async (req, res, next) => {
    try{
        // let token = req.cookies.token;
        
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized, no token provided"
            })
        }
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password -__v");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized, user not found"
            });
        }

        req.user = user;
        next();
    }  
    catch(error){
        res.status(403).json({
            success:false,
            message: "Unauthorized"
        })
    }
}

export default authorize;