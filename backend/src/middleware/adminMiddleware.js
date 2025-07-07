const jwt = require("jsonwebtoken");
const User = require("../model/user");
const RedisClient = require("../config/redis");

const AdminMiddleware = async (req,res,next)=>{
   try{
    const {token} = req.cookies;
    if(!token) {
        throw new Error("token missing");
    }
    const payload = await jwt.verify(token,process.env.JWT_key);
    const {_id} = payload;

    if(!_id){
        throw new Error("Id is missing");
    }
    if(payload.role!='admin'){
        throw new Error("token invalid");
    }

    const result = await User.findById(_id);


    if(!result){
        throw new Error("User does not exist");
    }
    const IsBlocked = await RedisClient.exists(`token:${token}`)
    if(IsBlocked){
        throw new Error("Invalid token");
    }
    req.result = result;

    next();
   }catch(err){
        res.send(err.message);
   }
}
module.exports = AdminMiddleware;