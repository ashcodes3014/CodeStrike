import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  User, BookOpen, CheckCircle, Trophy,
   Calendar, Clock, ArrowLeft
} from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { solvedProblems = [] } = useSelector((state) => state.problems);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const difficultyCounts = {
    easy: solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'easy').length,
    medium: solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'medium').length,
    hard: solvedProblems.filter(p => p.difficulty?.toLowerCase() === 'hard').length
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 shadow-sm p-4 flex justify-between items-center border-b border-gray-800">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
            alt="CodeStrike Logo"
            className="h-8 w-8 ml-2"
          />
          <span className="text-xl font-bold text-white">CodeStrike</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800/70"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* User Info */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gray-800 flex items-center justify-center border-2 border-blue-500 mb-4">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-400">{user.emailID}</p>
              
              {user.role === 'admin' && (
                <span className="mt-2 px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-800">
                  Admin
                </span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 w-full md:w-2/3">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Your Stats
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Solved</span>
                </div>
                <p className="text-3xl font-bold">{solvedProblems.length}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Easy</span>
                </div>
                <p className="text-3xl font-bold">{difficultyCounts.easy}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Medium</span>
                </div>
                <p className="text-3xl font-bold">{difficultyCounts.medium}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-red-400" />
                  <span>Hard</span>
                </div>
                <p className="text-3xl font-bold">{difficultyCounts.hard}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solved Problems Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-400" />
            Solved Problems ({solvedProblems.length})
          </h3>

          {solvedProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {solvedProblems.map(problem => (
                    <tr key={problem._id} className="hover:bg-gray-800/30 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-blue-400 hover:text-blue-300" onClick={() => navigate(`/problem/${problem._id}`)}>
                        {problem.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-green-900/20 text-green-400' :
                          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-red-900/20 text-red-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                              {problem.tags}
                            </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No problems solved yet</p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
              >
                Start Solving
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;