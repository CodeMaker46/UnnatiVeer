import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = ({ userType }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userType: currentUserType } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${currentUserType}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, currentUserType, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      const response = await axios.post(`/api/${userType.toLowerCase()}s/login`, formData);
      if (response.data.token) {
        try {
          await login(response.data.token, userType.toLowerCase());
          navigate(`/${userType.toLowerCase()}/dashboard`);
        } catch (loginError) {
          setError(loginError.message);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
      // Reset form data on error
      setFormData({
        email: formData.email,
        password: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {userType} Login
              </h2>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500
                           text-white font-medium rounded-lg shadow-lg
                           hover:shadow-xl transition-all duration-200"
                >
                  Login
                </motion.button>

                <p className="text-center text-gray-300 text-sm mt-6">
                  Don't have an account?{' '}
                  <Link 
                    to={`/register/${userType.toLowerCase()}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;