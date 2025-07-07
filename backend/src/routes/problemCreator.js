const express = require("express");
const problemRouter = express.Router();
const {createProblem,updateProblem,deleteProblem,fetchProblem,getAllProblem,solvedProblem,paticularSubmission} = require("../controllers/userProblem");
const AdminMiddleware = require("../middleware/adminMiddleware");
const UserMiddleWare = require("../middleware/token_valid");

problemRouter.post('/create',AdminMiddleware,createProblem);
problemRouter.patch('/update/:id',AdminMiddleware,updateProblem);
problemRouter.delete('/delete/:id',AdminMiddleware,deleteProblem);

problemRouter.get('/getAll',UserMiddleWare,getAllProblem);
problemRouter.get('/solved',UserMiddleWare,solvedProblem);
problemRouter.get('/find/:id',UserMiddleWare,fetchProblem);
problemRouter.get("/SubmissionCode/:id",UserMiddleWare,paticularSubmission);

module.exports = problemRouter;

