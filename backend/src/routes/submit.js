const express = require("express");
const UserMiddleWare = require("../middleware/token_valid");
const submitRouter = express.Router();
const {submitCode,runCode}  = require("../controllers/submitCode")

submitRouter.post('/submit/:id',UserMiddleWare,submitCode);
submitRouter.post('/run/:id',UserMiddleWare,runCode);


module.exports = submitRouter;