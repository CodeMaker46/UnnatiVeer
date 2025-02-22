import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import EventForm from './EventForm';
import SponsorshipForm from './SponsorshipForm';
import TransportForm from './TransportForm';
import OrganizationProfile from './OrganizationProfile';
import ApplicationManager from './ApplicationManager';
import { Medal, Trophy, LogOut, Search, Bell, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const menuItems = [
    { id: 'profile', label: 'Organization Profile', icon: '👤' },
    { id: 'events', label: 'Events', icon: '🎯' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💰' },
    { id: 'travel', label: 'Travel Support', icon: '✈️' },
    { id: 'applications', label: 'Applications', icon: '📝' }
  ];
  const fetchOrganizationData = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/profile');
      setOrganizationData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/events');
      setEventsList(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, []);

  const fetchSponsorships = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/sponsorships');
      setSponsorships(response.data);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
    }
  }, []);

  const fetchTravelSupports = useCallback(async () => {
    try {
      const response = await axios.get('/api/travel-supports');
      setTravelSupports(response.data);
    } catch (error) {
      console.error('Error fetching travel supports:', error);
    }
  }, []);

  const renderSponsorshipCard = (sponsorship) => (
    <div key={sponsorship._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{sponsorship.title}</h3>
          <p className="text-sm text-gray-300 mb-2">{sponsorship.sport}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${sponsorship.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
          {sponsorship.status}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Amount:</span> ₹{sponsorship.amount}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{sponsorship.description}</p>
      </div>
    </div>
  );

  const renderTravelSupportCard = (support) => (
    <div key={support._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{support.title}</h3>
          <p className="text-sm text-gray-300 mb-2">
            Valid till: {new Date(support.validTill).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
          {support.coverageType}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Amount Range:</span> ₹{support.amount?.min || 0} - ₹{support.amount?.max || 0}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{support.details}</p>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    const handleFormClose = async () => {
      setShowForm(false);
      if (activeTab === 'events') {
        await fetchEvents();
      } else if (activeTab === 'sponsorships') {
        await fetchSponsorships();
      } else if (activeTab === 'travel') {
        await fetchTravelSupports();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start z-[100] pt-20">
        <div className="bg-[#0F0F2D]/95 backdrop-blur-lg rounded-xl w-11/12 md:w-3/5 max-h-[80vh] overflow-y-auto relative p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {activeTab === 'events' ? 'Create New Event' : activeTab === 'sponsorships' ? 'Create New Sponsorship' : 'Create Travel Support'}
            </h3>
            <button 
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
              onClick={handleFormClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {activeTab === 'events' && <EventForm onClose={handleFormClose} />}
          {activeTab === 'sponsorships' && <SponsorshipForm onClose={handleFormClose} />}
          {activeTab === 'travel' && <TransportForm onClose={handleFormClose} />}
        </div>
      </div>
    );
  };

  const renderEventCard = (event) => (
    <div key={event._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{event.title}</h3>
          <p className="text-sm text-gray-300 mb-2">
            {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' : event.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-orange-400/20 text-orange-300'}`}>
          {event.status}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Sport:</span> {event.sport}</p>
        <p><span className="font-medium text-blue-400">Level:</span> {event.level}</p>
        <p><span className="font-medium text-blue-400">Location:</span> {event.location.city}, {event.location.state}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchOrganizationData();
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'sponsorships') {
      fetchSponsorships();
    } else if (activeTab === 'travel') {
      fetchTravelSupports();
    }
  }, [activeTab, fetchEvents, fetchApplications, fetchSponsorships, fetchTravelSupports]);

  return (
    <div className="flex h-screen bg-[#0B0B1E]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F0F2D] p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <Trophy className="h-8 w-8 text-blue-500" />
          <span className="text-white text-xl font-bold">UnnatiVeer</span>
        </div>

        <nav className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
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
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <button 
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
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
              {organizationData?.name?.charAt(0) || 'O'}
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
            {activeTab !== 'profile' && activeTab !== 'applications' && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create New</span>
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'profile' && <OrganizationProfile />}
                {activeTab === 'applications' && <ApplicationManager />}
                {activeTab === 'events' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsList.map(event => renderEventCard(event))}
                  </div>
                )}
                {activeTab === 'sponsorships' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsorships.map(sponsorship => renderSponsorshipCard(sponsorship))}
                  </div>
                )}
                {activeTab === 'travel' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {travelSupports.map(support => renderTravelSupportCard(support))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Modal Form */}
        {renderForm()}
      </div>
    </div>
  );
};

export default OrganizationDashboard;