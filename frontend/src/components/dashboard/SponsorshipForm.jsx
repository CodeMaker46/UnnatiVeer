import React, { useState } from 'react';
import axios from '../../utils/axios';

const SponsorshipForm = ({ onClose }) => {
  const [sponsorshipData, setSponsorshipData] = useState({
    title: '',
    description: '',
    amount: '',
    sport: '',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...sponsorshipData,
        amount: Number(sponsorshipData.amount)
      };

      const token = localStorage.getItem('token');
      await axios.post('/api/sponsorships', formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Sponsorship created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create sponsorship. Please try again.';
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorshipData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Create New Sponsorship</h2>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Sponsorship Title</label>
        <input
          type="text"
          name="title"
          value={sponsorshipData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
          placeholder="Enter sponsorship title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Sport Category</label>
        <select
          name="sport"
          value={sponsorshipData.sport}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
        >
          <option value="">Select Sport</option>
          <option value="cricket">Cricket</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="athletics">Athletics</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={sponsorshipData.amount}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          min="0"
          step="1"
          required
          placeholder="Enter sponsorship amount"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
        <textarea
          name="description"
          value={sponsorshipData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 min-h-[100px] resize-vertical"
          required
          placeholder="Enter sponsorship description"
        />
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg mt-6">
        Add Sponsorship
      </button>
    </form>
  );
};

export default SponsorshipForm;