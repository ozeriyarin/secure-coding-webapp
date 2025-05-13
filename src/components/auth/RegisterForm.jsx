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
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';

/**
 * RegisterForm component
 * Displays a registration form with inline validation and live password-strength feedback
 */
function RegisterForm({ setTab }) {
  /* ---------- state ---------- */
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  const [showPwd, setShowPwd] = useState({ pwd: false, confirm: false });

  /* ---------- regex patterns ---------- */
  const patterns = {
    name: /^[a-zA-Z\u0590-\u05FF]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };

  /* ---------- password helpers ---------- */
  const passwordChecks = (pwd) => ({
    length: pwd.length >= 8,
    mixCase: /(?=.*[a-z])(?=.*[A-Z])/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd)
  });

  /* ---------- field-level validation ---------- */
  const validate = (field, val) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return patterns.name.test(val) ? '' : 'letters only';
      case 'email':
        return patterns.email.test(val) ? '' : 'invalid email';
      case 'password': {
        const pc = passwordChecks(val);
        return pc.length && pc.mixCase && pc.special ? '' : 'weak password';
      }
      case 'confirmPassword':
        return val === values.password ? '' : 'passwords mismatch';
      default:
        return '';
    }
  };

  /* ---------- input change handler ---------- */
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues({ ...values, [field]: val });
    setErrors({ ...errors, [field]: validate(field, val) });
    if (field === 'password') {
      // re-validate confirmPassword when password changes
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validate('confirmPassword', values.confirmPassword)
      }));
    }
  };

  /* ---------- password visibility toggle ---------- */
  const togglePwd = (key) =>
    setShowPwd((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ---------- overall form validity ---------- */
  const isFormValid = () =>
    Object.values(values).every(Boolean) && Object.values(errors).every((e) => !e);

  /* ---------- submit handler ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setStatusMsg('fill all fields correctly');
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

  /* ---------- reusable UI for password criteria ---------- */
  const Criterion = ({ ok, label }) => (
    <Typography
      variant="body2"
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      color={ok ? 'success.main' : 'text.secondary'}
    >
      {ok ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
      {label}
    </Typography>
  );

  /* ---------- live password checks ---------- */
  const pc = passwordChecks(values.password);

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
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={values.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
          />
        </Stack>

        {/* email */}
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />

        {/* password */}
        <TextField
          label="Password"
          type={showPwd.pwd ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          error={!!errors.password}
          helperText={errors.password}
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
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
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

        {/* live password criteria (placed under confirm-password as requested) */}
        <Box sx={{ pl: 1 }}>
          <Criterion ok={pc.length} label="At least 8 characters" />
          <Criterion ok={pc.mixCase} label="Upper & lower-case letters" />
          <Criterion ok={pc.special} label="At least one special character" />
        </Box>

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