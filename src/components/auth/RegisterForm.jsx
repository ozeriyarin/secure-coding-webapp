import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, InputAdornment, Alert, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function RegisterForm({ setTab }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      } else {
        setMessage(''); // Clear previous messages if validation passes
    }

    // check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        setMessage('Invalid email address.');
        return;
    } else {
        setMessage(''); // Clear previous messages if validation passes
    }

    // check if name is valid
    const namePattern = /^[a-zA-Z]+$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        setMessage('Name can only contain letters.'); 
        return;
    } else {
        setMessage(''); // Clear previous messages if validation passes
    }

    // create the username
    const username = email.split('@')[0];

    const data = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        setMessage('Registration successful!');
        // Clear form or navigate user after success
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // move to login tab
      setTab(0);

      } else {
        const errorResult = await response.json();
        setMessage(errorResult.detail || 'Registration failed.');
        console.error('Error:', errorResult);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
      console.error('Network error:', error);
    }

    console.log('Form submitted:', data);
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
          mb: 0.5,
          letterSpacing: '-0.5px'
        }}
      >
        Create Account
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

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        width: '100%'
      }}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
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
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
      </Box>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        Create Account
      </Button>

     
    </Box>
  );
}

export default RegisterForm;
