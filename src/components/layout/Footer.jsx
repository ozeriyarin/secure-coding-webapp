import React from 'react';
import { Box, Container, Typography, IconButton, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

/**
 * @description
 * This component displays the footer of the application.
 * @returns Footer component to display the footer of the application.
 */
export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.05)',
        zIndex: 1300,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <Container 
        maxWidth={false}
        sx={{
          height: { xs: '40px', sm: '48px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 10 }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            opacity: 0.7,
            fontSize: '0.875rem'
          }}
        >
          © {new Date().getFullYear()} Secure Coding App
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ 
              color: 'text.secondary',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                color: '#1976D2'
              }
            }}
          >
            <GitHubIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ 
              color: 'text.secondary',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                color: '#1976D2'
              }
            }}
          >
            <LinkedInIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}