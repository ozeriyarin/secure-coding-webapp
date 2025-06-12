import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const INPUT_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    '&:hover':   { backgroundColor: 'rgba(255, 255, 255, 0.13)' },
    '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.09)' }
  }
};

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!userId) {
      setMessage('User ID missing — please try again.');
      return;
    }

    try {
      const response = await fetch('/api/passwords/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          new_password: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Password reset failed. Please try again.');
        return;
      }

      setMessage('Password reset successfully!');
      setNewPassword('');
      setConfirmPassword('');
      
      localStorage.setItem('passwordResetCompleted', 'true');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center',
          color: '#1976D2',
          fontSize: { xs: '1.75rem', sm: '2rem' },
          fontWeight: 600,
          mb: 1,
          letterSpacing: '-0.5px'
        }}
      >
        Reset Password
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center',
          color: 'text.secondary',
          mb: 0.5
        }}
      >
        Enter your new password below
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('successful') ? 'success' : 'error'}
          sx={{ 
            width: '100%',
            borderRadius: 1,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {message}
        </Alert>
      )}

      <TextField
        label="New Password"
        type={showNewPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        required
        fullWidth
        sx={INPUT_SX}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowNewPassword}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm New Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
        fullWidth
        sx={INPUT_SX}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.5,
          backgroundColor: '#1976D2',
          borderRadius: 1,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            backgroundColor: '#1565C0',
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)'
          }
        }}
      >
        Reset Password
      </Button>

      <Button
        onClick={() => navigate('/')}
        sx={{
          color: '#1976D2',
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline'
          }
        }}
      >
        Back to Login
      </Button>
    </Box>
  );
}

export default ResetPasswordForm;