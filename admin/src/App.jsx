import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import AddProject from './pages/projects/AddProject';
import EditProject from './pages/projects/EditProject';
import JourneyList from './pages/journey/JourneyList';
import AddJourney from './pages/journey/AddJourney';
import EditJourney from './pages/journey/EditJourney';
import LifestyleList from './pages/lifestyle/LifestyleList';
import AddLifestyle from './pages/lifestyle/AddLifestyle';
import EditLifestyle from './pages/lifestyle/EditLifestyle';
import AddHighlight from './pages/lifestyle/AddHighlight';
import EditHighlight from './pages/lifestyle/EditHighlight';
import Messages from './pages/messages/Messages';
import MessageDetail from './pages/messages/MessageDetail';
import Settings from './pages/settings/Settings';
import Login from './pages/login/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/projects" element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectList />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/projects/add" element={
        <ProtectedRoute>
          <AdminLayout>
            <AddProject />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/projects/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <EditProject />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/journey" element={
        <ProtectedRoute>
          <AdminLayout>
            <JourneyList />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/journey/add" element={
        <ProtectedRoute>
          <AdminLayout>
            <AddJourney />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/journey/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <EditJourney />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/lifestyle" element={
        <ProtectedRoute>
          <AdminLayout>
            <LifestyleList />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/lifestyle/add" element={
        <ProtectedRoute>
          <AdminLayout>
            <AddLifestyle />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/lifestyle/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <EditLifestyle />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/lifestyle/add-highlight" element={
        <ProtectedRoute>
          <AdminLayout>
            <AddHighlight />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/lifestyle/edit-highlight/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <EditHighlight />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/messages" element={
        <ProtectedRoute>
          <AdminLayout>
            <Messages />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/messages/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <MessageDetail />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Fallback for other routes */}
      <Route path="*" element={
        <ProtectedRoute>
          <AdminLayout>
            <div className="page-fade" style={{ textAlign: 'center', marginTop: '100px' }}>
              <h1 className="gradient-text" style={{ fontSize: '48px' }}>Coming Soon</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>This module is currently under development.</p>
            </div>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              color: '#fff',
              border: '1px solid #2a2a2a',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;