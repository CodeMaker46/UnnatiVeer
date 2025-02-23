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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
       
        <button 
          className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 ${
            editing 
              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
              : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
          }`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6 border border-white/10">
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
              <select
                name="currentLevel"
                value={formData.currentLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="school">School</option>
                <option value="district">District</option>
                <option value="state">State</option>
                <option value="national">National</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 resize-y"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 resize-y"
                placeholder="List your achievements..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6 border border-white/10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {profile.fullName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-300"><span className="font-medium text-blue-400">Age:</span> {profile.age}</p>
                <p className="text-gray-300"><span className="font-medium text-blue-400">Sport:</span> {profile.sportsCategory}</p>
                <p className="text-gray-300"><span className="font-medium text-blue-400">Level:</span> {profile.currentLevel}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300"><span className="font-medium text-blue-400">Location:</span> {profile.city}, {profile.state}</p>
                <p className="text-gray-300"><span className="font-medium text-blue-400">Contact:</span> {profile.contactNumber}</p>
                <p className="text-gray-300"><span className="font-medium text-blue-400">Guardian:</span> {profile.guardianName}</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Bio</h3>
              <p className="text-gray-300">{profile.bio}</p>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Achievements</h3>
              <p className="text-gray-300">{profile.achievements}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">Photos & Videos</h2>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="mediaInput"
          />
          <label 
            htmlFor="mediaInput" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
          >
            Select Files
          </label>
          
          {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
            <button 
              onClick={handleUpload}
              className={`mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={uploadingMedia}
            >
              {uploadingMedia ? 'Uploading...' : 'Upload Selected Files'}
            </button>
          )}
        </div>

        {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {selectedFiles.photos.map((photo, index) => (
              <div key={`photo-preview-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSelectedFile('photos', index)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/75 hover:bg-red-500 text-white rounded-full transition-all duration-300"
                >
                  ×
                </button>
              </div>
            ))}
            
            {selectedFiles.videos.map((video, index) => (
              <div key={`video-preview-${index}`} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                <video src={video.preview} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSelectedFile('videos', index)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/75 hover:bg-red-500 text-white rounded-full transition-all duration-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {media.photos.map((photo, index) => (
            <div key={`photo-${index}`} className="aspect-square rounded-lg overflow-hidden bg-white/5">
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          
          {media.videos.map((video, index) => (
            <div key={`video-${index}`} className="aspect-square rounded-lg overflow-hidden bg-white/5">
              <video 
                src={video.url} 
                controls 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;