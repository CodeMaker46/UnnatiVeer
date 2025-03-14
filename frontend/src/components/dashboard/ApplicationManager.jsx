import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/applications');
      console.log('Applications:', response.data); // For debugging
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/organizations/applications/${applicationId}`, { status });
      fetchApplications(); // Refresh the list after update
      alert(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update request status');
    }
  };

  const fetchAthleteProfile = async (athleteId) => {
    try {
      const response = await axios.get(`/api/organizations/athlete/${athleteId}`);
      setSelectedAthlete(response.data);
    } catch (error) {
      console.error('Error fetching athlete profile:', error);
      alert('Failed to fetch athlete profile');
    }
  };

  const renderAthleteProfile = () => {
    if (!selectedAthlete) return null;

    const profilePhoto = selectedAthlete.photos?.[0]?.url || 'default-profile-photo.jpg';

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-4xl w-11/12 max-h-[90vh] overflow-auto">
          <div className="flex gap-6 mb-8">
            <img 
              src={profilePhoto} 
              alt={selectedAthlete.fullName} 
              className="w-48 h-48 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{selectedAthlete.fullName}</h2>
              <p className="mb-1"><span className="font-semibold">Sport:</span> {selectedAthlete.sportsCategory}</p>
              <p className="mb-1"><span className="font-semibold">Level:</span> {selectedAthlete.currentLevel}</p>
              <p className="mb-1"><span className="font-semibold">Location:</span> {selectedAthlete.city}, {selectedAthlete.state}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Photos & Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedAthlete.photos?.slice(1).map((photo, index) => (
                <div key={`photo-${index}`} className="rounded-lg overflow-hidden">
                  <img src={photo.url} alt="" className="w-full h-48 object-cover" />
                </div>
              ))}
              
              {selectedAthlete.videos?.map((video, index) => (
                <div key={`video-${index}`} className="rounded-lg overflow-hidden">
                  <video 
                    src={video.url} 
                    controls 
                    className="w-full h-48"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <p className="mb-2"><span className="font-semibold">Age:</span> {selectedAthlete.age}</p>
            <p className="mb-2"><span className="font-semibold">Contact:</span> {selectedAthlete.contactNumber}</p>
            <p className="mb-2"><span className="font-semibold">Guardian:</span> {selectedAthlete.guardianName}</p>
            
            {selectedAthlete.bio && (
              <>
                <h3 className="text-xl font-semibold mt-6 mb-2">Bio</h3>
                <p className="text-gray-700">{selectedAthlete.bio}</p>
              </>
            )}
            
            {selectedAthlete.achievements && (
              <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                <p className="text-gray-700">{selectedAthlete.achievements}</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSelectedAthlete(null)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading requests...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Requests</h2>
      {applications.length > 0 ? (
        applications.map(app => (
          <div key={app._id} className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{app.event?.title}</h3>
                <p className="text-gray-600 mb-2">
                  <strong>From:</strong> {app.athlete?.fullName} ({app.athlete?.email})
                </p>
                <button
                  onClick={() => fetchAthleteProfile(app.athlete._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  View Profile
                </button>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'accepted' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
                {app.status}
              </span>
            </div>
            <div className="mb-4">
              <p className="mb-2"><strong>Message:</strong> {app.message}</p>
              {app.requirements && (
                <p className="mb-2"><strong>Requirements:</strong> {app.requirements}</p>
              )}
              <p className="text-sm text-gray-500">
                <strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
            {app.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApplicationStatus(app._id, 'accepted')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleApplicationStatus(app._id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No pending requests</p>
      )}

      {selectedAthlete && renderAthleteProfile()}
    </div>
  );
};

export default ApplicationManager;