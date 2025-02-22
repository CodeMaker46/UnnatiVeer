import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    eventType: '',
    description: '',
    date: '',
    endDate: '',
    location: {
      venue: '',
      city: '',
      state: ''
    },
    sport: '',
    level: 'district',
    travelAllowance: {
      amount: '',
      type: 'fixed'
    }
  });

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    formGroup: {
      marginBottom: '20px',
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      minHeight: '100px'
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    section: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#2d3748',
      borderBottom: '2px solid #edf2f7',
      paddingBottom: '10px'
    },
    formRow: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    }
  };

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
      const token = localStorage.getItem('token');
      await axios.post('/api/organizations/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Event created successfully!');
      // Reset form or redirect
      setFormData({
        title: '',
        eventType: '',
        description: '',
        date: '',
        endDate: '',
        location: {
          venue: '',
          city: '',
          state: ''
        },
        sport: '',
        level: 'district',
        travelAllowance: {
          amount: '',
          type: 'fixed'
        }
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Details Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Basic Details</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Event Type</option>
              <option value="tournament">Tournament</option>
              <option value="championship">Championship</option>
              <option value="training">Training Camp</option>
              <option value="competition">Competition</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sport</label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Sport</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="athletics">Athletics</option>
              <option value="swimming">Swimming</option>
              <option value="tennis">Tennis</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>
        </div>

        {/* Date and Venue Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Date and Venue</h3>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Venue</label>
            <input
              type="text"
              name="location.venue"
              value={formData.location.venue || ''}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Enter venue name"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
        </div>

        {/* Travel Allowance Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Travel Allowance</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              type="text"
              name="travelAllowance.amount"
              value={formData.travelAllowance.amount}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter amount in rupees"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent; 