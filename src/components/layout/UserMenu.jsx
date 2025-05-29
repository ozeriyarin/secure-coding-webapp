import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function UserMenu({ userId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    handleCloseMenu();
    navigate('/change-password', { state: { userId } });
  };

  const handleLogout = () => {
    handleCloseMenu();
    // Clear authentication data
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976D2' }}>
            <PersonIcon />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <LockIcon fontSize="small" sx={{ color: '#1976D2' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Change Password"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          />
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#d32f2f'
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
} 