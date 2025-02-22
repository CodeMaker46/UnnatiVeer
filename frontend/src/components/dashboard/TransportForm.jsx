import React, { useState } from 'react';
import axios from '../../utils/axios';

const TransportForm = ({ onClose }) => {
  const [transportData, setTransportData] = useState({
    title: '',
    details: '',
    amount: {
      min: '',
      max: ''
    },
    coverageType: 'full',
    validTill: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/travel-supports', transportData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Transport support created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating transport support:', error);
      alert(error.response?.data?.message || 'Failed to create transport support');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const finalValue = parent === 'amount' ? Number(value) || '' : value;
      setTransportData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: finalValue
        }
      }));
    } else {
      setTransportData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Create Transport Support</h2>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Support Title</label>
        <input
          type="text"
          name="title"
          value={transportData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Details</label>
        <textarea
          name="details"
          value={transportData.details}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
          rows="4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">Minimum Amount (₹)</label>
          <input
            type="number"
            name="amount.min"
            value={transportData.amount.min}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
            min="0"
            step="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">Maximum Amount (₹)</label>
          <input
            type="number"
            name="amount.max"
            value={transportData.amount.max}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
            min="0"
            step="1"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Coverage Type</label>
        <select
          name="coverageType"
          value={transportData.coverageType}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
        >
          <option value="full">Full</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Valid Till</label>
        <input
          type="date"
          name="validTill"
          value={transportData.validTill}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
      >
        Create Transport Support
      </button>
    </form>
  );
};

export default TransportForm;