import React from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm'; 
import ChangePasswordForm from './components/auth/ChangePasswordForm';
import HomeScreen from './components/HomeScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const paperStyles = {
    width: { xs: '95%', sm: 520, md: 600 },
    margin: '40px auto',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'all 0.4s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('userId');
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ pt: '64px', flex: 1, pb: { xs: '40px', sm: '48px' } }}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Paper elevation={0} sx={paperStyles}>
                  <Tabs 
                    value={tab} 
                    onChange={handleChange} 
                    variant="fullWidth"
                    sx={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: '#f8f9fa',
                      '& .MuiTab-root': {
                        py: 3,
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: '#666',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: '#1976d2',
                        },
                        '&.Mui-selected': {
                          color: '#1976d2',
                        },
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        backgroundColor: '#1976d2',
                      },
                    }}
                  >
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </Tabs>
                  <div style={{ padding: '32px' }}>
                    {tab === 0 && <LoginForm />}
                    {tab === 1 && <RegisterForm setTab={setTab} />}
                  </div>
                </Paper>
              }
            />

            {/* Public Auth Routes - Only accessible when not authenticated */}
            <Route
              path="/forgot-password"
              element={
                isAuthenticated() ? (
                  <Navigate to="/home-screen" replace />
                ) : (
                  <Paper elevation={0} sx={{ ...paperStyles, p: 4 }}>
                    <ForgotPasswordForm />
                  </Paper>
                )
              }
            />

            {/* Protected Routes */}
            <Route 
              path="/home-screen" 
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <Paper elevation={0} sx={{ ...paperStyles, p: 4 }}>
                    <ChangePasswordForm />
                  </Paper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute>
                  <Paper elevation={0} sx={{ ...paperStyles, p: 4 }}>
                    <ResetPasswordForm />
                  </Paper>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Paper 
                  elevation={0}
                  sx={{ 
                    ...paperStyles,
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <h2 style={{
                    color: '#1976d2',
                    fontSize: '2.5rem',
                    margin: 0,
                    fontWeight: 500
                  }}>
                    404 Not Found
                  </h2>
                </Paper>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;