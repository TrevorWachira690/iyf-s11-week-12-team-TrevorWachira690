// CHRISTINE — Frontend: Accounts & Profiles
//
// Copy your working code here.
// The registration page/form.
//
// Paste your code below this line:

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/posts');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card narrow-card">
      <h1>Create an account</h1>
      {error && <div className="error show">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">School email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="hint">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
