import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '/src/assets/images/logo.PNG';

/**
 * @description
 * This component displays the Navbar for the application.
 * @returns Navbar component to display the Navbar for the application.
 */
export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ top: 0, backgroundColor: '#04265a', color: 'white', userSelect: 'none' }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src={logo}
            alt="Secure Coding Logo"
            style={{ width: '100px', height: '50px', marginRight: '16px' }}
          />
          <Typography variant="h6" component="div" fontFamily="GaretBook">
            Secure Coding App
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
