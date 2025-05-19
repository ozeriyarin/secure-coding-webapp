import React, { useState, useMemo, useCallback } from 'react';
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

/* ---------- constants ---------- */
const NAME_REGEX = /^[a-zA-Z\u0590-\u05FF]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordChecks = (pwd) => ({
  length: pwd.length >= 10,
  mixCase: /(?=.*[a-z])(?=.*[A-Z])/.test(pwd),
  numbers: /(?=.*\d)/.test(pwd),
  special: /[^A-Za-z0-9]/.test(pwd)
});

/* ---------- reusable UI ---------- */
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

  /* ---------- validation ---------- */
  const validate = useCallback(
    (field, val) => {
      switch (field) {
        case 'firstName':
        case 'lastName':
          return NAME_REGEX.test(val) ? '' : 'letters only';
        case 'email':
          return EMAIL_REGEX.test(val) ? '' : 'invalid email';
        case 'password': {
          const pc = passwordChecks(val);
          return pc.length && pc.mixCase && pc.special && pc.numbers
            ? ''
            : 'Password must be at least 10 characters and include upper & lower-case letters, numbers, and special characters';
        }
        case 'confirmPassword':
          return val === values.password ? '' : 'passwords mismatch';
        default:
          return '';
      }
    },
    [values.password]
  );

  /* ---------- handlers ---------- */
  const handleChange = useCallback(
    (field) => (e) => {
      const val = e.target.value;
      setValues((prev) => ({ ...prev, [field]: val }));
      setErrors((prev) => ({ ...prev, [field]: validate(field, val) }));

      if (field === 'password') {
        // re-validate confirmPassword when password changes
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validate('confirmPassword', values.confirmPassword)
        }));
      }
    },
    [validate, values.confirmPassword]
  );

  const togglePwd = (key) =>
    setShowPwd((prev) => ({ ...prev, [key]: !prev[key] }));

  const isFormValid = () =>
    Object.values(values).every(Boolean) && Object.values(errors).every((e) => !e);

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

  /* ---------- derived data ---------- */
  const pc = useMemo(() => passwordChecks(values.password), [values.password]);

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

        {/* live password criteria */}
        <Box sx={{ pl: 1 }}>
          <Criterion ok={pc.length} label="At least 10 characters" />
          <Criterion ok={pc.mixCase} label="Upper & lower-case letters" />
          <Criterion ok={pc.numbers} label="At least one number" />
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