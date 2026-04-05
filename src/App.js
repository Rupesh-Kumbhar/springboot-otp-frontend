import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signUp';
import Login from './components/login';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/adminDashboard';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['USER']}>
              <Dashboard />
            </PrivateRoute>
          } />
        <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;