import axios from '../utils/axios';

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const organizationService = {
  // Profile
  getProfile: async () => {
    const response = await axios.get('/api/organizations/profile', getAuthHeaders());
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put('/api/organizations/profile', profileData, getAuthHeaders());
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await axios.get('/api/organizations/events', getAuthHeaders());
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await axios.post('/api/organizations/events', eventData, getAuthHeaders());
    return response.data;
  },

  // Sponsorships
  getSponsorships: async () => {
    const response = await axios.get('/api/organizations/sponsorships', getAuthHeaders());
    return response.data;
  },

  createSponsorship: async (sponsorshipData) => {
    const response = await axios.post('/api/sponsorships', sponsorshipData, getAuthHeaders());
    return response.data;
  },

  // Travel Support
  getTravelSupports: async () => {
    const response = await axios.get('/api/travel-supports', getAuthHeaders());
    return response.data;
  },

  createTravelSupport: async (travelSupportData) => {
    const response = await axios.post('/api/travel-supports', travelSupportData, getAuthHeaders());
    return response.data;
  },

  // Applications
  getApplications: async () => {
    const response = await axios.get('/api/organizations/applications', getAuthHeaders());
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await axios.put(
      `/api/organizations/applications/${applicationId}`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  }
};