import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          TBM-DeepIn
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/admin" className="text-sm hover:underline">
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm text-red-600 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-sm hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
