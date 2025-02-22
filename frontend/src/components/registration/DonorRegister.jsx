import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';

const DonorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    donorType: 'individual',
    organization: '',
    contactNumber: '',
    panNumber: '',
    city: '',
    state: '',
    preferredSports: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit contact number');
      return;
    }

    try {
      const requestData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        donorType: formData.donorType,
        organization: formData.organization.trim(),
        contactNumber: formData.contactNumber.trim(),
        panNumber: formData.panNumber.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        preferredSports: formData.preferredSports 
          ? formData.preferredSports.split(',').map(sport => sport.trim())
          : []
      };

      const response = await axios.post('/api/donors/register', requestData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', 'donor');
        localStorage.setItem('userData', JSON.stringify(response.data.donor));
        navigate('/donor/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Donor Registration
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Donor Type</label>
                  <select
                    name="donorType"
                    value={formData.donorType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  >
                    <option value="individual" className="bg-slate-800">Individual</option>
                    <option value="organization" className="bg-slate-800">Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Organization (Optional)</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Organization name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Preferred Sports (comma-separated)</label>
                  <input
                    type="text"
                    name="preferredSports"
                    value={formData.preferredSports}
                    onChange={handleChange}
                    placeholder="e.g., Cricket, Football, Basketball"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500
                         text-white font-medium rounded-lg shadow-lg
                         hover:shadow-xl transition-all duration-200"
              >
                Register as Donor
              </motion.button>

              <p className="text-center text-gray-300 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login/donor"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonorRegister;
