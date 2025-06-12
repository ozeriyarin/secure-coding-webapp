import { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, InputAdornment, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [message, setMessage] = useState('');
  
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((show) => !show);
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

  const handlePasswordChange = (field) => (e) => {
    const val = e.target.value;
    if (field === 'newPassword') {
      setNewPassword(val);
    } else if (field === 'confirmNewPassword') {
      setConfirmNewPassword(val);
    } else {
      setOldPassword(val);
    }
  };

  const isFormValid = () =>
    oldPassword &&
    newPassword &&
    confirmNewPassword &&
    newPassword === confirmNewPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMessage('Please fill all fields correctly.');
      return;
    }

    if (oldPassword === newPassword) {
      setMessage('New password cannot be the same as the old password.');
      return;
    }

    setMessage('');

    const data = {
      user_id: userId,
      password: oldPassword,
      new_password: newPassword
    };

    try {
      const response = await fetch('/api/passwords/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 500) {
          setMessage(errorData.message || 'Password change failed. Please try again.');
        } else if (response.status === 400) {
          setMessage('Password used before. Please choose a different password.');
        }
        return;
      }
      setMessage('Password changed successfully!');
      setNewPassword('');
      setConfirmNewPassword('');
      setOldPassword('');
      navigate('/');
    }
    catch (error) {
      console.error('Error during password change:', error);
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
        Change Password
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center',
          color: 'text.secondary',
          mb: 0.5
        }}
      >
        Enter your old and new password below
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
        label="Old Password"
        type={showOldPassword ? 'text' : 'password'}
        value={oldPassword}
        onChange={handlePasswordChange('oldPassword')}
        autoComplete="current-password"
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.13)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.09)'
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowOldPassword}
                edge="end"
              >
                {showOldPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="New Password"
        type={showNewPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={handlePasswordChange('newPassword')}
        autoComplete="new-password"
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.13)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.09)'
            }
          }
        }}
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
        type={showConfirmNewPassword ? 'text' : 'password'}
        value={confirmNewPassword}
        onChange={handlePasswordChange('confirmNewPassword')}
        autoComplete="new-password"
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.13)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.09)'
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmNewPassword}
                edge="end"
              >
                {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!isFormValid()}
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
        Change Password
      </Button>
    </Box>
  );
}

export default ChangePasswordForm;
