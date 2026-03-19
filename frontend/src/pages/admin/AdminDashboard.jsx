import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminListAlbums, adminListQuotes, adminListContacts } from '../../lib/api';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { token } = useAdminAuth();
    const [albums, setAlbums] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            adminListAlbums(token),
            adminListQuotes(token),
            adminListContacts(token),
        ])
            .then(([a, q, c]) => { setAlbums(a); setQuotes(q); setContacts(c); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    const published = albums.filter(a => a.is_published).length;
    const drafts = albums.length - published;
    const unreadQuotes = quotes.filter(q => !q.is_read).length;
    const unreadContacts = contacts.filter(c => !c.is_read).length;
    const recent = [...albums].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

    return (
        <div className="adm-dashboard">
            <div className="adm-page-header">
                <h1 className="adm-page-title">Dashboard</h1>
            </div>

            <p className="adm-dash-welcome">Welcome back. Here's a quick overview of your site.</p>

            {/* Stats cards */}
            <div className="adm-stats-row">
                <div className="adm-stat-card">
                    <span className="adm-stat-value">{loading ? '—' : albums.length}</span>
                    <span className="adm-stat-label">Total Albums</span>
                </div>
                <div className="adm-stat-card adm-stat-card--green">
                    <span className="adm-stat-value">{loading ? '—' : published}</span>
                    <span className="adm-stat-label">Published</span>
                </div>
                <div className="adm-stat-card adm-stat-card--muted">
                    <span className="adm-stat-value">{loading ? '—' : drafts}</span>
                    <span className="adm-stat-label">Drafts</span>
                </div>
                <Link to="/admin/quotes" className={`adm-stat-card adm-stat-card--link${unreadQuotes > 0 ? ' adm-stat-card--accent' : ''}`}>
                    <span className="adm-stat-value">{loading ? '—' : unreadQuotes}</span>
                    <span className="adm-stat-label">Unread Quotes</span>
                </Link>
                <Link to="/admin/contacts" className={`adm-stat-card adm-stat-card--link${unreadContacts > 0 ? ' adm-stat-card--accent' : ''}`}>
                    <span className="adm-stat-value">{loading ? '—' : unreadContacts}</span>
                    <span className="adm-stat-label">Unread Contacts</span>
                </Link>
            </div>

            {/* Quick actions */}
            <div className="adm-quick-actions">
                <h2 className="adm-section-title">Quick Actions</h2>
                <div className="adm-action-row">
                    <Link to="/admin/albums" className="adm-btn adm-btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        Manage Albums
                    </Link>
                    <Link to="/admin/albums/new" className="adm-btn adm-btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add New Album
                    </Link>
                    <Link to="/admin/quotes" className="adm-btn adm-btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        View Quotes
                    </Link>
                    <Link to="/admin/contacts" className="adm-btn adm-btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        View Contacts
                    </Link>
                </div>
            </div>

            {/* Recent albums */}
            <div className="adm-recent">
                <h2 className="adm-section-title">Recent Albums</h2>
                {loading ? (
                    <p className="adm-loading-text">Loading...</p>
                ) : recent.length === 0 ? (
                    <div className="adm-card adm-empty-state">
                        <p>No albums yet.</p>
                        <Link to="/admin/albums/new" className="adm-btn adm-btn-primary" style={{ marginTop: '12px' }}>Create your first album</Link>
                    </div>
                ) : (
                    <div className="adm-recent-list">
                        {recent.map(album => (
                            <Link to={`/admin/albums/${album.id}`} key={album.id} className="adm-recent-item">
                                <div className="adm-recent-thumb">
                                    <img src={album.cover_image_url} alt={album.title} onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                                <div className="adm-recent-info">
                                    <span className="adm-recent-title">{album.title}</span>
                                    <span className="adm-recent-cat">{album.category}</span>
                                </div>
                                <span className={`adm-badge ${album.is_published ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                    {album.is_published ? 'Published' : 'Draft'}
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#444', flexShrink: 0 }}>
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
