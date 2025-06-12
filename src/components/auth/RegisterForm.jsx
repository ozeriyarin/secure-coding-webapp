import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function RegisterForm({ setTab }) {
  /* ---------- state ---------- */
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [statusMsg, setStatusMsg] = useState('');
  const [showPwd, setShowPwd] = useState({ pwd: false, confirm: false });

  /* ---------- handlers ---------- */
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));
  };

  const togglePwd = (key) =>
    setShowPwd((prev) => ({ ...prev, [key]: !prev[key] }));

  const isFormValid = () =>
    Object.values(values).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setStatusMsg('fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          username: values.email.split('@')[0],
          email: values.email,
          password: values.password
        })
      });

      if (res.ok) {
        setStatusMsg('registration successful');
        setValues({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTab?.(0); // move to login tab
      } else {
        const err = await res.json();
        setStatusMsg(err.detail || 'registration failed');
      }
    } catch {
      setStatusMsg('network error');
    }
  };

  /* ---------- render ---------- */
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography variant="h4" textAlign="center" fontWeight={600} color="primary.main">
          Create Account
        </Typography>

        {statusMsg && (
          <Alert severity={statusMsg.includes('successful') ? 'success' : 'error'}>
            {statusMsg}
          </Alert>
        )}

        {/* first / last name */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="First Name"
            value={values.firstName}
            onChange={handleChange('firstName')}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={values.lastName}
            onChange={handleChange('lastName')}
            fullWidth
          />
        </Stack>

        {/* email */}
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          fullWidth
        />

        {/* password */}
        <TextField
          label="Password"
          type={showPwd.pwd ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePwd('pwd')} edge="end">
                  {showPwd.pwd ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* confirm password */}
        <TextField
          label="Confirm Password"
          type={showPwd.confirm ? 'text' : 'password'}
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePwd('confirm')} edge="end">
                  {showPwd.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* submit */}
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid()}
          sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
          fullWidth
        >
          Create Account
        </Button>
      </Stack>
    </Box>
  );
}

export default RegisterForm;