import { createContext, useContext, useState, useEffect } from 'react';
import  { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
     
    }
    setLoading(false);
  }, []);


async function register(name, email, password, role, businessType, businessName, whatsappNumber) {
  const data = await api.register({
    username: name,
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

async function login(email, password) {
  const data = await api.login({ email, password });
  localStorage.setItem('token', data.token);
  setUser(data.user);
  return data.user;
}

function logout() {
    localStorage.removeItem('token');
    setUser(null);
}

const value = { user, loading, register, login, logout };

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
  return useContext(AuthContext);
}