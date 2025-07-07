import { useNavigate } from 'react-router';
import { ArrowLeft, Users } from 'lucide-react';

function ManageUser() {
  const navigate = useNavigate();

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
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30 text-blue-400 border border-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Dashboard
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <Users className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-2xl font-semibold text-blue-300">Manage Users</h1>
        <p className="text-gray-400 mt-2">will be Implementing Soon...</p>
      </main>
    </div>
  );
}

export default ManageUser;
