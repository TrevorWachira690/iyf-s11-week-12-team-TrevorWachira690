// GROUP LEADER — Shared / Wiring
//
// Copy your working code here.
// The public landing page shown at "/".
//
// Paste your code below this line:
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="card center-card">
      <h1>Welcome to The Board</h1>
      <p>A community hub where students post, read, and discuss.</p>
      <div className="row-actions center">
        <Link className="btn" to="/posts">
          Browse posts
        </Link>
        {!isLoggedIn && (
          <Link className="btn secondary" to="/register">
            Create an account
          </Link>
        )}
      </div>
    </div>
  );
}

