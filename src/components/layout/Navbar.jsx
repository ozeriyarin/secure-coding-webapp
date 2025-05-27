import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import logo from '/src/assets/images/logo.PNG';

/**
 * Navbar component
 * – Persists user ID in localStorage so the menu remains visible
 *   even after refresh or browser-back navigation.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------- persistent userId ---------- */
  const [userId, setUserId] = useState(() =>
    location.state?.userId || localStorage.getItem('userId')
  );

  /* store userId that arrives via navigate(..., { state }) */
  useEffect(() => {
    if (location.state?.userId) {
      localStorage.setItem('userId', location.state.userId);
      setUserId(location.state.userId);
    }
  }, [location.state]);

  const currentPath         = location.pathname;
  const shouldShowUserMenu  = currentPath !== '/';

  /* ---------- handlers ---------- */
  const handleLogoClick = () => {
    if (shouldShowUserMenu && userId) {
      navigate('/home-screen', { state: { userId } });
    }
  };

  /* ---------- render ---------- */
  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
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
          {/* logo + title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexGrow: 1,
              cursor: shouldShowUserMenu ? 'pointer' : 'default'
            }}
            onClick={handleLogoClick}
          >
            <SecurityIcon
              sx={{ fontSize: 32, color: 'primary.main', mr: 1 }}
            />
            <img
              src={logo}
              alt="Secure Coding Logo"
              style={{ width: '100px', height: '50px', objectFit: 'contain' }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Secure Coding App
            </Typography>
          </Box>

          {/* user menu */}
          {shouldShowUserMenu && userId && <UserMenu userId={userId} />}
        </Toolbar>
      </Container>
    </AppBar>
  );
}