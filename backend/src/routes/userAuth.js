const express = require("express");
const authRouter = express.Router();
const {register,login,logout,profile,adminRegister,deleteProfile} = require("../controllers/AuthFunc");
const UserMiddleWare = require("../middleware/token_valid");
const AdminMiddleware = require("../middleware/adminMiddleware")


authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',UserMiddleWare,logout)
authRouter.post('/admin/register',AdminMiddleware,adminRegister)
authRouter.post('/getProfile',profile)
authRouter.delete('/profile',UserMiddleWare,deleteProfile);
authRouter.get('/check',UserMiddleWare,(req,res)=>{
    res.status(200).json({
        user:req.result,
        message:"valid user"
    });
});




module.exports = authRouter;