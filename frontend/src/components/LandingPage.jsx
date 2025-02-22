import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Heart, ChevronRight, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, userType, userData, logout } = useAuth();
  const [showCards, setShowCards] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const cardItems = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Organization',
      description: 'Create and manage sports events, provide opportunities for athletes',
      path: 'organization',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Athlete',
      description: 'Find opportunities, connect with organizations, and showcase your talents',
      path: 'athlete',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Donor',
      description: 'Support athletes and organizations, make a difference in sports',
      path: 'donor',
      gradient: 'from-orange-500 to-red-500'
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 hover:opacity-80">
            <Trophy className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">UnnatiVeer</span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-white hover:text-blue-400 transition">About</a>
              <Link to="/athletes" className="text-white hover:text-blue-400 transition">Athletes</Link>
              <a href="#organizations" className="text-white hover:text-blue-400 transition">Organizations</a>
              <a href="#success-stories" className="text-white hover:text-blue-400 transition">Success Stories</a>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    className="group relative flex items-center justify-center w-full"
                    onClick={() => setShowLoginOptions(!showLoginOptions)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-lg transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                      {userData?.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0B1E] transform transition-all duration-300 group-hover:scale-110"></div>
                  </button>
                  {showLoginOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-[100]"
                    >
                      <Link
                        to={`/${userType}/dashboard`}
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative group">
                    <button
                      className="text-white hover:text-blue-400 transition"
                      onClick={() => {
                        setShowLoginOptions(!showLoginOptions);
                        setShowSignupOptions(false);
                      }}
                    >
                      Log in
                    </button>
                    {showLoginOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-[100]"
                      >
                        <Link
                          to="/login/athlete"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Athlete Login
                        </Link>
                        <Link
                          to="/login/donor"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Donor Login
                        </Link>
                        <Link
                          to="/login/organization"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Organization Login
                        </Link>
                      </motion.div>
                    )}
                  </div>
                  <div className="relative group">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
                      onClick={() => {
                        setShowSignupOptions(!showSignupOptions);
                        setShowLoginOptions(false);
                      }}
                    >
                      Sign Up
                    </button>
                    {showSignupOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-[100]"
                      >
                        <Link
                          to="/register/athlete"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Athlete Signup
                        </Link>
                        <Link
                          to="/register/donor"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Donor Signup
                        </Link>
                        <Link
                          to="/register/organization"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Organization Signup
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-[1]">  {/* Changed z-10 to z-[1] */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              🚀 Welcome to the Future of Sports
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            UnnatiVeer
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12">
            Empowering Athletes, Organizations, and Donors to Create a Stronger Sports Community
          </p>
          
          {!showCards && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCards(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-full 
                       shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
            >
              Get Started
              <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>

        {showCards && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cardItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <Link
                    to={`/register/${item.path}`}
                    className={`w-full bg-gradient-to-r ${item.gradient} text-white 
                             font-medium px-6 py-3 rounded-full transition-all duration-300 
                             flex items-center justify-center group`}
                  >
                    Sign up as {item.title}
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24"
        >
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
              {[
                { number: "1000+", label: "Athletes" },
                { number: "200+", label: "Organizations" },
                { number: "500+", label: "Donors" },
                { number: "$2M+", label: "Raised" }
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 w-full">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Athlete Success Story */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">National Champion Athlete</h3>
                  <p className="text-gray-400">Rahul Kumar</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                "Through UnnatiVeer's support, I was able to secure funding for my training and compete at the national level. Today, I'm proud to be a national champion in athletics."
              </p>
            </motion.div>
        
            {/* Organization Success Story */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sports Academy Impact</h3>
                  <p className="text-gray-400">Champions Sports Academy</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                "We've successfully supported over 100 young athletes through our programs, with 30% of them reaching state and national levels in their respective sports."
              </p>
            </motion.div>
          </div>
        </motion.div>
        {/* Stars effect */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?fit=crop&w=2000&q=80')] opacity-20 pointer-events-none" />
      </div>
    </div>
  );
}

export default App;