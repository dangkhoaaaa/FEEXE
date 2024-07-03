import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = ({ allowedRoles }) => {
    const role = localStorage.getItem('role');

    if (!role) {
        // If the role is not found in localStorage, redirect to sign-in page
        return <Navigate to="/signin" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect based on the role if not allowed
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

export default RoleRoute;
