import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        name,
        email,
        password,
        role,
        businessType,
        businessName,
        whatsappNumber
      );
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create an Account</h2>

        {error && (
          <p role="alert" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm p-3 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="name" className={labelClass}>
            Name
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label htmlFor="email" className={labelClass}>
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label htmlFor="password" className={labelClass}>
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <fieldset className="border border-gray-300 dark:border-gray-600 rounded p-3">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Account Type</legend>
            <div className="flex gap-4">
              <label htmlFor="role-customer" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  id="role-customer"
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Customer
              </label>
              <label htmlFor="role-business" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  id="role-business"
                  type="radio"
                  name="role"
                  value="business"
                  checked={role === 'business'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Business
              </label>
            </div>
          </fieldset>

          {role === 'business' && (
            <>
              <label htmlFor="businessType" className={labelClass}>
                Business Type
                <input
                  id="businessType"
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  required
                  className={inputClass}
                />
              </label>

              <label htmlFor="businessName" className={labelClass}>
                Business Name
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className={inputClass}
                />
              </label>

              <label htmlFor="whatsappNumber" className={labelClass}>
                WhatsApp Number
                <input
                  id="whatsappNumber"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  className={inputClass}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;