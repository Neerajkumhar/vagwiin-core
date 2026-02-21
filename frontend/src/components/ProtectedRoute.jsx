import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = authService.getCurrentUser();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but doesn't have the required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
