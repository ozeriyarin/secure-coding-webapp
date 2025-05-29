import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component
 * This component checks if the user is authenticated before rendering the protected content.
 * If not authenticated, it redirects to the login page.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  if (!userId) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute; 