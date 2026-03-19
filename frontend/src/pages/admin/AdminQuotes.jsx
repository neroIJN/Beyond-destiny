import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import { adminListQuotes, adminMarkQuoteRead, adminDeleteQuote } from '../../lib/api';
import './AdminQuotes.css';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminQuotes() {
    const { token } = useAdminAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        adminListQuotes(token)
            .then(setQuotes)
            .catch(() => setError('Failed to load quote requests.'))
            .finally(() => setLoading(false));
    }, [token]);

    function toggleExpand(id) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    async function handleMarkRead(quote) {
        setTogglingId(quote.id);
        try {
            await adminMarkQuoteRead(token, quote.id, !quote.is_read);
            setQuotes(prev =>
                prev.map(q => q.id === quote.id ? { ...q, is_read: !q.is_read } : q)
            );
        } catch {
            // silently ignore — row still shows old state
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDeleteQuote(quote) {
        console.log('Delete button clicked for quote:', quote.id);
        if (!window.confirm(`Delete quote request from ${quote.names}?`)) return;

        setTogglingId(quote.id);
        try {
            await adminDeleteQuote(token, quote.id);
            setQuotes(prev => prev.filter(q => q.id !== quote.id));
        } catch (err) {
            alert('Failed to delete quote request.');
        } finally {
            setTogglingId(null);
        }
    }

    const filteredQuotes = quotes.filter(q => {
        const query = searchQuery.toLowerCase();
        return (
            q.names?.toLowerCase().includes(query) ||
            q.email?.toLowerCase().includes(query) ||
            q.phone?.toLowerCase().includes(query) ||
            q.event_type?.toLowerCase().includes(query) ||
            q.event_venue?.toLowerCase().includes(query) ||
            q.budget?.toLowerCase().includes(query) ||
            q.hear_about_us?.toLowerCase().includes(query) ||
            q.message?.toLowerCase().includes(query)
        );
    });

    const unreadCount = quotes.filter(q => !q.is_read).length;

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Quote Requests</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">
                            {quotes.length} total
                            {unreadCount > 0 && <span className="adm-badge adm-badge-unread">{unreadCount} unread</span>}
                        </p>
                    )}
                </div>
                {!loading && (
                    <div className="adm-search-container">
                        <input
                            type="text"
                            placeholder="Search quotes..."
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
            {loading && <p className="adm-loading-text">Loading quote requests…</p>}

            {!loading && !error && quotes.length === 0 && (
                <div className="adm-empty-state">
                    <p>No quote requests yet.</p>
                    <p>When someone submits a request via the website, it will appear here.</p>
                </div>
            )}

            {!loading && quotes.length > 0 && filteredQuotes.length === 0 && (
                <div className="adm-empty-state">
                    <p>No quotes matching "{searchQuery}"</p>
                </div>
            )}

            {!loading && filteredQuotes.length > 0 && (
                <div className="adm-submission-list">
                    {filteredQuotes.map(q => (
                        <div
                            key={q.id}
                            className={`adm-submission-row${!q.is_read ? ' adm-submission-row--unread' : ''}${expandedId === q.id ? ' adm-submission-row--open' : ''}`}
                        >
                            {/* ── Summary row (clickable) ── */}
                            <button
                                className="adm-submission-summary"
                                onClick={() => toggleExpand(q.id)}
                                aria-expanded={expandedId === q.id}
                            >
                                <div className="adm-submission-meta">
                                    <span className="adm-submission-name">{q.names}</span>
                                    <span className="adm-submission-email">{q.email}</span>
                                </div>
                                <div className="adm-submission-tags">
                                    <span className="adm-tag">{q.event_type}</span>
                                    {q.event_date && <span className="adm-tag adm-tag-muted">{formatDate(q.event_date)}</span>}
                                </div>
                                <div className="adm-submission-right">
                                    <span className="adm-submission-date">{formatDate(q.submitted_at)}</span>
                                    <span className={`adm-badge ${q.is_read ? 'adm-badge-read' : 'adm-badge-unread'}`}>
                                        {q.is_read ? 'Read' : 'New'}
                                    </span>
                                    <span className="adm-chevron">{expandedId === q.id ? '▲' : '▼'}</span>
                                </div>
                            </button>

                            {/* ── Expanded detail panel ── */}
                            {expandedId === q.id && (
                                <div className="adm-submission-detail">
                                    <div className="adm-detail-grid">
                                        {q.phone && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Phone</span>
                                                <span className="adm-detail-value">{q.phone}</span>
                                            </div>
                                        )}
                                        {q.event_venue && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Venue</span>
                                                <span className="adm-detail-value">{q.event_venue}</span>
                                            </div>
                                        )}
                                        {q.budget && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Budget</span>
                                                <span className="adm-detail-value">{q.budget}</span>
                                            </div>
                                        )}
                                        {q.hear_about_us && (
                                            <div className="adm-detail-field">
                                                <span className="adm-detail-label">Heard about us</span>
                                                <span className="adm-detail-value">{q.hear_about_us}</span>
                                            </div>
                                        )}
                                        <div className="adm-detail-field adm-detail-field--full">
                                            <span className="adm-detail-label">Message</span>
                                            <span className="adm-detail-value adm-detail-message">{q.message}</span>
                                        </div>
                                    </div>
                                    <div className="adm-detail-actions">
                                        <a
                                            href={`mailto:${q.email}?subject=Re: Your Quote Request`}
                                            className="adm-btn adm-btn-primary"
                                        >
                                            Reply by Email
                                        </a>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => handleMarkRead(q)}
                                            disabled={togglingId === q.id}
                                        >
                                            {togglingId === q.id
                                                ? 'Saving…'
                                                : q.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                        </button>
                                        <button
                                            type="button"
                                            className="adm-btn adm-btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteQuote(q);
                                            }}
                                            disabled={togglingId === q.id}
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            {togglingId === q.id ? 'Deleting…' : 'Delete'}
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
