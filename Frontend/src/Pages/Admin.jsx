import { Plus, Pencil, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

const AdminPanel = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Problem",
      description: "Add new coding challenges to the platform",
      icon: <Plus size={28} className="text-emerald-400" />,
      color: "bg-emerald-600 hover:bg-emerald-500 border border-emerald-500",
      hoverColor: "hover:shadow-emerald-500/20",
      buttonText: "Create",
      route: "/admin/create-problem",
    },
    {
      title: "Update Problem",
      description: "Modify existing problem details",
      icon: <Pencil size={28} className="text-amber-400" />,
      color: "bg-amber-600 hover:bg-amber-500 border border-amber-500",
      hoverColor: "hover:shadow-amber-500/20",
      buttonText: "Update",
      route: "/admin/update-problem",
    },
    {
      title: "Delete Problem",
      description: "Remove problems permanently",
      icon: <Trash2 size={28} className="text-rose-400" />,
      color: "bg-rose-600 hover:bg-rose-500 border border-rose-500",
      hoverColor: "hover:shadow-rose-500/20",
      buttonText: "Delete",
      route: "/admin/delete-problem",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-gray-950 text-gray-100">
      {/* Header Area */}
      <header className="bg-gray-900/50 shadow-sm p-4 flex justify-between items-center border-b border-gray-800 mb-5">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors" 
          onClick={() => navigate('/')}
        >
          <img 
            src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
            alt="CodeStrike Logo" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-bold text-white">CodeStrike</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/70"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-white">Admin Dashboard</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Manage all coding problems and platform content
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
              <div
                key={idx}
                className={`bg-gray-900 rounded-xl border border-gray-800 p-6 transition-all shadow-lg group hover:border-${action.color.split('-')[1]}-400/30 ${action.hoverColor}`}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className={`mb-5 p-3 rounded-full bg-gray-800 border border-gray-700 group-hover:border-${action.color.split('-')[1]}-400/30 transition-colors`}>
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{action.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {action.description}
                  </p>
                  <button
                    onClick={() => navigate(action.route)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white ${action.color} transition-all hover:shadow-lg w-full max-w-xs hover:scale-[1.02] active:scale-95`}
                  >
                    {action.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Admin Features */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              Advanced Admin Tools
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-blue-400/30 transition-colors">
                <h4 className="font-medium text-gray-200 mb-2">User Management</h4>
                <p className="text-sm text-gray-400 mb-3">View and manage all user accounts and permissions</p>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-colors"
                >
                  Manage Users
                </button>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-purple-400/30 transition-colors">
                <h4 className="font-medium text-gray-200 mb-2">Analytics Dashboard</h4>
                <p className="text-sm text-gray-400 mb-3">View platform usage statistics and performance metrics</p>
                <button 
                  onClick={() => navigate('/admin/analytics')}
                  className="text-sm px-4 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-white transition-colors"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;