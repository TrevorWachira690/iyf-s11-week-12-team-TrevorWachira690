import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useDarkMode } from '../hooks/useDarkMode.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
          TBM-DeepIn
        </Link>

        <div className="flex items-center gap-4 text-sm">
<Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
             Listings
           </Link>

          {user ? (
            <>
              {user.role === 'business' && (
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Log in
              </Link>
              <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
            className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
