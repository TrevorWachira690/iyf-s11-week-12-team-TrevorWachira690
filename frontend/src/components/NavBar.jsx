import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          The <span>Board</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/posts" onClick={() => setMenuOpen(false)}>
            Posts
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/messages" onClick={() => setMenuOpen(false)}>
                Messages
              </Link>
              <Link
                to={`/users/${user.id}`}
                className="nav-user-link"
                onClick={() => setMenuOpen(false)}
              >
                <Avatar src={user?.avatar} name={user?.name} size={26} />
                <span>{user?.name}</span>
              </Link>
              <button className="link-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="nav-cta" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
