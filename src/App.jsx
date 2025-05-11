import React from 'react';
import { Paper, Box, Tabs, Tab } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm'; 
import ChangePasswordForm from './components/auth/ChangePasswordForm';
import HomeScreen from './components/HomeScreen';

function App() {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Router>

      {/* Navbar always visible at the top */}
      <Navbar />

      <Routes>
        {/* Entrance: Display the Login/Register tabs */}
        <Route
          path="/"
          element={
            <div className="page-container">
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    width: '400px',
                    textAlign: 'center',
                  }}
                >
                  <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </Tabs>
                  {tab === 0 && <LoginForm />}
                  {tab === 1 && <RegisterForm setTab={setTab} />}
                  </Paper>
              </Box>
            </div>
          }
        />

        Home screen
        <Route
          path="/home-screen"
          element={
                <HomeScreen />
          }
        />


        {/* FORGOT PASSWORD */}
        <Route 
          path="/forgot-password"
          element={ 
            <div className="page-container">
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }} >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    width: '400px',
                    textAlign: 'center',
                  }}
                >
                  <ForgotPasswordForm />
                </Paper>
              </Box>
            </div>
          }
        />

        {/* RESET PASSWORD */}
        <Route 
          path="/reset-password"
          element={ 
          <div className="page-container">
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }} >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: '400px',
                  textAlign: 'center',
                }}
              >
                <ResetPasswordForm />
              </Paper>
            </Box>
          </div>
          }
        />

        {/* CHANGE PASSWORD */}
        <Route 
          path="/change-password"
          element={ 
          <div className="page-container">
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }} >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: '400px',
                  textAlign: 'center',
                }}
              >
                <ChangePasswordForm />
              </Paper>
            </Box>
          </div>
          }
        />
        

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="page-container">
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }} >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    width: '400px',
                    textAlign: 'center',
                  }}
                >
                  <h2>404 Not Found</h2>
                </Paper>
              </Box>
            </div>
          }
        />
      </Routes>

      {/* Footer always visible at the bottom */}
      <Footer />

    </Router>
  );
}

export default App;
