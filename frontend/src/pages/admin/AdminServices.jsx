import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import {
    adminListServices,
    adminCreateService,
    adminUpdateService,
    adminDeleteService,
} from '../../lib/api';
import './AdminServices.css';

const ICON_OPTIONS = [
    { value: 'heart',    label: '♥ Heart (Weddings)' },
    { value: 'camera',   label: '📷 Camera (Portraits)' },
    { value: 'sparkles', label: '✦ Sparkles (Events)' },
];

export default function AdminServices() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Which row is expanded for editing
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editChipInput, setEditChipInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Delete
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    // Add new service form
    const [newTitle, setNewTitle] = useState('');
    const [newIconName, setNewIconName] = useState('camera');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newFeatures, setNewFeatures] = useState([]);
    const [newChipInput, setNewChipInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    useEffect(() => {
        adminListServices(token)
            .then(setItems)
            .catch(() => setError('Failed to load services.'))
            .finally(() => setLoading(false));
    }, [token]);

    // ── Reorder ──────────────────────────────────────────────────────────────

    async function handleMove(index, direction) {
        const newItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        const updated = newItems.map((it, i) => ({ ...it, display_order: i }));
        setItems(updated);
        try {
            await Promise.all([
                adminUpdateService(token, updated[index].id, {
                    title: updated[index].title, icon_name: updated[index].icon_name,
                    image_url: updated[index].image_url, description: updated[index].description,
                    features: updated[index].features, display_order: updated[index].display_order,
                    is_active: updated[index].is_active,
                }),
                adminUpdateService(token, updated[targetIndex].id, {
                    title: updated[targetIndex].title, icon_name: updated[targetIndex].icon_name,
                    image_url: updated[targetIndex].image_url, description: updated[targetIndex].description,
                    features: updated[targetIndex].features, display_order: updated[targetIndex].display_order,
                    is_active: updated[targetIndex].is_active,
                }),
            ]);
        } catch { /* silently ignore */ }
    }

    // ── Toggle active ────────────────────────────────────────────────────────

    async function handleToggleActive(item) {
        setTogglingId(item.id);
        try {
            const updated = await adminUpdateService(token, item.id, {
                title: item.title, icon_name: item.icon_name, image_url: item.image_url,
                description: item.description, features: item.features,
                display_order: item.display_order, is_active: !item.is_active,
            });
            setItems(prev => prev.map(x => x.id === item.id ? updated : x));
        } catch { /* silently ignore */ }
        finally { setTogglingId(null); }
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    async function handleDelete(id) {
        setDeletingId(id);
        try {
            await adminDeleteService(token, id);
            setItems(prev => prev.filter(x => x.id !== id));
            if (editingId === id) setEditingId(null);
        } catch { /* silently ignore */ }
        finally { setDeletingId(null); setConfirmDeleteId(null); }
    }

    // ── Inline edit ──────────────────────────────────────────────────────────

    function startEdit(item) {
        setEditingId(item.id);
        setEditForm({
            title: item.title,
            icon_name: item.icon_name,
            image_url: item.image_url,
            description: item.description,
            features: [...(item.features || [])],
        });
        setEditChipInput('');
        setSaveError('');
    }

    function cancelEdit() {
        setEditingId(null);
        setEditForm({});
        setSaveError('');
    }

    function addEditChip() {
        const chip = editChipInput.trim();
        if (!chip) return;
        setEditForm(prev => ({ ...prev, features: [...prev.features, chip] }));
        setEditChipInput('');
    }

    function removeEditChip(i) {
        setEditForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));
    }

    async function handleSaveEdit(item) {
        if (!editForm.title || !editForm.icon_name || !editForm.image_url) {
            setSaveError('Title, icon, and image are required.');
            return;
        }
        setSaving(true);
        setSaveError('');
        try {
            const updated = await adminUpdateService(token, item.id, {
                title: editForm.title,
                icon_name: editForm.icon_name,
                image_url: editForm.image_url,
                description: editForm.description,
                features: editForm.features,
                display_order: item.display_order,
                is_active: item.is_active,
            });
            setItems(prev => prev.map(x => x.id === item.id ? updated : x));
            setEditingId(null);
        } catch {
            setSaveError('Failed to save. Try again.');
        } finally {
            setSaving(false);
        }
    }

    // ── Add new ──────────────────────────────────────────────────────────────

    function addNewChip() {
        const chip = newChipInput.trim();
        if (!chip) return;
        setNewFeatures(prev => [...prev, chip]);
        setNewChipInput('');
    }

    function removeNewChip(i) {
        setNewFeatures(prev => prev.filter((_, idx) => idx !== i));
    }

    async function handleAdd() {
        if (!newTitle) { setAddError('Title is required.'); return; }
        if (!newImageUrl) { setAddError('Please upload an image first.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const item = await adminCreateService(token, {
                title: newTitle,
                icon_name: newIconName,
                image_url: newImageUrl,
                description: newDescription,
                features: newFeatures,
                display_order: items.length,
            });
            setItems(prev => [...prev, item]);
            setNewTitle('');
            setNewIconName('camera');
            setNewImageUrl('');
            setNewDescription('');
            setNewFeatures([]);
            setNewChipInput('');
        } catch {
            setAddError('Failed to add service. Try again.');
        } finally {
            setAdding(false);
        }
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Services</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">
                            {items.length} service{items.length !== 1 ? 's' : ''} — "Services tailored to your story" section
                        </p>
                    )}
                </div>
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading services…</p>}

            {!loading && (
                <>
                    {items.length === 0 && (
                        <div className="adm-empty-state">
                            <p>No services yet. Add your first service below.</p>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="hs-slide-list">
                            {items.map((item, index) => (
                                <div key={item.id} className={`hs-slide-row svc-row${!item.is_active ? ' hs-slide-row--inactive' : ''}${editingId === item.id ? ' svc-row--editing' : ''}`}>

                                    {/* ── Collapsed row ───────────────────── */}
                                    <div className="hs-thumb">
                                        <img src={item.image_url} alt={item.title} />
                                    </div>
                                    <div className="hs-slide-info">
                                        <div>
                                            <span className="hs-alt-text svc-title">{item.title}</span>
                                            <span className="svc-icon-badge">
                                                {ICON_OPTIONS.find(o => o.value === item.icon_name)?.label || item.icon_name}
                                            </span>
                                        </div>
                                        <span className={`adm-badge ${item.is_active ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                            {item.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="hs-slide-actions">
                                        <button className="hs-order-btn" onClick={() => handleMove(index, -1)} disabled={index === 0} title="Move up">▲</button>
                                        <button className="hs-order-btn" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} title="Move down">▼</button>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => editingId === item.id ? cancelEdit() : startEdit(item)}
                                        >
                                            {editingId === item.id ? 'Cancel' : 'Edit'}
                                        </button>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => handleToggleActive(item)}
                                            disabled={togglingId === item.id}
                                        >
                                            {togglingId === item.id ? 'Saving…' : item.is_active ? 'Hide' : 'Show'}
                                        </button>
                                        {confirmDeleteId === item.id ? (
                                            <>
                                                <button className="adm-btn hs-btn-danger" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}>
                                                    {deletingId === item.id ? 'Deleting…' : 'Confirm'}
                                                </button>
                                                <button className="adm-btn adm-btn-ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <button className="adm-btn hs-btn-danger-ghost" onClick={() => setConfirmDeleteId(item.id)}>Delete</button>
                                        )}
                                    </div>

                                    {/* ── Expanded edit panel ──────────────── */}
                                    {editingId === item.id && (
                                        <div className="svc-edit-panel">
                                            {saveError && <p className="adm-error" style={{ marginTop: 0 }}>{saveError}</p>}

                                            <div className="svc-edit-grid">
                                                <div className="svc-edit-left">
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Image *</label>
                                                        <ImageUploader
                                                            key={editForm.image_url || 'empty'}
                                                            token={token}
                                                            initialUrl={editForm.image_url}
                                                            onUploaded={url => setEditForm(prev => ({ ...prev, image_url: url }))}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="svc-edit-right">
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Title *</label>
                                                        <input
                                                            className="adm-input"
                                                            value={editForm.title}
                                                            onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                                            placeholder="e.g. Weddings"
                                                        />
                                                    </div>

                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Icon</label>
                                                        <select
                                                            className="adm-select"
                                                            value={editForm.icon_name}
                                                            onChange={e => setEditForm(prev => ({ ...prev, icon_name: e.target.value }))}
                                                        >
                                                            {ICON_OPTIONS.map(o => (
                                                                <option key={o.value} value={o.value}>{o.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Description</label>
                                                        <textarea
                                                            className="adm-input svc-textarea"
                                                            rows={3}
                                                            value={editForm.description}
                                                            onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                                            placeholder="Brief description of this service…"
                                                        />
                                                    </div>

                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Feature Chips</label>
                                                        <div className="svc-chips">
                                                            {editForm.features.map((chip, i) => (
                                                                <span key={i} className="svc-chip">
                                                                    {chip}
                                                                    <button className="svc-chip-remove" onClick={() => removeEditChip(i)} title="Remove">×</button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="svc-chip-add">
                                                            <input
                                                                className="adm-input"
                                                                value={editChipInput}
                                                                onChange={e => setEditChipInput(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEditChip())}
                                                                placeholder="e.g. Online gallery"
                                                            />
                                                            <button className="adm-btn adm-btn-ghost" onClick={addEditChip}>Add</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="svc-edit-footer">
                                                <button className="adm-btn adm-btn-primary" onClick={() => handleSaveEdit(item)} disabled={saving}>
                                                    {saving ? 'Saving…' : 'Save Changes'}
                                                </button>
                                                <button className="adm-btn adm-btn-ghost" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Add new service ───────────────────────────────── */}
                    <div className="hs-add-section">
                        <h2 className="adm-section-title">Add New Service</h2>
                        <div className="svc-add-form">
                            <div className="svc-add-image">
                                <label className="adm-form-label">Image *</label>
                                <ImageUploader
                                    key={newImageUrl || 'new-svc'}
                                    token={token}
                                    onUploaded={setNewImageUrl}
                                    initialUrl={newImageUrl}
                                />
                            </div>
                            <div className="svc-add-fields">
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Title *</label>
                                    <input className="adm-input" type="text" placeholder="e.g. Weddings" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Icon</label>
                                    <select className="adm-select" value={newIconName} onChange={e => setNewIconName(e.target.value)}>
                                        {ICON_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Description</label>
                                    <textarea className="adm-input svc-textarea" rows={3} placeholder="Brief description…" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Feature Chips</label>
                                    <div className="svc-chips">
                                        {newFeatures.map((chip, i) => (
                                            <span key={i} className="svc-chip">
                                                {chip}
                                                <button className="svc-chip-remove" onClick={() => removeNewChip(i)} title="Remove">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="svc-chip-add">
                                        <input
                                            className="adm-input"
                                            value={newChipInput}
                                            onChange={e => setNewChipInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNewChip())}
                                            placeholder="e.g. 8+ hours coverage"
                                        />
                                        <button className="adm-btn adm-btn-ghost" onClick={addNewChip}>Add</button>
                                    </div>
                                </div>
                                {addError && <p className="adm-error" style={{ marginTop: 0 }}>{addError}</p>}
                                <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={adding}>
                                    {adding ? 'Adding…' : 'Add Service'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
