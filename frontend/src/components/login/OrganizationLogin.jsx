import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'organization');
        navigate('/dashboard/organization');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      {/* Render your login form here */}
    </div>
  );
};

export default OrganizationLogin; 