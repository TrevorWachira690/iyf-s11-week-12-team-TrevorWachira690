import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, fetch the current user so a page
  // refresh doesn't log the user out.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password, role, businessType, businessName, whatsappNumber) {
    const data = await api.register({ 
      name, 
      email, 
      password, 
      role, 
      businessType,
      businessName: businessName || '',
      whatsappNumber: whatsappNumber || '',
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function googleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}

