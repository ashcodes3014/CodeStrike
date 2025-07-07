import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import AIChat from '../component/AI_Chatbot';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import Submission from '../component/submisson';
import EditorialSection from '../component/editorialSection';


import {
  Code, FileText, ListChecks, Play, Rocket, CheckCircle, 
  XCircle, Loader2, ChevronDown, ChevronUp,BotMessageSquare,
  HardDriveDownload, HardDriveUpload, Terminal, CircleSlash
} from 'lucide-react';


const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [submisson,setSubmisson] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [expandedTestCases, setExpandedTestCases] = useState({});
  const editorRef = useRef(null);
  let { problemId } = useParams();


  useEffect(() => {
    const fetchSubmisson = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/SubmissionCode/${problemId}`);
        setSubmisson(response.data); 
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmisson();
    
  }, [problemId]);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/find/${problemId}`);
        
        if (response.data && response.data.startCode) {
          const initialCode = response.data.startCode.find(sc => 
            sc.language === langMap[selectedLanguage]
          )?.initialCode || '';
          
          setProblem(response.data);
          setCode(initialCode);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(sc => 
        sc.language === langMap[selectedLanguage]
      )?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('custom-dark-030712', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'f8fafc', background: '030712' },
      ],
      colors: {
        'editor.background': '#030712',
        'editor.foreground': '#f8fafc',
        'editorCursor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#0f172a',
        'editor.lineHighlightBorder': '#00000000',
        'editor.selectionBackground': '#1e293b',
        'editor.inactiveSelectionBackground': '#1e293b88',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#334155',
        'editorWhitespace.foreground': '#475569',
      },
    });

    monaco.editor.setTheme('custom-dark-030712');
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {

      let language = selectedLanguage;
      if (language === "cpp") language = "c++";

      const response = await axiosClient.post(`/user/run/${problemId}`, {
        code,
        language
      });

      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: error.response?.data?.message || 'Internal server error'
      });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      let language = selectedLanguage;
      if (language === "cpp") language = "c++";
      
      const response = await axiosClient.post(`/user/submit/${problemId}`, {
        code,
        language
      });
      // Handle the response based on the ans structure you provided
      const result = response.data.result || response.data;
      setSubmitResult({
        accepted: result.status === 'accepted',
        runtime: result.runtime,
        memory: result.memory,
        testcasePassed: result.testcasePassed,
        totalTestCases: result.totaltestcased,
        errorMessage: result.errorMessage !== 'null' ? result.errorMessage : null,
        message: result.status === 'accepted' ? 'All test cases passed!' : 'Some test cases failed'
      });
      
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: error.response?.data?.message || 'Internal server error'
      });
      setActiveRightTab('result');
    } finally {
      const sub = await axiosClient.get(`/problem/SubmissionCode/${problemId}`);
      setSubmisson(sub.data); 
      setLoading(false);
    }
  };



  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const toggleTestCase = (index) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <div className="alert alert-error max-w-md">
          <XCircle className="h-6 w-6" />
          <span>Problem not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-950 text-gray-100">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-800">
        {/* Left Tabs */}
        <div className="flex bg-gray-950 px-4 py-4 border-b border-gray-800">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeLeftTab === 'description' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveLeftTab('description')}
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">Description</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeLeftTab === 'editorial' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            <Code className="h-4 w-4" />
            <span className="font-medium">Editorial</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeLeftTab === 'submissions' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            <ListChecks className="h-4 w-4" />
            <span className="font-medium">Submissions</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeLeftTab === 'ChatWithAI' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveLeftTab('ChatWithAI')}
          >
            <BotMessageSquare className="h-4 w-4" />
            <span className="font-medium">ChatWithAI</span>
          </button>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeLeftTab === 'description' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-100">{problem.title}</h1>
                <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                </div>
                {problem.tags && (
                  <div className="border border-blue-400 px-3 py-1 rounded-2xl text-xs text-blue-400 bg-blue-900/20">
                    {problem.tags}
                  </div>
                )}
              </div>

              <div className="prose max-w-none text-gray-300">
                <div className="whitespace-pre-wrap text-md leading-relaxed">
                  {problem.description}
                </div>
              </div>

              {problem.visibleTestCases?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-blue-400" />
                    Examples:
                  </h3>
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleTestCase(index)}
                        >
                          <h4 className="font-semibold mb-2">Example {index + 1}</h4>
                          {expandedTestCases[index] ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        {expandedTestCases[index] && (
                          <div className="space-y-3 mt-2 text-sm font-mono">
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 mb-1">Input</div>
                              <pre className="text-gray-200">{example.input}</pre>
                            </div>
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 mb-1">Output</div>
                              <pre className="text-gray-200">{example.output}</pre>
                            </div>
                            {example.explanation && (
                              <div className="bg-gray-800 p-3 rounded">
                                <div className="text-gray-400 mb-1">Explanation</div>
                                <pre className="text-gray-200">{example.explanation}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeLeftTab === 'editorial' && (
            <div className="prose max-w-none text-gray-300">
              <EditorialSection url={problem.editorial}/>
            </div>
          )}

          {activeLeftTab === 'submissions' && (
            <div>
              <Submission submisson={submisson}/>
            </div>
          )}
          {activeLeftTab === 'ChatWithAI' && (
            <AIChat problem={problem} />
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor and Results */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="flex bg-gray-950 px-4 py-4 border-b border-gray-800">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeRightTab === 'code' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('code')}
          >
            <HardDriveDownload className="h-4 w-4" />
            <span className="font-medium">Code</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeRightTab === 'testcase' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            <Terminal className="h-4 w-4" />
            <span className="font-medium">Testcase</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg ${activeRightTab === 'result' ? 'bg-gray-800 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveRightTab('result')}
          >
            <HardDriveUpload className="h-4 w-4" />
            <span className="font-medium">Result</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-3 border-b border-gray-800 bg-gray-950 py-4">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${selectedLanguage === lang ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === selectedLanguage && <CheckCircle className="h-3 w-3" />}
                      {langMap[lang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 bg-[#030712] text-white">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="custom-dark-030712"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-gray-800 bg-gray-950 flex justify-between ">
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-[14px] bg-gray-900 text-gray-300 "
                  onClick={() => setActiveRightTab('testcase')}
                >
                  <Terminal className="h-5 w-5" />
                  Console
                </button>
                <div className="flex gap-2">
                  <button
                    className={`flex items-center gap-2 px-4 py-1.5 rounded text-[14px] ${loading ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'} text-gray-300`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                    Run
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-1.5 rounded text-[14px] ml-2 ${loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-blue-400" />
                Test Results
              </h3>
              {runResult ? (
                <div className={`rounded-lg border ${runResult.status==="accepted" ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'} p-4 mb-4`}>
                  <div className="flex items-start gap-3">
                    {runResult.status==="accepted" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {runResult.status==="accepted" ? (
                        <div>
                          <h4 className="font-bold text-lg flex items-center gap-2 text-green-400">
                            All test cases passed!
                          </h4>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-lg flex items-center gap-2 text-red-400">
                            {runResult.error || 'Test cases failed'}
                          </h4>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <CircleSlash className="h-10 w-10 mb-2" />
                  <p>Click "Run" to test your code with the example test cases.</p>
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <HardDriveUpload className="h-5 w-5 text-blue-400" />
                Submission Result
              </h3>
              {submitResult ? (
                <div className={`rounded-lg border ${submitResult.accepted ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'} p-4`}>
                  <div className="flex items-start gap-3">
                    {submitResult.accepted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {submitResult.accepted ? (
                        <div>
                          <h4 className="font-bold text-2xl mb-3 text-green-400 flex items-center gap-2">
                            🎉 Accepted
                          </h4>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 text-sm">Test Cases</div>
                              <div className="text-green-400 font-bold">
                                {submitResult.testcasePassed}/{submitResult.totalTestCases}
                              </div>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 text-sm">Runtime</div>
                              <div className="text-green-400 font-bold">{submitResult.runtime} sec</div>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 text-sm">Memory</div>
                              <div className="text-green-400 font-bold">{submitResult.memory} KB</div>
                            </div>
                          </div>
                          <div className="text-green-400 text-sm">
                            {submitResult.message}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-2xl mb-3 text-red-400 flex items-center gap-2">
                            ❌ Submission Failed
                          </h4>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 text-sm">Test Cases</div>
                              <div className="text-red-400 font-bold">
                                {submitResult.testcasePassed || 0}/{submitResult.totalTestCases || 0}
                              </div>
                            </div>
                            {submitResult.runtime && (
                              <div className="bg-gray-900 p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Runtime</div>
                                <div className="text-red-400 font-bold">{submitResult.runtime} sec</div>
                              </div>
                            )}
                            {submitResult.memory && (
                              <div className="bg-gray-900 p-3 rounded-lg">
                                <div className="text-gray-400 text-sm">Memory</div>
                                <div className="text-red-400 font-bold">{submitResult.memory} KB</div>
                              </div>
                            )}
                          </div>
                          {submitResult.errorMessage && (
                            <div className="bg-gray-900 p-3 rounded-lg text-sm">
                              <div className="text-gray-400 mb-1">Error Message</div>
                              <div className="text-red-400">{submitResult.errorMessage}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Rocket className="h-10 w-10 mb-2" />
                  <p>Click "Submit" to submit your solution for evaluation.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;