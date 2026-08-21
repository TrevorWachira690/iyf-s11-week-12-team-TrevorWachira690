import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SEO from '../components/SEO.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    businessName: '',
  });
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        role,
        role === 'business' ? formData.businessName : ''
      );
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="TBM-DeepIn - Register" 
        description="Create a new account as a business or customer to start buying or selling marketplace listings."
      />
      
      <div className="max-w-sm mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setFormData({ username: formData.username, email: formData.email, password: formData.password, businessName: '' });
            }}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="customer">Customer</option>
            <option value="business">Business</option>
          </select>
          
          {role === 'business' && (
            <input
              type="text"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || (role === 'business' && !formData.businessName)}
            className="w-full bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="text-sm mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600">Log in</Link>
        </p>
      </div>
    </>
  );
}
