import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Calendar, Trophy, Settings, Bell } from 'lucide-react';

const AthleteNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/athlete/dashboard" className="flex items-center gap-2 group">
              <Trophy className="w-8 h-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Athlete Portal
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/athlete/dashboard" icon={<LayoutDashboard size={18} />} text="Dashboard" />
            <NavLink to="/athlete/events" icon={<Calendar size={18} />} text="Events" />
            <NavLink to="/athlete/achievements" icon={<Trophy size={18} />} text="Achievements" />

            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-200 hover:text-white rounded-full hover:bg-white/10 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings size={20} />
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-500/80 hover:bg-red-600/80 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default AthleteNavbar;