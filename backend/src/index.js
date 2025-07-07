const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const main = require("./config/database")
const cookie = require('cookie-parser')
const authRouter = require("../src/routes/userAuth");
const Redisclient = require("./config/redis");
const problemRouter = require("../src/routes/problemCreator");
const submitRouter = require("../src/routes/submit");
const aiRouter = require("../src/routes/aiChatting")


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json())
app.use(cookie())

app.use("/auth",authRouter);
app.use("/problem",problemRouter);
app.use('/user',submitRouter);
app.use('/ai',aiRouter);




const InitializeConnection = async () =>{
    try{
        await Promise.all([main(),Redisclient.connect()]);
        console.log("db connect");
        app.listen(process.env.PORT,()=>{
            console.log("server is running at " + process.env.PORT)
        })
    }
    catch(err){
        console.log(err.message);
    }
};
InitializeConnection();

