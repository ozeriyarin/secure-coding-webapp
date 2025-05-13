import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * LoginForm component
 * Shows a login form with generic error handling to avoid disclosing which field failed
 */
function LoginForm() {
  /* ---------- state ---------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();

  /* ---------- constants ---------- */
  const GENERIC_ERROR = 'Invalid username or password. Please try again.';

  /* ---------- helpers ---------- */
  const handleClickShowPassword = () =>
    setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* client-side format check (still uses generic message) */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setStatusMsg(GENERIC_ERROR);
      return;
    }

    const data = {
      username: email.split('@')[0],
      password
    };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        /* always show the same error to prevent user enumeration */
        setStatusMsg(GENERIC_ERROR);
        return;
      }

      const json = await res.json();
      setStatusMsg('Login successful!');
      setEmail('');
      setPassword('');
      navigate('/home-screen', { state: { userId: json.user.user_id } });
    } catch {
      /* network / unexpected error */
      setStatusMsg('Something went wrong. Please try again later.');
    }
  };

  /* ---------- render ---------- */
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          color="primary.main"
        >
          Welcome Back
        </Typography>

        {statusMsg && (
          <Alert
            severity={
              statusMsg.startsWith('Login successful') ? 'success' : 'error'
            }
          >
            {statusMsg}
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
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
        >
          Sign In
        </Button>

        <Box display="flex" justifyContent="center" mt={1}>
          <Link
            href="#"
            onClick={() => navigate('/forgot-password')}
            underline="hover"
            color="text.secondary"
          >
            Forgot Password?
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}

export default LoginForm;