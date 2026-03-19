import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../lib/api';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
    const { login } = useAdminAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await adminLogin(email, password);
            login(data.token);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adm-login-page">
            <div className="adm-login-card">
                <div className="adm-login-logo">
                    <span className="adm-login-logo-text">captured</span>
                    <span className="adm-login-logo-sub">moments</span>
                </div>

                <h1 className="adm-login-title">Admin Login</h1>
                <p className="adm-login-sub">Sign in to manage your site</p>

                {error && <div className="adm-login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="adm-login-form">
                    <div className="adm-login-field">
                        <label className="adm-login-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            autoFocus
                            className="adm-login-input"
                        />
                    </div>

                    <div className="adm-login-field">
                        <label className="adm-login-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="adm-login-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-accent"
                        style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
