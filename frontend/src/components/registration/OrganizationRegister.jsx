import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';

const OrganizationRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    foundedYear: '',
    sports: '',
    address: '',
    city: '',
    state: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/organizations/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login/organization');
      }
    } catch (error) {
      console.error('Registration failed:', error);
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
                Organization Registration
              </h2>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="organization@example.com"
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
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Organization name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Organization Type</label>
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  >
                    <option value="" className="bg-slate-800">Select type</option>
                    <option value="academy" className="bg-slate-800">Sports Academy</option>
                    <option value="club" className="bg-slate-800">Sports Club</option>
                    <option value="institute" className="bg-slate-800">Training Institute</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Registration Number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Registration number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Founded Year</label>
                  <input
                    type="text"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    placeholder="YYYY"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Sports</label>
                  <select
                    name="sports"
                    value={formData.sports}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  >
                    <option value="" className="bg-slate-800">Select sports</option>
                    <option value="cricket" className="bg-slate-800">Cricket</option>
                    <option value="football" className="bg-slate-800">Football</option>
                    <option value="basketball" className="bg-slate-800">Basketball</option>
                    <option value="tennis" className="bg-slate-800">Tennis</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
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
                    placeholder="City"
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
                    placeholder="State"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
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
                Register Organization
              </motion.button>

              <p className="text-center text-gray-300 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login/organization"
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

export default OrganizationRegister;
