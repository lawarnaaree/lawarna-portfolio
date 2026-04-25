import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import Login from './pages/login/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Static for now) */}
        <Route path="/dashboard" element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />

        <Route path="/projects" element={
          <AdminLayout>
            <ProjectList />
          </AdminLayout>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Fallback for other routes */}
        <Route path="*" element={
          <AdminLayout>
            <div className="page-fade" style={{ textAlign: 'center', marginTop: '100px' }}>
              <h1 className="gradient-text" style={{ fontSize: '48px' }}>Coming Soon</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>This module is currently under development.</p>
            </div>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;