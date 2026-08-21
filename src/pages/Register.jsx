import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.register(formData);
      login(response.token, response.user);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="customer">Customer</option>
          <option value="business">Business</option>
        </select>
        {formData.role === 'business' && (
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
      </p>
    </div>
  );
}
