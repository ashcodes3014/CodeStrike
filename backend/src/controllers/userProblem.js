const { getLanguageById, submitBatch, submitToken } = require("../utilis/problemUtility");
const Problem = require("../model/problem");
const User = require("../model/user")
const Submission = require("../model/submissionSchema")

const check = async (visibleTestCases, referenceSolution)=>{
  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);

    if (!languageId) {
      return 0;
    }

    const submissions = visibleTestCases.map((testcase) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);



    for (const test of testResult) {
      if (test.status_id !== 3) return 0;

    }
  }

  return 1;

};


const createProblem = async (req, res) => {
  const { visibleTestCases, referenceSolution } = req.body;

  try {
    const isValid = check(visibleTestCases, referenceSolution);
    if(!isValid){
      return res.status(400).send("invalid refererence solution");
    }
    req.body.problemCreator=req.result._id;
    const ques = await Problem.create(req.body);

    res.status(201).json({ message: "Problem added successfully", problemId: ques._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateProblem = async (req,res)=>{
  const {id} = req.params;
  const { visibleTestCases, referenceSolution } = req.body;
  try{
    if(!id){
      return res.send("Id is not present")
    }
    const DsaProblem = await Problem.findById(id);
    if(!DsaProblem){
      return res.send("probelm is not present")
    }
    const isValid = check(visibleTestCases, referenceSolution);
    if(!isValid){
      return res.status(400).send("invalid refererence solution");
    }
    const ans = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
    res.send(ans);

  }catch(err){
    res.send(err.message);
  }
}

const deleteProblem = async (req,res)=>{
   const {id} = req.params;
   try{
      if(!id){
        throw new Error("Id missing");
      }
      const deleted = await Problem.findByIdAndDelete(id);
      if(!deleted){
        return res.status(400).send("error occured");
      }
      res.status(200).send("problem deleted successfully");

   }catch(err){
      res.status(400).send(err.message);
   }

}

const fetchProblem = async(req,res)=>{
  const {id} = req.params;
   try{
      if(!id){
        throw new Error("Id missing");
      }
      const problem = await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode editorial');
      if(!problem){
        return res.status(400).send("problem does not exist");
      }
      res.status(200).send(problem);

   }catch(err){
      res.status(400).send(err.message);
   }
}

const getAllProblem = async(req,res)=>{
   try{
      const problem = await Problem.find({});
      if(problem.length==0){
        return res.status(400).send("problems does not exist");
      }
      res.status(200).send(problem);

   }catch(err){
      res.status(400).send(err.message);
   }
}

const solvedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: 'problemSolved',
      select: '_id title difficulty tags'
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json({ solvedProblems: user.problemSolved });
  } catch (err) {
    console.error('Error fetching solved problems:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

const paticularSubmission = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id
    const ans = await Submission.find({userId,problemId})
    if (ans.length==0) {
      return res.status(404).send("no submission");
    }
    res.status(200).send(ans);
  } catch (err) {
    console.error('Error fetching solved problems:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};


module.exports = {createProblem,updateProblem,deleteProblem,fetchProblem,getAllProblem,check,solvedProblem,paticularSubmission};


