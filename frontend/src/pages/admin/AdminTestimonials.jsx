import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import {
    adminListTestimonials,
    adminCreateTestimonial,
    adminUpdateTestimonial,
    adminDeleteTestimonial,
} from '../../lib/api';
import './AdminTestimonials.css';

const STAR_OPTIONS = [1, 2, 3, 4, 5];

function StarRating({ rating }) {
    return (
        <span className="admt-stars">
            {STAR_OPTIONS.map(n => (
                <span key={n} className={n <= rating ? 'admt-star admt-star--filled' : 'admt-star'}>★</span>
            ))}
        </span>
    );
}

const EMPTY_FORM = { image_url: '', quote: '', couple: '', location: '', rating: 5 };

export default function AdminTestimonials() {
    const { token } = useAdminAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY_FORM);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    useEffect(() => {
        adminListTestimonials(token)
            .then(setTestimonials)
            .catch(() => setError('Failed to load testimonials.'))
            .finally(() => setLoading(false));
    }, [token]);

    function toggleExpand(id) {
        setExpandedId(prev => (prev === id ? null : id));
        setEditingId(null);
    }

    function startEdit(t) {
        setEditingId(t.id);
        setEditForm({ image_url: t.image_url, quote: t.quote, couple: t.couple, location: t.location, rating: t.rating });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditForm({});
    }

    async function saveEdit(t) {
        setSavingId(t.id);
        try {
            const updated = await adminUpdateTestimonial(token, t.id, editForm);
            setTestimonials(prev => prev.map(x => x.id === t.id ? updated : x));
            setEditingId(null);
        } catch {
            // silently ignore — keep form open
        } finally {
            setSavingId(null);
        }
    }

    async function handleToggleActive(t) {
        setTogglingId(t.id);
        try {
            const updated = await adminUpdateTestimonial(token, t.id, {
                image_url: t.image_url,
                quote: t.quote,
                couple: t.couple,
                location: t.location,
                rating: t.rating,
                display_order: t.display_order,
                is_active: !t.is_active,
            });
            setTestimonials(prev => prev.map(x => x.id === t.id ? updated : x));
        } catch {
            // silently ignore
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDelete(id) {
        setDeletingId(id);
        try {
            await adminDeleteTestimonial(token, id);
            setTestimonials(prev => prev.filter(t => t.id !== id));
            setExpandedId(null);
        } catch {
            // silently ignore
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    }

    async function handleAdd() {
        if (!newForm.image_url) { setAddError('Please upload an image first.'); return; }
        if (!newForm.quote || !newForm.couple || !newForm.location) { setAddError('Please fill in all required fields.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const created = await adminCreateTestimonial(token, { ...newForm, display_order: testimonials.length });
            setTestimonials(prev => [...prev, created]);
            setNewForm(EMPTY_FORM);
            setShowAddForm(false);
        } catch {
            setAddError('Failed to add testimonial. Try again.');
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Testimonials</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">{testimonials.length} total</p>
                    )}
                </div>
                <button className="adm-btn adm-btn-primary" onClick={() => setShowAddForm(v => !v)}>
                    {showAddForm ? 'Cancel' : '+ Add Testimonial'}
                </button>
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading testimonials…</p>}

            {/* Add form */}
            {showAddForm && (
                <div className="admt-add-card">
                    <h2 className="adm-section-title">New Testimonial</h2>
                    <div className="admt-add-grid">
                        <ImageUploader
                            token={token}
                            onUploaded={url => setNewForm(f => ({ ...f, image_url: url }))}
                            initialUrl={newForm.image_url}
                        />
                        <div className="admt-add-fields">
                            <div className="adm-form-group">
                                <label className="adm-form-label">Quote *</label>
                                <textarea
                                    className="adm-input"
                                    rows="3"
                                    value={newForm.quote}
                                    onChange={e => setNewForm(f => ({ ...f, quote: e.target.value }))}
                                    placeholder="What did the couple say?"
                                />
                            </div>
                            <div className="admt-two-col">
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Couple names *</label>
                                    <input className="adm-input" value={newForm.couple} onChange={e => setNewForm(f => ({ ...f, couple: e.target.value }))} placeholder="Amanda & David" />
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Location *</label>
                                    <input className="adm-input" value={newForm.location} onChange={e => setNewForm(f => ({ ...f, location: e.target.value }))} placeholder="Galle, Sri Lanka" />
                                </div>
                            </div>
                            <div className="adm-form-group">
                                <label className="adm-form-label">Rating</label>
                                <select className="adm-input" value={newForm.rating} onChange={e => setNewForm(f => ({ ...f, rating: parseInt(e.target.value) }))}>
                                    {STAR_OPTIONS.map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                            {addError && <p className="adm-error" style={{ marginTop: 0 }}>{addError}</p>}
                            <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={adding}>
                                {adding ? 'Adding…' : 'Save Testimonial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {!loading && testimonials.length === 0 && !showAddForm && (
                <div className="adm-empty-state">
                    <p>No testimonials yet.</p>
                    <p>Add your first testimonial using the button above.</p>
                </div>
            )}

            {!loading && testimonials.length > 0 && (
                <div className="adm-submission-list">
                    {testimonials.map(t => (
                        <div
                            key={t.id}
                            className={`adm-submission-row${!t.is_active ? ' adm-submission-row--inactive' : ''}${expandedId === t.id ? ' adm-submission-row--open' : ''}`}
                        >
                            <button
                                className="adm-submission-summary"
                                onClick={() => toggleExpand(t.id)}
                                aria-expanded={expandedId === t.id}
                            >
                                <div className="admt-thumb">
                                    <img src={t.image_url} alt={t.couple} />
                                </div>
                                <div className="adm-submission-meta">
                                    <span className="adm-submission-name">{t.couple}</span>
                                    <span className="adm-submission-email">{t.location}</span>
                                </div>
                                <div className="adm-submission-tags">
                                    <StarRating rating={t.rating} />
                                </div>
                                <div className="adm-submission-right">
                                    <span className={`adm-badge ${t.is_active ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                        {t.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <span className="adm-chevron">{expandedId === t.id ? '▲' : '▼'}</span>
                                </div>
                            </button>

                            {expandedId === t.id && (
                                <div className="adm-submission-detail">
                                    {editingId === t.id ? (
                                        <div className="admt-edit-form">
                                            <div className="admt-add-grid">
                                                <ImageUploader
                                                    token={token}
                                                    onUploaded={url => setEditForm(f => ({ ...f, image_url: url }))}
                                                    initialUrl={editForm.image_url}
                                                />
                                                <div className="admt-add-fields">
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Quote</label>
                                                        <textarea className="adm-input" rows="3" value={editForm.quote} onChange={e => setEditForm(f => ({ ...f, quote: e.target.value }))} />
                                                    </div>
                                                    <div className="admt-two-col">
                                                        <div className="adm-form-group">
                                                            <label className="adm-form-label">Couple</label>
                                                            <input className="adm-input" value={editForm.couple} onChange={e => setEditForm(f => ({ ...f, couple: e.target.value }))} />
                                                        </div>
                                                        <div className="adm-form-group">
                                                            <label className="adm-form-label">Location</label>
                                                            <input className="adm-input" value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                                                        </div>
                                                    </div>
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Rating</label>
                                                        <select className="adm-input" value={editForm.rating} onChange={e => setEditForm(f => ({ ...f, rating: parseInt(e.target.value) }))}>
                                                            {STAR_OPTIONS.map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="adm-detail-actions">
                                                        <button className="adm-btn adm-btn-primary" onClick={() => saveEdit(t)} disabled={savingId === t.id}>
                                                            {savingId === t.id ? 'Saving…' : 'Save Changes'}
                                                        </button>
                                                        <button className="adm-btn adm-btn-ghost" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="adm-detail-grid">
                                                <div className="adm-detail-field adm-detail-field--full">
                                                    <span className="adm-detail-label">Quote</span>
                                                    <span className="adm-detail-value adm-detail-message">"{t.quote}"</span>
                                                </div>
                                            </div>
                                            <div className="adm-detail-actions">
                                                <button className="adm-btn adm-btn-ghost" onClick={() => startEdit(t)}>Edit</button>
                                                <button
                                                    className="adm-btn adm-btn-ghost"
                                                    onClick={() => handleToggleActive(t)}
                                                    disabled={togglingId === t.id}
                                                >
                                                    {togglingId === t.id ? 'Saving…' : t.is_active ? 'Hide' : 'Show'}
                                                </button>
                                                {confirmDeleteId === t.id ? (
                                                    <>
                                                        <button className="adm-btn hs-btn-danger" onClick={() => handleDelete(t.id)} disabled={deletingId === t.id}>
                                                            {deletingId === t.id ? 'Deleting…' : 'Confirm Delete'}
                                                        </button>
                                                        <button className="adm-btn adm-btn-ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button className="adm-btn hs-btn-danger-ghost" onClick={() => setConfirmDeleteId(t.id)}>Delete</button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
