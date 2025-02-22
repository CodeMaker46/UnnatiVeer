import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#2d3748'
    },
    requestCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    requestHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    eventTitle: {
      fontSize: '18px',
      marginBottom: '5px',
      color: '#2d3748'
    },
    athleteInfo: {
      color: '#4a5568',
      marginBottom: '10px'
    },
    status: {
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500'
    },
    requestContent: {
      marginBottom: '15px'
    },
    date: {
      color: '#718096',
      fontSize: '14px',
      marginTop: '10px'
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    noRequests: {
      textAlign: 'center',
      color: '#718096',
      padding: '20px'
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    athleteProfile: {
      marginBottom: '20px'
    },
    mediaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    mediaItem: {
      borderRadius: '8px',
      overflow: 'hidden'
    },
    mediaImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    mediaVideo: {
      width: '100%',
      height: '200px'
    },
    achievementsSection: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    closeButton: {
      backgroundColor: '#f44336',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '20px'
    },
    viewProfileButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '10px'
    },
    profileHeader: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px'
    },
    profilePhoto: {
      width: '200px',
      height: '200px',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    profileInfo: {
      flex: 1
    },
    mediaSection: {
      marginBottom: '30px'
    },
    detailsSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }
  };

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
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.profileHeader}>
            <img 
              src={profilePhoto} 
              alt={selectedAthlete.fullName} 
              style={styles.profilePhoto}
            />
            <div style={styles.profileInfo}>
              <h2>{selectedAthlete.fullName}</h2>
              <p><strong>Sport:</strong> {selectedAthlete.sportsCategory}</p>
              <p><strong>Level:</strong> {selectedAthlete.currentLevel}</p>
              <p><strong>Location:</strong> {selectedAthlete.city}, {selectedAthlete.state}</p>
            </div>
          </div>

          <div style={styles.mediaSection}>
            <h3>Photos & Videos</h3>
            <div style={styles.mediaGrid}>
              {selectedAthlete.photos?.slice(1).map((photo, index) => (
                <div key={`photo-${index}`} style={styles.mediaItem}>
                  <img src={photo.url} alt="" style={styles.mediaImage} />
                </div>
              ))}
              
              {selectedAthlete.videos?.map((video, index) => (
                <div key={`video-${index}`} style={styles.mediaItem}>
                  <video 
                    src={video.url} 
                    controls 
                    style={styles.mediaVideo}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={styles.detailsSection}>
            <h3>Personal Information</h3>
            <p><strong>Age:</strong> {selectedAthlete.age}</p>
            <p><strong>Contact:</strong> {selectedAthlete.contactNumber}</p>
            <p><strong>Guardian:</strong> {selectedAthlete.guardianName}</p>
            
            {selectedAthlete.bio && (
              <>
                <h3>Bio</h3>
                <p>{selectedAthlete.bio}</p>
              </>
            )}
            
            {selectedAthlete.achievements && (
              <div style={styles.achievementsSection}>
                <h3>Achievements</h3>
                <p>{selectedAthlete.achievements}</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSelectedAthlete(null)}
            style={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Event Requests</h2>
      {applications.length > 0 ? (
        applications.map(app => (
          <div key={app._id} style={styles.requestCard}>
            <div style={styles.requestHeader}>
              <div>
                <h3 style={styles.eventTitle}>{app.event?.title}</h3>
                <p style={styles.athleteInfo}>
                  <strong>From:</strong> {app.athlete?.fullName} ({app.athlete?.email})
                </p>
                <button
                  onClick={() => fetchAthleteProfile(app.athlete._id)}
                  style={styles.viewProfileButton}
                >
                  View Profile
                </button>
              </div>
              <span style={{
                ...styles.status,
                backgroundColor: 
                  app.status === 'accepted' ? '#4CAF50' :
                  app.status === 'rejected' ? '#f44336' :
                  '#ffa726',
                color: 'white'
              }}>
                {app.status}
              </span>
            </div>
            <div style={styles.requestContent}>
              <p><strong>Message:</strong> {app.message}</p>
              {app.requirements && (
                <p><strong>Requirements:</strong> {app.requirements}</p>
              )}
              <p style={styles.date}>
                <strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
            {app.status === 'pending' && (
              <div style={styles.actions}>
                <button
                  onClick={() => handleApplicationStatus(app._id, 'accepted')}
                  style={{...styles.button, backgroundColor: '#4CAF50'}}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleApplicationStatus(app._id, 'rejected')}
                  style={{...styles.button, backgroundColor: '#f44336'}}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={styles.noRequests}>No pending requests</p>
      )}

      {selectedAthlete && renderAthleteProfile()}
    </div>
  );
};

export default ApplicationManager; 