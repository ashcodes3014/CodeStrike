const Problem = require("../model/problem");
const Submission = require("../model/submissionSchema");
const {getLanguageById,submitBatch,submitToken} = require("../utilis/problemUtility");



const submit = async (Hiddencases, code,language)=>{

    try{

        const languageId = getLanguageById(language);
        if (!languageId) {
            return 0;
        }
        
        const submissions = Hiddencases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        console.log(submissions)
  
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        return testResult;


    }catch(err){
        throw new Error(err.message);
    }

};


const submitCode = async (req,res)=>{
    try{
        const userId = req.result.id;
        const problemId =req.params.id;
        const {code,language} = req.body;
        if(!userId || !problemId || !code || !language){
            return  res.status(400).send("field missing");
        }

        const ques = await Problem.findById(problemId);

        // store in database
        const ans = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testcasePassed:0,
            status:"pending",
            totaltestcased:ques.Hiddencases.length
        }) 
        
        const testResult = await submit(ques.Hiddencases,code,language);

        
        let testcasePassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMess = "null"
        for( const test of testResult ){
            if(test.status_id==3){
                testcasePassed++;
                runtime+=parseFloat(test.time);
                memory = memory < test.memory ? test.memory : memory;
            }else{
                if(test.status_id==4){
                    status = "error"
                }
                else status = "wrong"
                errorMess=test.stderr
            }
        }

        ans.status=status;
        ans.testcasePassed=testcasePassed;
        ans.runtime = runtime.toFixed(3);
        ans.memory = memory;
        ans.errorMessage = errorMess;

        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        
        
        await ans.save();
        res.send(ans);
        

    }catch(err){
        res.status(400).send(err.message);
    }
}

const runCode = async (req,res)=>{
    try{
        const userId = req.result.id;
        const problemId =req.params.id;
        const {code,language} = req.body;
        if(!userId || !problemId || !code || !language){
            return  res.status(400).send("field missing");
        }
        const ques = await Problem.findById(problemId);
        const testResult = await submit(ques.visibleTestCases,code,language);
        
        let testcasePassed = 0;
        let status = "accepted";
        let errorMess = "null"
        for( const test of testResult ){
            if(test.status_id==3){
                testcasePassed++;
            }else{
                if(test.status_id==4){
                    status = "error"
                }
                else status = "wrong"
                errorMess=test.stderr
            }
        }
        res.json({
            "testcasePassed": testcasePassed,
            "status":status,
            "error":errorMess
        });
        

    }catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = {submitCode,runCode};