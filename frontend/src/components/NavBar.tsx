import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <Link to="/" className="text-xl font-bold">SkillCrawler</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/skills" className="hover:text-blue-300 transition-colors">Skills</Link>
          <Link to="/paths" className="hover:text-blue-300 transition-colors">Learning Paths</Link>
          
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Hi, {user?.name || user?.email}</span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
