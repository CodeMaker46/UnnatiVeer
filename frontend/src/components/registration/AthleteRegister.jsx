import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';

const AthleteRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    sportsCategory: '',
    currentLevel: '',
    contactNumber: '',
    guardianName: '',
    city: '',
    state: '',
    achievements: ''
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
      const response = await axios.post('/api/athletes/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login/athlete');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white relative overflow-hidden">
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
          <div className="bg-[#0F0F2D] backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Athlete Registration
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
                  <label className="block text-sm font-medium text-gray-200 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Sports Category</label>
                  <select
                    name="sportsCategory"
                    value={formData.sportsCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  >
                    <option value="" className="bg-slate-800">Select sport</option>
                    <option value="cricket" className="bg-slate-800">Cricket</option>
                    <option value="football" className="bg-slate-800">Football</option>
                    <option value="basketball" className="bg-slate-800">Basketball</option>
                    <option value="tennis" className="bg-slate-800">Tennis</option>
                    <option value="athletics" className="bg-slate-800">Athletics</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Current Level</label>
                  <select
                    name="currentLevel"
                    value={formData.currentLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  >
                    <option value="" className="bg-slate-800">Select level</option>
                    <option value="school" className="bg-slate-800">School</option>
                    <option value="district" className="bg-slate-800">District</option>
                    <option value="state" className="bg-slate-800">State</option>
                    <option value="national" className="bg-slate-800">National</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Guardian Name (if under 18)</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    placeholder="Enter guardian's name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                             focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Achievements</label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  placeholder="List your major achievements"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50
                           focus:ring-2 focus:ring-blue-500/25 transition-all duration-200
                           min-h-[100px] resize-y"
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
                Register as Athlete
              </motion.button>

              <p className="text-center text-gray-300 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login/athlete"
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

export default AthleteRegister;
