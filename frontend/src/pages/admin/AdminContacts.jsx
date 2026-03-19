import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { adminListContacts, adminMarkContactRead, adminDeleteContact } from '../../lib/api';
import './AdminQuotes.css'; // reuse same stylesheet — shared classes

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminContacts() {
    const { token } = useAdminAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        adminListContacts(token)
            .then(setContacts)
            .catch(() => setError('Failed to load contact submissions.'))
            .finally(() => setLoading(false));
    }, [token]);

    function toggleExpand(id) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    async function handleMarkRead(contact) {
        setTogglingId(contact.id);
        try {
            await adminMarkContactRead(token, contact.id, !contact.is_read);
            setContacts(prev =>
                prev.map(c => c.id === contact.id ? { ...c, is_read: !c.is_read } : c)
            );
        } catch {
            // silently ignore
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDeleteContact(contact) {
        console.log('Delete button clicked for contact:', contact.id);
        if (!window.confirm(`Delete contact submission from ${contact.name}?`)) return;

        setTogglingId(contact.id);
        try {
            await adminDeleteContact(token, contact.id);
            setContacts(prev => prev.filter(c => c.id !== contact.id));
        } catch (err) {
            alert('Failed to delete contact submission.');
        } finally {
            setTogglingId(null);
        }
    }

    const filteredContacts = contacts.filter(c => {
        const query = searchQuery.toLowerCase();
        return (
            c.name?.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query) ||
            c.phone?.toLowerCase().includes(query) ||
            c.venue?.toLowerCase().includes(query) ||
            c.wedding_date?.toLowerCase().includes(query) ||
            c.message?.toLowerCase().includes(query)
        );
    });

    const unreadCount = contacts.filter(c => !c.is_read).length;

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Contact Submissions</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">
                            {contacts.length} total
                            {unreadCount > 0 && <span className="adm-badge adm-badge-unread">{unreadCount} unread</span>}
                        </p>
                    )}
                </div>
                {!loading && (
                    <div className="adm-search-container">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="adm-search-input"
                        />
                        {searchQuery && (
                            <button
                                className="adm-search-clear"
                                onClick={() => setSearchQuery('')}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading contact submissions…</p>}

            {!loading && !error && contacts.length === 0 && (
                <div className="adm-empty-state">
                    <p>No contact submissions yet.</p>
                    <p>When someone sends a message via the contact page, it will appear here.</p>
                </div>
            )}

            {!loading && contacts.length > 0 && filteredContacts.length === 0 && (
                <div className="adm-empty-state">
                    <p>No contacts matching "{searchQuery}"</p>
                </div>
            )}

            {!loading && filteredContacts.length > 0 && (
                <div className="adm-submission-list">
                    {filteredContacts.map(c => (
                        <div
                            key={c.id}
                            className={`adm-submission-row${!c.is_read ? ' adm-submission-row--unread' : ''}${expandedId === c.id ? ' adm-submission-row--open' : ''}`}
                        >
                            {/* ── Summary row (clickable) ── */}
                            <button
                                className="adm-submission-summary"
                                onClick={() => toggleExpand(c.id)}
                                aria-expanded={expandedId === c.id}
                            >
                                <div className="adm-submission-meta">
                                    <span className="adm-submission-name">{c.name}</span>
                                    <span className="adm-submission-email">{c.email}</span>
                                </div>
                                <div className="adm-submission-tags">
                                    {c.venue && <span className="adm-tag adm-tag-muted">{c.venue}</span>}
                                    {c.wedding_date && <span className="adm-tag adm-tag-muted">{formatDate(c.wedding_date)}</span>}
                                </div>
                                <div className="adm-submission-right">
                                    <span className="adm-submission-date">{formatDate(c.submitted_at)}</span>
                                    <span className={`adm-badge ${c.is_read ? 'adm-badge-read' : 'adm-badge-unread'}`}>
                                        {c.is_read ? 'Read' : 'New'}
                                    </span>
                                    <span className="adm-chevron">{expandedId === c.id ? '▲' : '▼'}</span>
                                </div>
                            </button>

                            {/* ── Expanded detail panel ── */}
                            {expandedId === c.id && (
                                <div className="adm-submission-detail">
                                    <div className="adm-detail-grid">
                                        {c.phone && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Phone</span>
                                                <span className="adm-detail-value">{c.phone}</span>
                                            </div>
                                        )}
                                        {c.venue && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Venue</span>
                                                <span className="adm-detail-value">{c.venue}</span>
                                            </div>
                                        )}
                                        {c.wedding_date && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Wedding Date</span>
                                                <span className="adm-detail-value">{formatDate(c.wedding_date)}</span>
                                            </div>
                                        )}
                                        <div className="adm-detail-field adm-detail-field--full">
                                            <span className="adm-detail-label">Message</span>
                                            <span className="adm-detail-value adm-detail-message">{c.message}</span>
                                        </div>
                                    </div>
                                    <div className="adm-detail-actions">
                                        <a
                                            href={`mailto:${c.email}?subject=Re: Your Enquiry`}
                                            className="adm-btn adm-btn-primary"
                                        >
                                            Reply by Email
                                        </a>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => handleMarkRead(c)}
                                            disabled={togglingId === c.id}
                                        >
                                            {togglingId === c.id
                                                ? 'Saving…'
                                                : c.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                        </button>
                                        <button
                                            type="button"
                                            className="adm-btn adm-btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteContact(c);
                                            }}
                                            disabled={togglingId === c.id}
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            {togglingId === c.id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
