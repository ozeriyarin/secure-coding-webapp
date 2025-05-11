import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, InputAdornment , Alert } from '@mui/material';
import { useLocation,useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';


function ChangePasswordForm() {
  

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword , setsShowConfirmNewPassword] = useState(false);
  const [showOldPassword , setShowOldPassword] = useState(false);

  const location = useLocation();
  const { userId } = location.state || {};

  const [message, setMessage] = useState('');

  const navigate = useNavigate();


  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmNewPassword = () => setsShowConfirmNewPassword((show) => !show);
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      setMessage('Both fields are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('New Password and Confirm New Password do not match.');
      return;
    }

    // If all validations pass, clear any previous messages
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
        setMessage(errorData.message || 'Password change failed. Please try again.');
        console.log(data);
        return;
      }
      const responseData = await response.json();
      console.log('Password changed successfully:', responseData);
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Change Password
        </Typography>
        <Typography variant="body1" align="center">
          Enter your old and new password below.
        </Typography>

        {message && (
          <Alert severity={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </Alert>
        )}

        <TextField
            label="Old Password"
            variant="outlined"
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete='current-password'
            required
            slotProps={{
                input: {
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
                },
            }}
        />
        <TextField
          label="New Password"
          variant="outlined"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete='new-password'
          required
          slotProps={{
            input: {
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
            },
          }}
        />
        <TextField
          label="Confirm New Password"
          variant="outlined"
          type= {showConfirmNewPassword ? 'text' : 'password'}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          autoComplete='new-password'
          required
          slotProps={{
            input: {
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
            },
          }}
        />

        <Button type="submit" variant="contained" color="primary">
          Change Password
        </Button>

        <Button variant="outlined" color="secondary" onClick={() => navigate('/home-screen')}>
          Back Home
        </Button>
      </Box>
    </Container>
  );
}

export default ChangePasswordForm;
