import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is an admin
  const isAdmin = user && (user as any).role === 'admin';

  React.useEffect(() => {
    if (!isAdmin) {
      addToast('Access denied. Admin privileges required.', 'error');
      navigate('/dashboard');
    }
  }, [isAdmin, navigate, addToast]);

  // Helper function to check if current route is active or its sub-routes are active
  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">SkillCrawler Admin</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Admin Sidebar */}
      <div className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} md:block
        w-full md:w-64 bg-blue-900 text-white md:min-h-screen p-4 md:sticky md:top-0 md:h-screen
      `}>
        <div className="text-xl font-bold mb-6 hidden md:block">SkillCrawler Admin</div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                end
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </NavLink>
            </li>
            <li>
              <div className={`${isRouteActive('/admin/skills') ? 'bg-blue-700' : ''} rounded`}>
                <NavLink 
                  to="/admin/skills" 
                  className={`flex items-center p-2 ${isRouteActive('/admin/skills') ? '' : 'hover:bg-blue-800'} rounded`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Manage Skills
                </NavLink>
                {isRouteActive('/admin/skills') && (
                  <div className="ml-7 mt-1 space-y-1">
                    <NavLink 
                      to="/admin/skills/new" 
                      className={({ isActive }) => `block pl-2 py-1 text-sm ${isActive ? 'text-blue-300 font-medium' : 'text-blue-400 hover:text-blue-200'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + Add New Skill
                    </NavLink>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={`${isRouteActive('/admin/paths') ? 'bg-blue-700' : ''} rounded`}>
                <NavLink 
                  to="/admin/paths" 
                  className={`flex items-center p-2 ${isRouteActive('/admin/paths') ? '' : 'hover:bg-blue-800'} rounded`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Learning Paths
                </NavLink>
                {isRouteActive('/admin/paths') && (
                  <div className="ml-7 mt-1 space-y-1">
                    <NavLink 
                      to="/admin/paths/new" 
                      className={({ isActive }) => `block pl-2 py-1 text-sm ${isActive ? 'text-blue-300 font-medium' : 'text-blue-400 hover:text-blue-200'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + Add New Path
                    </NavLink>
                  </div>
                )}
              </div>
            </li>
            <li>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => `flex items-center p-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="mt-8 pt-4 border-t border-blue-800">
          <NavLink 
            to="/" 
            className="flex items-center p-2 text-blue-300 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </NavLink>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
