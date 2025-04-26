
const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async function(req,res){
    try{
        const { name,email,password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Enter valid details"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            _id: user._id,
            email: user.email
        }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIARY })

        res.status(201).json({
            message: "User register successfully",
            user,
            token
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const login = async function(req,res){
    try{
        const { email,password } = req.body;
        if( !email || !password){
            return res.status(400).json({
                message: "email or password not found"
            })
        }

        const user = await userModel.findOne({email}).$whereselect('+password');;
        if(!user){
            return res.status(404).json({
                message: "Invalid email or password"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.status(404).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email
        }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIARY });

        res.status(200).json({
            message: "User login successfully",
            user,
            token
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


const profile = async function(req,res){
    try{
        const user = req.user;

        res.status(200).json({
            message: "Profile fetched ",
            user
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}   

module.exports = {
    register,
    login,
    profile,
    logout
}