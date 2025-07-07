import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getAllProblem } from '../problemSlice';

import {
  ArrowLeft, Search, Loader2, AlertCircle, CircleSlash,SquarePen
} from 'lucide-react';

function UpdateProblem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProblem, isLoading } = useSelector((state) => state.problems);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllProblem());
  }, [dispatch]);

  const handleUpdate = async (problemId) => {
    try {
        navigate(`/admin/update-problem/${problemId}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const filteredProblems = Array.isArray(allProblem)
    ? allProblem.filter((problem) =>
        problem.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 shadow-sm p-4 flex justify-between items-center border-b border-gray-800 mb-5">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/40 p-2 rounded-lg transition-colors" 
          onClick={() => navigate('/')}
        >
          <img 
            src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
            alt="Logo" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-bold text-white">CodeStrike</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30 text-blue-400 border border-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4 bg-gray-950">
        <div className="mb-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Problem Table */}
        <div className="rounded-xl shadow-lg bg-gray-900/40 border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
              <p>Loading problems...</p>
            </div>
          ) : filteredProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/80 text-gray-300 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Title</th>
                    <th className="px-6 py-4 text-left font-medium">Difficulty</th>
                    <th className="px-6 py-4 text-left font-medium">Topics</th>
                    <th className="px-6 py-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredProblems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-400">
                        {problem.title}
                      </td>
                      <td className={`px-6 py-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                           {problem.tags?.length > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/90 text-white">
                              {problem.tags}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUpdate(problem._id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-yellow-900/30 hover:bg-yellow-900/30 text-yellow-300 border border-yellow-500 shadow-sm hover:shadow-md transition-all"

                        >
                          <SquarePen className="h-4 w-4 text-yellow-300" />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-64">
              {searchQuery ? (
                <>
                  <AlertCircle className="h-10 w-10 mb-2 text-gray-600" />
                  <p>No problems found for your search.</p>
                </>
              ) : (
                <>
                  <CircleSlash className="h-10 w-10 mb-2 text-gray-600" />
                  <p>No problems available.</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UpdateProblem;
