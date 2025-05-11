import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box , IconButton, InputAdornment , Alert} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


function RegisterForm({ setTab }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State to hold an error or status message
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="h4" align="center">Register</Typography>

        {message && (
          <Alert severity={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </Alert>
        )}

        
        <TextField
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          slotProps={{
            input: {
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
            },
          }}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          slotProps={{
            input: {
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
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterForm;
