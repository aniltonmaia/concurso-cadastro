import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth.ts';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import CandidateList from './components/CandidateList.tsx';
import CandidateForm from './components/CandidateForm.tsx';
import Profile from './components/Profile.tsx';
import UserManagement from './components/UserManagement.tsx';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/candidates" 
        element={user ? <CandidateList /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/candidates/new" 
        element={user ? <CandidateForm /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/candidates/:id/edit" 
        element={user ? <CandidateForm /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/users" 
        element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
