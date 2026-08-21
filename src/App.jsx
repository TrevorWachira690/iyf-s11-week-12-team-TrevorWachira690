import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BusinessListings from './pages/BusinessListings.jsx';
import Profile from './pages/Profile.jsx';
import CategoryPage from './pages/CategoryPage.jsx';

// This file is SHARED across all groups. Flag any changes in the group
// chat before editing — see TEAM_DIVISION.md "Collaboration Rules".
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/business/:id/listings" element={<BusinessListings />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="business">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
 
