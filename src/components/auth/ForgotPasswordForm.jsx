import React, {useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box , Snackbar , Alert } from '@mui/material';


function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [isSubmitHit, setIsSubmitHit] = useState(false);
  // State to hold an error or status message
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const [timer, setTimer] = useState(0);            // remaining seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const navigate = useNavigate();
  
  const sendCode = async () => {
    try {
      const response = await fetch('/api/verifications/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });
      if (!response.ok){
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to send code.');
        return;
      }
      else {
        setMessage(''); // Clear previous messages if validation passes
        const responseData = await response.json();
        console.log('Password reset successful:', responseData);
        setMessage('Password reset link sent to your email successfully.');
        setUserId(responseData.user_id);
        setOpenSnackbar(true);
        setIsSubmitHit(true);
        setTimer(300);             // 5 minutes = 300s
        setIsResendDisabled(true);
      }
    } catch (err) {
      setMessage(err.message || 'Failed to send code.');
    }
  };
  
  useEffect(() => {
    if (!isSubmitHit || timer === 0) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitHit, timer]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isSubmitHit) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setMessage('Invalid email format.');
        return;
      } else {
        setMessage(''); // Clear previous messages if validation passes
      }  

      await sendCode();
    }
    else {

      const data = {
        code: code,
        user_id: userId,
      };

      try {
        const response = await fetch('/api/verifications/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message || 'Password reset failed. Please try again.');
          return;
        }
        const responseData = await response.json();
        console.log('Password reset successful:', responseData);
        setCode('');
        setOpenSnackbar(true);
        console.log('User ID:', userId);
        navigate('/reset-password', { state: { userId: userId } });
      } catch (error) {
        console.error('Error during password reset:', error);
        setMessage('An error occurred. Please try again later.');
      }
    }

  };

  const handleClose = (event , reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
          Forgot Password
        </Typography>
        <Typography variant="body1" align="center">
          {isSubmitHit ? 'Enter the verification code sent to your email' : 'Enter your email address to receive a password reset link.'}
        </Typography>

        {message && (
          <Alert severity={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </Alert>
        )}
        
        {isSubmitHit? (
          <TextField
          label="Verification Code"
          variant="outlined"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      ) : (
      
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}

        <Button type="submit" variant="contained" color="primary">
          {isSubmitHit ? 'Verify Code' : 'Send Code'}
        </Button>

        {isSubmitHit && (
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2">
              Resend in {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}
            </Typography>
            <Button onClick={sendCode} disabled={isResendDisabled} sx={{ mt: 1 }}>
              Send Again
            </Button>
          </Box>
        )}

        <Button type='button' color='info'>
          <Link to='/'>              
              Back to Login
          </Link>
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Password reset link sent to your email."
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Password reset link sent to your email.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ForgotPasswordForm;
