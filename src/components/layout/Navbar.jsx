import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import UserMenu from './UserMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '/src/assets/images/logo.PNG';

/**
 * @description
 * This component displays the Navbar for the application.
 * @returns Navbar component to display the Navbar for the application.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const userId = location.state?.userId;
  
  // Show UserMenu on all routes except login/register page
  const shouldShowUserMenu = currentPath !== '/';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth={false}>
        <Toolbar 
          sx={{ 
            height: '64px',
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10 }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flexGrow: 1,
              cursor: shouldShowUserMenu ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (shouldShowUserMenu && userId) {
                navigate('/home-screen', { state: { userId } });
              }
            }}
          >
            <SecurityIcon 
              sx={{ 
                fontSize: 32, 
                color: '#1976D2',
                mr: 1
              }} 
            />
            <img
              src={logo}
              alt="Secure Coding Logo"
              style={{ 
                width: '100px',
                height: '50px',
                objectFit: 'contain'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1976D2',
                fontWeight: 600,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Secure Coding App
            </Typography>
          </Box>

          {shouldShowUserMenu && userId && (
            <UserMenu userId={userId} />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
