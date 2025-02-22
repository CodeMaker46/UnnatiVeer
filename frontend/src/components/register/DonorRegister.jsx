import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const DonorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    donorType: 'individual',
    organization: '',
    contactNumber: '',
    panNumber: '',
    city: '',
    state: '',
    preferredSports: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate contact number
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit contact number');
      return;
    }

    try {
      const requestData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        donorType: formData.donorType,
        organization: formData.organization.trim(),
        contactNumber: formData.contactNumber.trim(),
        panNumber: formData.panNumber.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        preferredSports: formData.preferredSports 
          ? formData.preferredSports.split(',').map(sport => sport.trim())
          : []
      };

      console.log('Sending registration data:', requestData);

      const response = await axios.post('/api/donors/register', requestData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', 'donor');
        localStorage.setItem('userData', JSON.stringify(response.data.donor));
        navigate('/donor/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Log detailed error information
      if (error.response?.data?.details) {
        console.error('Validation errors:', error.response.data.details);
      }
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Donor Registration</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Donor Type</label>
          <select
            name="donorType"
            value={formData.donorType}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Organization (Optional)</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Preferred Sports (comma-separated)</label>
          <input
            type="text"
            name="preferredSports"
            value={formData.preferredSports}
            onChange={handleChange}
            placeholder="e.g., Cricket, Football, Basketball"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    textAlign: 'center'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  }
};

export default DonorRegister; 