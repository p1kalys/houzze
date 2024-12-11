import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export const AuthModal = ({ type, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const res = await API.post('/users/login', credentials);
      setIsLoggedIn(true);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message || "Error occurred, Please try again.");
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (credentials) => {
    try {
      await API.post('/users/register', credentials);
      navigate('/login');
    } catch (error) {
      setError(error.response.data.message || "Error occurred, Please try again.");
      console.error("Signup failed:", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');

    if (type === 'signup') {
      handleSignup({
        name: name,
        email: email,
        password: password,
      });
    } else {
      handleLogin({
        email: email,
        password: password,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => navigate('/')}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-modalSlideIn">
        <div className="p-6">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-lg md:tex-2xl font-bold text-gray-900 mb-6">
            {type === 'login' ? 'Log in to your Account' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                placeholder="Enter your password"
              />
            </div>
            {error && <p className='text-red-700'>{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition-transform transform active:scale-95 transition-colors"
            >
              {type === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};