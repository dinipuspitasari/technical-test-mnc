import { useNavigate, Link } from 'react-router-dom';

export default function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-700">TechTest Pay</Link>
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</button>
        <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-blue-600 font-medium">Profile</button>
        <div className="border-l border-gray-300 h-6"></div>
        <button onClick={handleLogout} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition cursor-pointer">
          Sign out
        </button>
      </div>
    </nav>
  );
}
