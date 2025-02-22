import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Trophy, Users, Target, MapPin, Filter, Menu, Bell } from 'lucide-react';
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';

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

  const tabs = [
    { id: 'events', label: 'Events', icon: Target },
    { id: 'sponsorships', label: 'Sponsorships', icon: Trophy },
    { id: 'travel', label: 'Travel Support', icon: MapPin },
    { id: 'applications', label: 'My Applications', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: Users }
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="w-72 bg-black/30 backdrop-blur-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <div>
            <h2 className="text-xl font-bold text-white">Athlete portal</h2>
            <p className="text-gray-400 text-sm">
  Welcome back, {athleteProfile ? athleteProfile.fullName : 'Loading...'}
</p>
          </div>
        </div>

        <div className="space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full
                ${activeTab === id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
            {activeTab === 'events' && events.map(event => (
              <div 
                key={event._id} 
                className="bg-black/30 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.location.city}, {event.location.state}</span>
                  </div>
                  <button
                    onClick={() => handleApply(event._id, 'event')}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'sponsorships' && sponsorships.map(sponsorship => (
              <div
                key={sponsorship._id}
                className="bg-black/30 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-32 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{sponsorship.title}</h3>
                  <p className="text-gray-400">{sponsorship.description}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Amount: ₹{sponsorship.amount}</span>
                  </div>
                  <button
                    onClick={() => handleApply(sponsorship._id, 'sponsorship')}
                    className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'travel' && travelSupports.map(support => (
              <div
                key={support._id}
                className="bg-black/30 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-32 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{support.title}</h3>
                  <p className="text-gray-400">{support.details}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Coverage: {support.coverageType}</span>
                  </div>
                  <button
                    onClick={() => handleApply(support._id, 'travel')}
                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}

{activeTab === 'applications' && applications.map(application => (
  <div
    key={application._id}
    className="bg-black/30 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
  >
    <div className="flex flex-col gap-3">
      {/* Event Title */}
      <h3 className="text-lg font-semibold text-white">{application.itemId?.title || "No Title"}</h3>

      {/* Event Description */}
      <p className="text-sm text-gray-300">{application.itemId?.description || "No description available"}</p>

      {/* Applied Date */}
      <div className="flex items-center gap-2 text-gray-400">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{new Date(application.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Status */}
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
    </div>
  );
};

export default AthleteDashboard;