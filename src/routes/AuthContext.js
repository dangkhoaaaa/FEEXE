// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        if (cookies.token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [cookies.token]);

    const login = (token) => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
