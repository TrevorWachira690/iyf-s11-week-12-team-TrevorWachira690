import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';

function Header() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="font-bold text-lg text-gray-900 dark:text-white">
          CommunityHub
        </Link>

        <nav className="flex items-center gap-6 mt-2">
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:underline">
                Profile
              </Link>
              <button onClick={logout} className="text-gray-700 dark:text-gray-200 hover:underline">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:underline">
                Log In
              </Link>
              <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:underline">
                Register
              </Link>
            </>
          )}

          <button
            onClick={() => setIsDark(!isDark)}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-700 dark:text-gray-200"
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;