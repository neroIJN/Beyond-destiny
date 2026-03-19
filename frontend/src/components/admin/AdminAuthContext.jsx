import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
    const navigate = useNavigate();

    const login = useCallback((newToken) => {
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        setToken('');
        navigate('/admin/login');
    }, [navigate]);

    return (
        <AdminAuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
    return ctx;
}
