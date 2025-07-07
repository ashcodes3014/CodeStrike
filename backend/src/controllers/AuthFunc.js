const User = require("../model/user")
const bcrypt = require('bcrypt');
const Valid = require('../utilis/validator')
const jwt = require('jsonwebtoken');
const RedisClient = require("../config/redis");
const Submission = require("../model/submissionSchema")


const register = async (req,res)=>{
    try{
        Valid(req.body);
        req.body.password =  await bcrypt.hash(req.body.password,10);
        const client =  await User.create(req.body);
        const reply = {
            firstName:client.firstName,
            emailID:client.emailID,
            _id:client._id,
            role:client.role
        }
        const token = jwt.sign({ _id:client._id , emailID:client.emailID , role:"user"},process.env.JWT_key,{expiresIn:3600});
        res.cookie('token',token,{maxAge:60*60*1000});   // after 3600s token will be remove from frontend automatically
        res.status(201).json({
            user:reply,
            message:"login successfully"
        });
    }catch(err){
        res.status(400).send(err.message);
    }
} 

const login = async (req,res)=>{
    try{
        const {emailID,password} = req.body
        if(!emailID){
            throw new Error("Credentials Invalid")
        }
        if(!password){
            throw new Error("Credentials Invalid")
        }
        const user = await User.findOne({emailID});
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            throw new Error("Invalid Credentials")
        }

        const reply = {
            firstName:user.firstName,
            emailID:user.emailID,
            _id:user._id,
            role:user.role
        }
        const token = jwt.sign({ _id:user._id , emailID:user.emailID,role:user.role},process.env.JWT_key,{expiresIn:3600});
        res.cookie('token',token,{maxAge:60*60*1000}); 
        res.status(200).json({
            user:reply,
            message:"login successfully"
        })
    }catch(err){
        res.status(401).send(err.message);
    }
}


const logout = async (req,res)=>{
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);
        await RedisClient.set(`token:${token}`,'Blocked');
        await RedisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token", null , {expires : new Date(Date.now())});
        res.send("logout sucessfully");
    }catch(err){
        res.status(503).send(err.message);
    }
}

const profile = async (req,res)=>{
    try{
        const userId= req.result.id;
        const profile = await User.findById(userId);
        res.status(200).send(profile);
    }catch(err){
        res.status(401).send(err.message);
    }
}

const adminRegister = async (req,res)=>{
    try{
        Valid(req.body);
        req.body.password =  await bcrypt.hash(req.body.password,10);
        req.body.role = "admin";
        const user = await User.create(req.body);
        const token = jwt.sign({ _id:user._id , emailID:user.emailID , role:"admin"},process.env.JWT_key,{expiresIn:3600});
        res.cookie('token',token,{maxAge:60*60*1000});   // after 3600s token will be remove from frontend automatically
        res.status(201).send("admin register successfully");
    }catch(err){
        res.status(400).send(err.message);
    }
} 

const deleteProfile = async (req,res)=>{
    try{
        const userId= req.result.id;
        await User.findByIdAndDelete(userId);
        res.status(200).send("deleted successfully");
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = {register,login,logout,profile,adminRegister,deleteProfile};