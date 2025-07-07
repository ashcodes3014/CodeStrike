import { logoutUser } from "../authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { clearChat } from "../chat";
import { getAllProblem, solvedProblem } from "../problemSlice";
import {
  ShieldCheck, LogOut, User, Filter, List, CheckCircle, XCircle,
  Loader2, AlertCircle, BookOpen, Trophy,
  CircleSlash, Search
} from 'lucide-react';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allProblem, isLoading, solvedProblems } = useSelector((state) => state.problems);
    const { user } = useSelector((state) => state.auth);
    const [allQuestions, setProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        topic: 'all',
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        dispatch(getAllProblem());
        dispatch(solvedProblem());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(allProblem)) {
            let arr = allProblem.map((problem) => ({
                id: problem._id,
                title: problem.title || 'Untitled Problem',
                difficulty: problem.difficulty || 'Unknown',
                topics: Array.isArray(problem.tags) 
                    ? problem.tags 
                    : problem.tags 
                        ? [problem.tags] 
                        : [],
                solved: false 
            }));
            if (solvedProblems && solvedProblems.length > 0) {
                arr = arr.map(problem => ({
                    ...problem,
                    solved: solvedProblems.some(sp => sp._id === problem.id)
                }));
            }
            setProblems(arr);
        }
    }, [allProblem, solvedProblems]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/signin');
    };

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleProfileAction = (action) => {
        setIsProfileOpen(false);
        if (action === 'logout') {
            handleLogout();
        } else if (action === 'profile') {
            navigate('/profile');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredQuestions = allQuestions.filter(question => {
        if (!question) return false;

        // Search filter
        if (searchQuery && 
            !question.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Difficulty filter
        if (filters.difficulty !== 'all' && 
            question.difficulty && 
            question.difficulty.toLowerCase() !== filters.difficulty) {
            return false;
        }

        // Topic filter
        if (filters.topic !== 'all') {
            const topics = Array.isArray(question.topics) ? question.topics : [];
            if (!topics.some(t => t && t.toLowerCase() === filters.topic)) {
                return false;
            }
        }

        // Status filter
        if (filters.status !== 'all') {
            if (filters.status === 'solved' && !question.solved) return false;
            if (filters.status === 'unsolved' && question.solved) return false;
        }

        return true;
    });

    const defaultTopics = ["Array", "Hash Table", "Linked List", "Math", "String", "DP", "Binary Search"];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'hard': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const handleTitleClick = (e, problemId) => {
        e.stopPropagation();
        dispatch(clearChat());
        navigate(`/problem/${problemId}`);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-950 text-gray-100">
            <header className="bg-gray-900/50 shadow-sm p-4 flex justify-between items-center border-b border-gray-800 mb-3">
                <div 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors" 
                    onClick={() => navigate('/')}
                >
                    <img 
                        src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
                        alt="DSA Tracker Logo" 
                        className="h-8 w-8" 
                    />
                    <span className="text-xl font-bold text-white">CodeStrike</span>
                </div>

                <div className="flex items-center gap-3">
                    {user?.role === 'admin' && (
                       <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/30 border border-blue-800/50" onClick={()=>navigate("/admin")}>
                            <ShieldCheck className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium">Admin</span>
                        </div>
                    )}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center justify-center w-10 h-10 bg-gray-900/10"
                            aria-label="User profile"
                        >
                            <img 
                                src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750802355/wqb3kuin6orezbbwtxgr.png"  
                                className="h-6 w-9 rounded-full" 
                                alt="User" 
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                                <button
                                    onClick={() => handleProfileAction('profile')}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                                >
                                    <User className="h-4 w-4" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => handleProfileAction('logout')}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-red-900/50 hover:text-white transition-colors cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 text-gray-400 flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Difficulty
                            </label>
                            <select 
                                name="difficulty"
                                value={filters.difficulty}
                                onChange={handleFilterChange}
                                className="w-full p-2.5 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                            >
                                <option value="all">All Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Topic
                            </label>
                            <select 
                                name="topic"
                                value={filters.topic}
                                onChange={handleFilterChange}
                                className="w-full p-2.5 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                            >
                                <option value="all">All Topics</option>
                                {defaultTopics.map(topic => (
                                    <option key={topic} value={topic.toLowerCase()}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400 flex items-center gap-2">
                                <Trophy className="h-4 w-4" />
                                Status
                            </label>
                            <select 
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2.5 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                            >
                                <option value="all">All Status</option>
                                <option value="solved">Solved</option>
                                <option value="unsolved">Unsolved</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                            <List className="h-5 w-5 text-blue-400" />
                            DSA Questions
                        </h2>
                        <div className="text-sm text-gray-400">
                            {filteredQuestions.length} {filteredQuestions.length === 1 ? 'problem' : 'problems'} found
                        </div>
                    </div>
                    
                    <div className="rounded-lg shadow overflow-hidden bg-gray-900/50 border border-gray-800">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
                                <p>Loading problems...</p>
                            </div>
                        ) : allQuestions.length > 0 ? (
                            filteredQuestions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-800">
                                        <thead className="bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Topics</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                                            {filteredQuestions.map((question) => (
                                                <tr 
                                                    key={question.id} 
                                                    className="hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={(e) => handleTitleClick(e, question.id)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors text-left"
                                                        >
                                                            {question.title}
                                                        </button>
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                        {question.difficulty}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {Array.isArray(question.topics) && question.topics.slice(0, 3).map((topic, idx) => (
                                                                <span 
                                                                    key={idx} 
                                                                    className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                                                                >
                                                                    {topic}
                                                                </span>
                                                            ))}
                                                            {question.topics?.length > 3 && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                                                                    +{question.topics.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span 
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                question.solved 
                                                                    ? 'bg-green-900/20 text-green-400 border border-green-800' 
                                                                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                                                            }`}
                                                        >
                                                            {question.solved ? (
                                                                <>
                                                                    <CheckCircle className="h-3 w-3 mr-1.5" />
                                                                    Solved
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="h-3 w-3 mr-1.5" />
                                                                    Unsolved
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                                    <AlertCircle className="h-10 w-10 mb-2 text-gray-600" />
                                    <p>No questions match your filters.</p>
                                    <p className="text-sm">Try adjusting your search criteria.</p>
                                </div>
                            )
                        ) : (
                            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                                <CircleSlash className="h-10 w-10 mb-2 text-gray-600" />
                                <p>No questions available.</p>
                                <p className="text-sm">Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;