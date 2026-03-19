import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import {
    adminListCategories,
    adminCreateCategory,
    adminUpdateCategory,
    adminDeleteCategory,
} from '../../lib/api';
import './AdminCategories.css';

export default function AdminCategories() {
    const { token } = useAdminAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Inline edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');

    // Delete state
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // Add state
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    // ── Load ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        adminListCategories(token)
            .then(setCategories)
            .catch(err => setError(err.message || 'Failed to load categories'))
            .finally(() => setLoading(false));
    }, [token]);

    // ── Edit ───────────────────────────────────────────────────────────────────

    function startEdit(cat) {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditError('');
        setConfirmDeleteId(null);
        setDeleteError('');
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName('');
        setEditError('');
    }

    async function handleSaveEdit(cat) {
        if (!editName.trim()) { setEditError('Name cannot be empty.'); return; }
        setSaving(true);
        setEditError('');
        try {
            const updated = await adminUpdateCategory(token, cat.id, {
                name: editName.trim(),
                display_order: cat.display_order,
            });
            setCategories(prev => prev.map(c => c.id === cat.id ? updated : c));
            setEditingId(null);
        } catch (err) {
            setEditError(err.message || 'Failed to save.');
        } finally {
            setSaving(false);
        }
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    async function handleDelete(id) {
        setDeletingId(id);
        setDeleteError('');
        try {
            await adminDeleteCategory(token, id);
            setCategories(prev => prev.filter(c => c.id !== id));
            setConfirmDeleteId(null);
        } catch (err) {
            setDeleteError(err.message || 'Failed to delete.');
        } finally {
            setDeletingId(null);
        }
    }

    // ── Add ────────────────────────────────────────────────────────────────────

    async function handleAdd(e) {
        e.preventDefault();
        if (!newName.trim()) { setAddError('Name cannot be empty.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const created = await adminCreateCategory(token, {
                name: newName.trim(),
                display_order: categories.length,
            });
            setCategories(prev => [...prev, created]);
            setNewName('');
        } catch (err) {
            setAddError(err.message || 'Failed to add category (it may already exist).');
        } finally {
            setAdding(false);
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="adm-page">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Album Categories</h1>
                    <p className="adm-page-subtitle">
                        Manage the category labels used to organise albums in the portfolio.
                    </p>
                </div>
            </div>

            {error && <div className="adm-error" style={{ marginBottom: 20 }}>{error}</div>}

            {loading ? (
                <div className="adm-loading">Loading categories…</div>
            ) : (
                <>
                    {/* ── Category list ──────────────────────────────────── */}
                    <div className="cat-list">
                        {categories.length === 0 && (
                            <div className="cat-empty">
                                No categories yet. Add one below.
                            </div>
                        )}

                        {categories.map((cat) => (
                            <div key={cat.id} className="cat-row">
                                {editingId === cat.id ? (
                                    /* ── Edit mode ── */
                                    <div className="cat-edit-row">
                                        <input
                                            className="adm-input cat-edit-input"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(cat); if (e.key === 'Escape') cancelEdit(); }}
                                            autoFocus
                                        />
                                        {editError && <span className="cat-inline-error">{editError}</span>}
                                        <div className="cat-edit-actions">
                                            <button
                                                className="adm-btn adm-btn-primary adm-btn-sm"
                                                onClick={() => handleSaveEdit(cat)}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving…' : 'Save'}
                                            </button>
                                            <button
                                                className="adm-btn adm-btn-sm"
                                                onClick={cancelEdit}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : confirmDeleteId === cat.id ? (
                                    /* ── Confirm delete mode ── */
                                    <div className="cat-confirm-row">
                                        <span className="cat-name">{cat.name}</span>
                                        <span className="cat-confirm-prompt">Delete this category?</span>
                                        {deleteError && <span className="cat-inline-error">{deleteError}</span>}
                                        <div className="cat-confirm-actions">
                                            <button
                                                className="adm-btn cat-btn-delete-confirm adm-btn-sm"
                                                onClick={() => handleDelete(cat.id)}
                                                disabled={deletingId === cat.id}
                                            >
                                                {deletingId === cat.id ? 'Deleting…' : 'Yes, delete'}
                                            </button>
                                            <button
                                                className="adm-btn adm-btn-sm"
                                                onClick={() => { setConfirmDeleteId(null); setDeleteError(''); }}
                                                disabled={deletingId === cat.id}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Normal mode ── */
                                    <div className="cat-normal-row">
                                        <span className="cat-name">{cat.name}</span>
                                        <div className="cat-actions">
                                            <button
                                                className="adm-btn adm-btn-sm"
                                                onClick={() => startEdit(cat)}
                                                title="Rename"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                                Rename
                                            </button>
                                            <button
                                                className="adm-btn adm-btn-sm cat-btn-delete"
                                                onClick={() => { setConfirmDeleteId(cat.id); setDeleteError(''); setEditingId(null); }}
                                                title="Delete"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Add new category ───────────────────────────────── */}
                    <div className="cat-add-section">
                        <h3 className="cat-add-title">Add New Category</h3>
                        <form className="cat-add-form" onSubmit={handleAdd}>
                            <input
                                className="adm-input cat-add-input"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Maternity, Family, Boudoir"
                            />
                            <button
                                type="submit"
                                className="adm-btn adm-btn-primary"
                                disabled={adding}
                            >
                                {adding ? 'Adding…' : '+ Add'}
                            </button>
                        </form>
                        {addError && <p className="cat-add-error">{addError}</p>}
                        <p className="cat-add-hint">
                            Categories cannot be deleted while albums are assigned to them.
                            Reassign those albums first.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
