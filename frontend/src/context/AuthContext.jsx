import { createContext, useContext, useState, useCallback } from 'react';
import { apiFetch } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = useCallback(async ({ name, email, password }) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    persist(data.token, data.user);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    persist(data.token, data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Used after editing your profile (bio/avatar/name). The JWT itself
  // doesn't need to change - it's only used for authorization, not display -
  // so we just update the cached user object.
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = { token, user, isLoggedIn: !!token, register, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
