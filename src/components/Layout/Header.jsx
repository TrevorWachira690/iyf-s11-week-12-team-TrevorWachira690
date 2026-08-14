import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';

function Header() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header>
      <Link to="/">CommunityHub</Link>

      <nav>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>
    </header>
  );
}

export default Header;