import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import OrganizationRegister from './components/registration/OrganizationRegister';
import AthleteRegister from './components/registration/AthleteRegister';
import DonorRegister from './components/registration/DonorRegister';

// Import dashboard components
import OrganizationDashboard from './components/dashboard/OrganizationDashboard';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import Athletes from './components/Athletes';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ element, userType: requiredType }) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredType && userType !== requiredType) {
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }
  
  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <div className="main-content">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Login Routes */}
              <Route path="/login/organization" element={<Login userType="Organization" />} />
              <Route path="/login/athlete" element={<Login userType="Athlete" />} />
              <Route path="/login/donor" element={<Login userType="Donor" />} />
              
              {/* Registration Routes */}
              <Route path="/register/organization" element={<OrganizationRegister />} />
              <Route path="/register/athlete" element={<AthleteRegister />} />
              <Route path="/register/donor" element={<DonorRegister />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/organization/dashboard" element={<ProtectedRoute element={<OrganizationDashboard />} userType="organization" />} />
              <Route path="/athlete/dashboard" element={<ProtectedRoute element={<AthleteDashboard />} userType="athlete" />} />
              <Route path="/donor/dashboard" element={<ProtectedRoute element={<DonorDashboard />} userType="donor" />} />

              {/* Athletes List Route */}
              <Route path="/athletes" element={<Athletes />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;