import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const Sponsorship = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const response = await axios.get('/api/sponsorships');
        setSponsorships(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch sponsorship requests');
        setLoading(false);
      }
    };

    fetchSponsorships();
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sponsorship Requests</h2>
      
      {sponsorships.length === 0 ? (
        <p className="text-gray-600 text-center">No sponsorship requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorships.map((sponsorship) => (
            <div
              key={sponsorship._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {sponsorship.eventName}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Athlete:</span> {sponsorship.athleteName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Amount Requested:</span> ₹{sponsorship.amountRequested}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {sponsorship.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`font-medium ${sponsorship.status === 'Approved' ? 'text-green-600' : sponsorship.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {sponsorship.status}
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Description:</span> {sponsorship.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sponsorship;