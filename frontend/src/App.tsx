import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import TestTailwind from './components/TestTailwind';
import ToastContainer from './components/ToastContainer';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSkills from './pages/admin/AdminSkills';
import AdminLearningPaths from './pages/admin/AdminLearningPaths';
import AdminUsers from './pages/admin/AdminUsers';
import SkillForm from './pages/admin/SkillForm';
import LearningPathForm from './pages/admin/LearningPathForm';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import SkillsPage from './pages/SkillsPage';
import SkillDetail from './pages/SkillDetail';
import LearningPathsPage from './pages/LearningPathsPage';
import LearningPathDetail from './pages/LearningPathDetail';
import CreateLearningPath from './pages/CreateLearningPath';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import './App.css';



// Home page component
const Home: React.FC = () => (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Learn skills efficiently with <span className="text-blue-600">SkillCrawler</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          AI-powered learning paths from the web's best content, organized just for you.
        </p>
      </div>
    </div>
  </div>
);

// Protected route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has admin role
  const isAdmin = user && (user as any).role === 'admin';
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <ToastContainer />
          <NavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/test-tailwind" element={<TestTailwind />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/skills/:id" element={<SkillDetail />} />
              <Route path="/paths" element={<LearningPathsPage />} />
              <Route 
                path="/paths/create" 
                element={
                  <ProtectedRoute>
                    <CreateLearningPath />
                  </ProtectedRoute>
                } 
              />
              <Route path="/paths/:id" element={<LearningPathDetail />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="skills/new" element={<SkillForm />} />
                <Route path="skills/edit/:id" element={<SkillForm />} />
                <Route path="paths" element={<AdminLearningPaths />} />
                <Route path="paths/new" element={<LearningPathForm />} />
                <Route path="paths/edit/:id" element={<LearningPathForm />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </div>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
