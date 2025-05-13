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
    navigate('/');
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleOpenMenu}
          sx={{
            p: 0,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#1976D2',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#1565C0'
              }
            }}
          >
            <PersonIcon />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1.5,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2.5
            }
          }
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