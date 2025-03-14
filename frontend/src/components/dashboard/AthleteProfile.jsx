import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const AthleteProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [media, setMedia] = useState({
    photos: [],
    videos: []
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    sportsCategory: '',
    currentLevel: '',
    achievements: '',
    city: '',
    state: '',
    bio: '',
    contactNumber: '',
    guardianName: '',
    school: '',
    coach: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({
    photos: [],
    videos: []
  });

  

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/athletes/profile');
      setProfile(response.data);
      setFormData(response.data);
      setMedia({
        photos: response.data.photos || [],
        videos: response.data.videos || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

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
      await axios.put('/api/athletes/profile', formData);
      setEditing(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const newPhotos = [];
    const newVideos = [];

    files.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        newPhotos.push({ file, preview: fileURL });
      } else if (file.type.startsWith('video/')) {
        newVideos.push({ file, preview: fileURL });
      }
    });

    setSelectedFiles(prev => ({
      photos: [...prev.photos, ...newPhotos],
      videos: [...prev.videos, ...newVideos]
    }));
  };

  const removeSelectedFile = (type, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleUpload = async () => {
    if (selectedFiles.photos.length === 0 && selectedFiles.videos.length === 0) {
      return;
    }

    setUploadingMedia(true);
    const formData = new FormData();

    selectedFiles.photos.forEach(photo => {
      formData.append('media', photo.file);
    });

    selectedFiles.videos.forEach(video => {
      formData.append('media', video.file);
    });

    try {
      const response = await axios.post('/api/athletes/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMedia(response.data);
      setSelectedFiles({ photos: [], videos: [] });
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };
 const handleDeleteMedia = async (mediaId, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(`/api/athletes/media/${mediaId}/${type}`);
        setMedia(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item._id !== mediaId)
        }));
        alert('Media deleted successfully!');
      } catch (error) {
        console.error('Error deleting media:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete media. Please try again.';
        alert(errorMessage);
      }
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <button 
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 ${
              editing ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="bg-[#0F0F2D]/95 backdrop-blur-lg rounded-xl p-6 space-y-6 border border-white/10 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sports Category</label>
                <select
                  name="sportsCategory"
                  value={formData.sportsCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Sport</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="athletics">Athletics</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Level</label>
                <input
                  type="text"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#0F0F2D]/95 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Personal Information</h3>
                <div className="space-y-3">
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Full Name:</span> {profile.fullName}</p>
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Age:</span> {profile.age}</p>
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Sport:</span> {profile.sportsCategory}</p>
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Level:</span> {profile.currentLevel}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Contact Information</h3>
                <div className="space-y-3">
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Location:</span> {profile.city}, {profile.state}</p>
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Contact:</span> {profile.contactNumber}</p>
                  <p className="text-gray-300"><span className="font-medium text-blue-400">Guardian:</span> {profile.guardianName}</p>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Bio</h3>
                <p className="text-gray-300">{profile.bio}</p>
              </div>
            )}

            {profile.achievements && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Achievements</h3>
                <p className="text-gray-300">{profile.achievements}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Media Gallery</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {media.photos.map((photo, index) => (
              <div key={`photo-${index}`} className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={photo.url} alt="" className="w-full h-48 object-cover" />
                <button
                  onClick={() => handleDeleteMedia(photo._id, 'photos')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            
            {media.videos.map((video, index) => (
              <div key={`video-${index}`} className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <video src={video.url} controls className="w-full h-48 object-cover" />
                <button
                  onClick={() => handleDeleteMedia(video._id, 'videos')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-lg"
            >
              Upload Media
            </label>

            {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
              <div className="mt-4">
                <button
                  onClick={handleUpload}
                  disabled={uploadingMedia}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {uploadingMedia ? 'Uploading...' : 'Upload Selected Files'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AthleteProfile;