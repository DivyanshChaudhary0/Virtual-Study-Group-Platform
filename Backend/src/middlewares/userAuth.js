
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/users.model");

async function userAuth(req,res,next) {
    try{
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token){
            return res.status(404).json({
                message: "Not authorized, token payload not found"
            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        if(!decoded._id){
            return res.status(401).json({
                message: "Not authorized, token payload invalid"
            });
        }        

        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized, user not found"
            });
       }

        req.user = user;
        return next();

    }
    catch(error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, message: 'Not authorized, token failed verification' 
            });
        } 
        else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, message: 'Not authorized, token expired' 
            });
        } 
        else {
            return res.status(401).json({ 
                success: false, message: 'Not authorized' 
            });
        }
    }
}

module.exports = userAuth
