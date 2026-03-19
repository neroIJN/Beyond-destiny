import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import {
    adminListShowcaseItems,
    adminCreateShowcaseItem,
    adminUpdateShowcaseItem,
    adminDeleteShowcaseItem,
} from '../../lib/api';
import './AdminShowcase.css';

export default function AdminShowcase() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New item form
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    // Delete / active controls
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        adminListShowcaseItems(token)
            .then(setItems)
            .catch(() => setError('Failed to load showcase items.'))
            .finally(() => setLoading(false));
    }, [token]);

    async function handleAdd() {
        if (!newImageUrl) { setAddError('Please upload an image first.'); return; }
        if (!newTitle || !newCategory) { setAddError('Title and category are required.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const item = await adminCreateShowcaseItem(token, {
                image_url: newImageUrl,
                title: newTitle,
                category: newCategory,
                display_order: items.length,
            });
            setItems(prev => [...prev, item]);
            setNewImageUrl('');
            setNewTitle('');
            setNewCategory('');
        } catch {
            setAddError('Failed to add showcase item. Try again.');
        } finally {
            setAdding(false);
        }
    }

    async function handleToggleActive(item) {
        setTogglingId(item.id);
        try {
            const updated = await adminUpdateShowcaseItem(token, item.id, {
                image_url: item.image_url,
                title: item.title,
                category: item.category,
                display_order: item.display_order,
                is_active: !item.is_active,
            });
            setItems(prev => prev.map(x => x.id === item.id ? updated : x));
        } catch {
            // silently ignore
        } finally {
            setTogglingId(null);
        }
    }

    async function handleMove(index, direction) {
        const newItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        const updated = newItems.map((it, i) => ({ ...it, display_order: i }));
        setItems(updated);
        try {
            await Promise.all([
                adminUpdateShowcaseItem(token, updated[index].id, {
                    image_url: updated[index].image_url,
                    title: updated[index].title,
                    category: updated[index].category,
                    display_order: updated[index].display_order,
                    is_active: updated[index].is_active,
                }),
                adminUpdateShowcaseItem(token, updated[targetIndex].id, {
                    image_url: updated[targetIndex].image_url,
                    title: updated[targetIndex].title,
                    category: updated[targetIndex].category,
                    display_order: updated[targetIndex].display_order,
                    is_active: updated[targetIndex].is_active,
                }),
            ]);
        } catch {
            // silently ignore
        }
    }

    async function handleDelete(id) {
        setDeletingId(id);
        try {
            await adminDeleteShowcaseItem(token, id);
            setItems(prev => prev.filter(x => x.id !== id));
        } catch {
            // silently ignore
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    }

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Showcase Items</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} — "Stories We've Told" section</p>
                    )}
                </div>
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading showcase items…</p>}

            {!loading && (
                <>
                    {items.length === 0 && (
                        <div className="adm-empty-state">
                            <p>No showcase items yet.</p>
                            <p>Add items below to populate the "Stories We've Told" section.</p>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="hs-slide-list">
                            {items.map((item, index) => (
                                <div key={item.id} className={`hs-slide-row${!item.is_active ? ' hs-slide-row--inactive' : ''}`}>
                                    <div className="hs-thumb">
                                        <img src={item.image_url} alt={item.title} />
                                    </div>
                                    <div className="hs-slide-info">
                                        <div>
                                            <span className="hs-alt-text" style={{ display: 'block' }}>{item.title}</span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--adm-muted)' }}>{item.category}</span>
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
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new item */}
                    <div className="hs-add-section">
                        <h2 className="adm-section-title">Add New Item</h2>
                        <div className="hs-add-form">
                            <ImageUploader
                                token={token}
                                onUploaded={setNewImageUrl}
                                initialUrl={newImageUrl}
                            />
                            <div className="hs-add-fields">
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Title *</label>
                                    <input className="adm-input" type="text" placeholder="e.g. The First Look" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Category *</label>
                                    <input className="adm-input" type="text" placeholder="e.g. Intimate Moments" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                                </div>
                                {addError && <p className="adm-error" style={{ marginTop: 0 }}>{addError}</p>}
                                <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={adding}>
                                    {adding ? 'Adding…' : 'Add Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
