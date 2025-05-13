import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Invalid email format.');
      return;
    } else {
      setMessage(''); // Clear previous messages if validation passes
    }  
    
    const username = email.split('@')[0];
    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Your credentials are incorrect. Please try again.');
        return;
      }
      const responseData = await response.json();
      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      navigate('/home-screen' , { state: { userId: responseData.user.user_id } }); // Redirect to home screen with userId
    } catch (error) {
      console.error('Error during login:', error);
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
        gap: 2,
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
        Welcome Back
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
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
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
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
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
        Sign In
      </Button>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        mt: 1 
      }}>
        <Link 
          href="#" 
          onClick={() => navigate('/forgot-password')}
          sx={{ 
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Forgot Password?
        </Link>
      </Box>
    </Box>
  );
}

export default LoginForm;
