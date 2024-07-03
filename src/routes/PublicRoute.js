import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const role = localStorage.getItem('role');

    if (role) {
        // Redirect based on the role if authenticated
        if (role === 'Admin') {
            return <Navigate to="/admin-management" />;
        } else if (role === 'Staff') {
            return <Navigate to="/staff-management" />;
        } else if (role === 'Mentor') {
            return <Navigate to="/mentor-homepage" />;
        } else if (role === 'Mentee') {
            return <Navigate to="/mentee-homepage" />;
        } else {
            // Default redirect if role is not recognized
            return <Navigate to="/" />;
        }
    }

    return <Outlet />;
};

export default PublicRoute;
