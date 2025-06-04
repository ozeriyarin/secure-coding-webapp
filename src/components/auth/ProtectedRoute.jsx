import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component
 * This component checks if the user is authenticated before rendering the protected content.
 * If not authenticated, it redirects to the login page.
 * Exception: reset-password route is allowed without authentication only if user has verified their email
 * If user is authenticated and tries to access reset-password, redirect to home
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const lastActivity = localStorage.getItem('lastActivity');
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const isResetPasswordRoute = location.pathname === '/reset-password';
  const hasVerifiedEmail = location.state?.userId && !userId; // Check if user has verified email but isn't logged in
  const hasCompletedPasswordReset = localStorage.getItem('passwordResetCompleted');

  useEffect(() => {
    // Check session expiration on mount and every minute
    const checkSession = () => {
      if (userId && lastActivity) {
        if (Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT) {
          // Clear session data
          localStorage.removeItem('userId');
          localStorage.removeItem('lastActivity');
          localStorage.removeItem('passwordResetCompleted');
          window.location.href = '/';
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId, lastActivity]);

  // Update last activity on route change
  useEffect(() => {
    if (userId) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [location.pathname, userId]);

  // If user is authenticated and tries to access reset-password, redirect to home
  if (userId && isResetPasswordRoute) {
    return <Navigate to="/home-screen" replace />;
  }

  // If user is not authenticated and tries to access reset-password without email verification
  if (isResetPasswordRoute && !hasVerifiedEmail) {
    return <Navigate to="/forgot-password" replace />;
  }

  // If user is not authenticated and tries to access protected route (except reset-password)
  if (!userId && !isResetPasswordRoute) {
    // Clear any password reset flags
    localStorage.removeItem('passwordResetCompleted');
    // Redirect to login page but save the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user has verified email but hasn't completed password reset, only allow access to reset-password
  if (hasVerifiedEmail && !hasCompletedPasswordReset && !isResetPasswordRoute) {
    // Clear any password reset flags
    localStorage.removeItem('passwordResetCompleted');
    return <Navigate to="/reset-password" state={{ userId: location.state?.userId }} replace />;
  }

  // If we get here, the user is authenticated and can access the protected route
  // Clear any password reset flags as they're no longer needed
  localStorage.removeItem('passwordResetCompleted');
  return children;
}

export default ProtectedRoute; 