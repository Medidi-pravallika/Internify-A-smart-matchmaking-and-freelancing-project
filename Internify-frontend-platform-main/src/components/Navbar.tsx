import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();
  const role = authService.getRole();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'STUDENT') return '/dashboard/student/profile';
    if (role === 'RECRUITER') return '/dashboard/recruiter/profile';
    if (role === 'ADMIN') return '/dashboard/admin/analytics';
    return '/';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-2xl font-bold text-blue-600">Internify</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
