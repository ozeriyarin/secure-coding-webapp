import * as React from 'react';
import { AppBar } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

/**
 * @description
 * This component displays the footer of the application.
 * @returns Footer component to display the footer of the application.
 */
export default function Footer() {
  return (
    <AppBar
      position='fixed'
      color='primary'
      sx={{ top: 'auto', bottom: 0 , height: '40px' , backgroundColor: '#04265a' , color: 'white' , userSelect:'none' }}
    >
      <Toolbar>
        <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center'  , marginBottom: '20px' }}>
          © 2025 Secure Coding App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}