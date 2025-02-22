import React, { useState } from 'react';
import axios from '../../utils/axios';

const EventForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    sport: '',
    level: '',
    ageGroup: {
      min: '',
      max: ''
    },
    date: '',
    endDate: '',
    location: {
      venue: '',
      city: '',
      state: '',
      country: ''
    },
    travelAllowance: {
      provided: false,
      amount: {
        min: '',
        max: ''
      },
      details: ''
    },
    eventBanner: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'location') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            [child]: value
          }
        }));
      } else if (parent === 'travelAllowance') {
        const finalValue = child === 'amount' ? value.replace(/[^0-9]/g, '') : value;
        setFormData(prev => ({
          ...prev,
          travelAllowance: {
            ...prev.travelAllowance,
            [child]: finalValue
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data before sending
      const formattedData = {
        ...formData,
        location: {
          ...formData.location,
          country: formData.location.country || 'India'
        },
        travelAllowance: {
          ...formData.travelAllowance,
          amount: Number(formData.travelAllowance.amount) || 0
        }
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/organizations/events', formattedData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        alert('Event created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          eventType: '',
          sport: '',
          level: '',
          ageGroup: {
            min: '',
            max: ''
          },
          date: '',
          endDate: '',
          location: {
            venue: '',
            city: '',
            state: '',
            country: ''
          },
          travelAllowance: {
            provided: false,
            amount: {
              min: '',
              max: ''
            },
            details: ''
          },
          eventBanner: ''
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
      
      {/* Basic Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 min-h-[100px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Type
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
              required
            >
              <option value="">Select Type</option>
              <option value="tournament">Tournament</option>
              <option value="training">Training Camp</option>
              <option value="competition">Competition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Sport
            </label>
            <select
              name="sport"
              value={formData.sport}
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
              required
            >
              <option value="">Select Level</option>
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="location.venue"
                value={formData.location.venue}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              State
            </label>
            <select
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
              required
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>

        {/* Travel Allowance */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="travelAllowance.provided"
              checked={formData.travelAllowance.provided}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Provide Travel Allowance
            </label>
          </div>

          {formData.travelAllowance.provided && (
            <div className="pl-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    name="travelAllowance.amount.min"
                    value={formData.travelAllowance.amount.min}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    name="travelAllowance.amount.max"
                    value={formData.travelAllowance.amount.max}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Travel Allowance Details
                </label>
                <textarea
                  name="travelAllowance.details"
                  value={formData.travelAllowance.details}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  placeholder="Specify travel allowance terms and conditions"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;