import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await axios.get('/api/athletes');
        setAthletes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch athletes');
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Athletes</h2>
      
      {athletes.length === 0 ? (
        <p className="text-gray-300 text-center">No athletes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {athletes.map((athlete) => (
            <div
              key={athlete._id}
              className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {athlete.fullName}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-medium text-blue-400">Sport:</span> {athlete.sportsCategory}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-blue-400">Level:</span> {athlete.currentLevel}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-blue-400">Location:</span> {athlete.city}, {athlete.state}
                  </p>
                </div>
                {athlete.achievements && (
                  <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-300">
                      <span className="font-medium text-blue-400">Achievements:</span> {athlete.achievements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Athletes;