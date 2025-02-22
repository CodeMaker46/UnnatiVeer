import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const validateToken = async (token) => {
    if (!token) return false;
    try {
      const response = await axios.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Token expired or invalid');
      } else {
        console.error('Token validation failed:', error);
      }
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        
        if (token && storedUserType) {
          const isValid = await validateToken(token);
          if (isValid) {
            setIsAuthenticated(true);
            setUserType(storedUserType);
            try {
              const response = await axios.get(`/api/${storedUserType}s/profile`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setUserData(response.data);
            } catch (error) {
              if (error.response?.status === 401) {
                console.error('Session expired');
                logout();
              } else {
                console.error('Failed to fetch user data:', error);
                setUserData(null);
                // Don't logout on non-auth errors to maintain session
              }
            }
          } else {
            logout();
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up interval to periodically validate token
    const validateInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token && isAuthenticated) {
        const isValid = await validateToken(token);
        if (!isValid) {
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(validateInterval);
  }, [isAuthenticated]);

  const login = async (token, newUserType) => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');

      // Check if there's an active session
      if (storedToken && storedUserType) {
        const isValid = await validateToken(storedToken);
        
        if (isValid) {
          // If current session is valid and user types don't match
          if (storedUserType !== newUserType) {
            // Force logout of current session and notify user
            logout();
            throw new Error(`You are currently logged in as ${storedUserType}. Please log out first to continue as ${newUserType}.`);
          } else {
            // Same user type trying to login again
            throw new Error(`You are already logged in as ${storedUserType}.`);
          }
        } else {
          // Invalid token, clear the session
          logout();
        }
      }

      // Validate the new token before setting it
      const isNewTokenValid = await validateToken(token);
      if (!isNewTokenValid) {
        throw new Error('Invalid login token');
      }

      // Set new session
      localStorage.setItem('token', token);
      localStorage.setItem('userType', newUserType);
      setIsAuthenticated(true);
      setUserType(newUserType);

      // Fetch user profile
      const response = await axios.get(`/api/${newUserType}s/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      // Clear any partial session data
      logout();
      throw error; // Re-throw to be handled by the login component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
    navigate('/');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userData, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};