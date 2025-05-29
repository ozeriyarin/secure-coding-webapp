import React, { useState, useCallback } from 'react';
import {
  usePasswordPolicy,
  validatePassword,
  PasswordCriteria
} from '../../utils/passwordPolicy';
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
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel
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

/* ---------- component ---------- */
function ChangePasswordForm() {
  /* ---------- state ---------- */
  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors]   = useState({});
  const [statusMsg, setStatusMsg] = useState('');

  const { state } = useLocation();
  const { userId } = state || {};
  const navigate  = useNavigate();

  /* ---------- derived ---------- */
  const policy        = usePasswordPolicy();
  const { ok: pwdOK } = validatePassword(values.newPassword, policy);

  const isFormValid = useMemo(
    () =>
      values.oldPassword &&
      values.newPassword &&
      values.confirmPassword &&
      Object.values(errors).every((e) => !e) &&
      pwdOK,
    [values, errors, pc]
  );

  /* ---------- helpers ---------- */
  const toggleVis = useCallback(
    (key) => () => setShowPwd((prev) => ({ ...prev, [key]: !prev[key] })),
    []
  );

  const validate = useCallback(
    (field, val) => {
      switch (field) {
        case 'oldPassword':
          return val.trim() ? '' : 'required';
        case 'newPassword':
          return pc.length && pc.mixCase && pc.numbers && pc.special
            ? ''
            : 'Password must meet all criteria below';
        case 'confirmPassword':
          return val === values.newPassword ? '' : 'passwords mismatch';
        default:
          return '';
      }
    },
    [pc, values.newPassword]
  );

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));

    setErrors((prev) => ({
      ...prev,
      [field]: validate(field, val),
      ...(field === 'newPassword' && {
        confirmPassword: validate('confirmPassword', values.confirmPassword)
      })
    }));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setStatusMsg('Please fix the errors before submitting.');
      return;
    }
    if (!userId) {
      setStatusMsg('User ID missing — please log in again.');
      return;
    }

    try {
      const res = await fetch('/api/passwords/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          password: values.oldPassword,
          new_password: values.newPassword
        })
      });

      if (!res.ok) {
        const err = await res.json();
        setStatusMsg(err.message || 'Password change failed.');
        return;
      }

      setStatusMsg('Password changed successfully!');
      setValues({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      navigate('/');
    } catch {
      setStatusMsg('Network error. Try again later.');
    }
  };

  /* ---------- render ---------- */
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography variant="h4" textAlign="center" fontWeight={600} color="primary.main">
          Change Password
        </Typography>

        <Typography variant="body1" textAlign="center" color="text.secondary">
          Enter your old and new password below
        </Typography>

        {statusMsg && (
          <Alert
            severity={statusMsg.includes('successfully') ? 'success' : 'error'}
            sx={{ borderRadius: 1 }}
          >
            {statusMsg}
          </Alert>
        )}

        {/* old password */}
        <TextField
          label="Old Password"
          type={showPwd.old ? 'text' : 'password'}
          value={values.oldPassword}
          onChange={handleChange('oldPassword')}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          autoComplete="current-password"
          required
          fullWidth
          sx={INPUT_SX}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleVis('old')} edge="end">
                  {showPwd.old ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* new password */}
        <TextField
          label="New Password"
          type={showPwd.new ? 'text' : 'password'}
          value={values.newPassword}
          onChange={handleChange('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          autoComplete="new-password"
          required
          fullWidth
          sx={INPUT_SX}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleVis('new')} edge="end">
                  {showPwd.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* confirm password */}
        <TextField
          label="Confirm New Password"
          type={showPwd.confirm ? 'text' : 'password'}
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          autoComplete="new-password"
          required
          fullWidth
          sx={INPUT_SX}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleVis('confirm')} edge="end">
                  {showPwd.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* live criteria */}
        <PasswordCriteria pwd={values.newPassword} policy={policy} />

        {/* submit */}
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid}
          sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
          fullWidth
        >
          Change Password
        </Button>

        <Button
          onClick={() => navigate('/home-screen')}
          sx={{
            color: 'primary.main',
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
          }}
        >
          Back to Home
        </Button>
      </Stack>
    </Box>
  );
}

export default ChangePasswordForm;