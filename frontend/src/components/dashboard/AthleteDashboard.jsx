import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Target, MapPin, Filter, Menu, Trophy, LogOut, Bell } from 'lucide-react';
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AthleteDashboard = () => {
 // const [athleteProfile, setAthleteProfile] = useState(null);
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [athleteProfile, setAthleteProfile] = useState(null);

  const handleApply = async (id, type) => {
    try {
      const response = await axios.post(`/api/athletes/apply/${type}/${id}`, {
        message: `I am interested in this ${type} opportunity and would like to apply.`,
        requirements: 'No specific requirements'
      });
      
      // Refresh applications list after successful application
      const applicationsResponse = await axios.get('/api/athletes/applications');
      console.log("njnjnj",applicationsResponse)
      setApplications(applicationsResponse.data);
      
      // Show success message
      alert('Application submitted successfully!');
      
      // Switch to applications tab
      setActiveTab('applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      alert(errorMessage);
    }
  };

  const menuItems = [
    { id: 'events', label: 'Events', icon: '🎯' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💰' },
    { id: 'travel', label: 'Travel Support', icon: '✈️' },
    { id: 'applications', label: 'My Applications', icon: '📝' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'events') {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } else if (activeTab === 'sponsorships') {
        const response = await axios.get('/api/sponsorships');
        setSponsorships(response.data);
      } else if (activeTab === 'travel') {
        const response = await axios.get('/api/athletes/travel-supports');
        setTravelSupports(response.data);
      } else if (activeTab === 'applications') {
        const response = await axios.get('/api/athletes/applications');
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);
  useEffect(() => {
    const fetchAthleteProfile = async () => {
      try {
        const response = await axios.get('/api/athletes/profile');
        console.log('jkjk',response)
        setAthleteProfile(response.data);
      } catch (error) {
        console.error('Error fetching athlete profile:', error);
      }
    };
  
    fetchAthleteProfile();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex h-screen bg-[#0B0B1E]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F0F2D] p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <Trophy className="h-8 w-8 text-blue-500" />
          <span className="text-white text-xl font-bold">UnnatiVeer</span>
        </div>

        <nav className="flex-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span >Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#0F0F2D] border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {athleteProfile?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'events' && events.map(event => (
                  <div key={event._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{event.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 space-y-3">
                      <p><span className="font-medium text-blue-400">Location:</span> {event.location.city}, {event.location.state}</p>
                      <button
                        onClick={() => handleApply(event._id, 'event')}
                        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'sponsorships' && sponsorships.map(sponsorship => (
                  <div
                    key={sponsorship._id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{sponsorship.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{sponsorship.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 space-y-3">
                      <p><span className="font-medium text-purple-400">Amount:</span> ₹{sponsorship.amount}</p>
                      <button
                        onClick={() => handleApply(sponsorship._id, 'sponsorship')}
                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'travel' && travelSupports.map(support => (
                  <div
                    key={support._id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">{support.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">
                          <span className="font-medium text-teal-400">Organization:</span> {support.organization?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          <span className="font-medium text-teal-400">Valid till:</span>{new Date(support.validTill).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300`}>
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-3">
                      <p><span className="font-medium text-teal-400">Coverage:</span> {support.coverageType}</p>
                      <p><span className="font-medium text-teal-400">Amount Range:</span> ₹{support.amount?.min || 0} - ₹{support.amount?.max || 0}</p>
                      <p className="mt-2 text-gray-400 leading-relaxed">{support.details}</p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleApply(support._id, 'travel')}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'applications' && applications.map(application => (
                  <div
                    key={application._id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{application.itemId?.title || "No Title"}</h3>
                        <p className="text-sm text-gray-300 mb-2">{application.itemId?.description || "No description available"}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 space-y-3">
                      <p><span className="font-medium text-blue-400">Applied Date:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          application.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'profile' && <AthleteProfile />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard;