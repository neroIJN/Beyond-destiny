import React, { useEffect, useState, useRef } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import {
    adminListHeroSlides,
    adminCreateHeroSlide,
    adminUpdateHeroSlide,
    adminDeleteHeroSlide,
} from '../../lib/api';
import './AdminHeroSlides.css';

export default function AdminHeroSlides() {
    const { token } = useAdminAuth();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New slide form state
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newAltText, setNewAltText] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    // Delete confirm
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Toggling active
    const [togglingId, setTogglingId] = useState(null);

    // Drag-and-drop reorder state
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const dragIndexRef = useRef(null);  // index being dragged (ref = no re-render during drag)
    const dragNodeRef = useRef(null);   // DOM node of dragged row

    useEffect(() => {
        adminListHeroSlides(token)
            .then(setSlides)
            .catch(() => setError('Failed to load hero slides.'))
            .finally(() => setLoading(false));
    }, [token]);

    async function handleAdd() {
        if (!newImageUrl) { setAddError('Please upload an image first.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const slide = await adminCreateHeroSlide(token, {
                image_url: newImageUrl,
                alt_text: newAltText,
                display_order: slides.length,
            });
            setSlides(prev => [...prev, slide]);
            setNewImageUrl('');
            setNewAltText('');
        } catch {
            setAddError('Failed to add slide. Try again.');
        } finally {
            setAdding(false);
        }
    }

    async function handleToggleActive(slide) {
        setTogglingId(slide.id);
        try {
            const updated = await adminUpdateHeroSlide(token, slide.id, {
                image_url: slide.image_url,
                alt_text: slide.alt_text,
                display_order: slide.display_order,
                is_active: !slide.is_active,
            });
            setSlides(prev => prev.map(s => s.id === slide.id ? updated : s));
        } catch {
            // silently ignore
        } finally {
            setTogglingId(null);
        }
    }

    async function handleMove(index, direction) {
        const newSlides = [...slides];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newSlides.length) return;
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        // Update display_order on each
        const updatedSlides = newSlides.map((s, i) => ({ ...s, display_order: i }));
        setSlides(updatedSlides);
        // Persist the two swapped slides
        try {
            await Promise.all([
                adminUpdateHeroSlide(token, updatedSlides[index].id, {
                    image_url: updatedSlides[index].image_url,
                    alt_text: updatedSlides[index].alt_text,
                    display_order: updatedSlides[index].display_order,
                    is_active: updatedSlides[index].is_active,
                }),
                adminUpdateHeroSlide(token, updatedSlides[targetIndex].id, {
                    image_url: updatedSlides[targetIndex].image_url,
                    alt_text: updatedSlides[targetIndex].alt_text,
                    display_order: updatedSlides[targetIndex].display_order,
                    is_active: updatedSlides[targetIndex].is_active,
                }),
            ]);
        } catch {
            // silently ignore — UI already updated
        }
    }

    // --- Drag-and-drop handlers ---

    function handleDragStart(e, index) {
        dragIndexRef.current = index;
        dragNodeRef.current = e.currentTarget;
        // Delay so browser captures ghost BEFORE the fade class is applied
        setTimeout(() => { dragNodeRef.current?.classList.add('hs-slide-row--dragging'); }, 0);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragIndexRef.current === null || dragIndexRef.current === index) return;
        setDragOverIndex(index);
    }

    async function handleDrop(e, dropIndex) {
        e.preventDefault();
        const fromIndex = dragIndexRef.current;
        if (fromIndex === null || fromIndex === dropIndex) { setDragOverIndex(null); return; }
        const reordered = [...slides];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(dropIndex, 0, moved);
        const withNewOrder = reordered.map((s, i) => ({ ...s, display_order: i }));
        setSlides(withNewOrder);
        setDragOverIndex(null);
        setSavingOrder(true);
        try {
            await Promise.all(withNewOrder.map(s =>
                adminUpdateHeroSlide(token, s.id, {
                    image_url: s.image_url,
                    alt_text: s.alt_text,
                    display_order: s.display_order,
                    is_active: s.is_active,
                })
            ));
        } catch { /* silently ignore — UI already updated */ }
        finally { setSavingOrder(false); }
    }

    function handleDragEnd() {
        dragNodeRef.current?.classList.remove('hs-slide-row--dragging');
        dragIndexRef.current = null;
        dragNodeRef.current = null;
        setDragOverIndex(null);
    }

    function handleDragLeave(e) {
        // Only clear drop indicator when leaving the entire list, not between rows
        if (!e.currentTarget.contains(e.relatedTarget)) setDragOverIndex(null);
    }

    async function handleDelete(id) {
        setDeletingId(id);
        try {
            await adminDeleteHeroSlide(token, id);
            setSlides(prev => prev.filter(s => s.id !== id));
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
                    <h1 className="adm-page-title">Hero Slides</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">
                            {slides.length} slide{slides.length !== 1 ? 's' : ''}
                            {savingOrder && <span className="hs-saving-indicator">Saving order…</span>}
                        </p>
                    )}
                </div>
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading hero slides…</p>}

            {!loading && (
                <>
                    {/* Slide list */}
                    {slides.length === 0 && (
                        <div className="hs-empty-state">
                            <svg className="hs-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="14" rx="2"/>
                                <line x1="8" y1="22" x2="16" y2="22"/>
                                <line x1="12" y1="18" x2="12" y2="22"/>
                                <circle cx="9" cy="10" r="2"/>
                                <polyline points="14,8 18,13 2,13"/>
                            </svg>
                            <h3 className="hs-empty-title">No hero slides in the database</h3>
                            <p className="hs-empty-body">
                                The homepage currently shows hardcoded placeholder images.
                                To load them into your B2 bucket and make them appear here,
                                run this from your <code>backend/</code> directory:
                            </p>
                            <pre className="hs-empty-code">go run ./cmd/seed_cms/main.go</pre>
                            <p className="hs-empty-body">
                                This downloads the 3 default images, uploads them to Backblaze B2,
                                and inserts them here. Reload this page after running it.
                            </p>
                            <p className="hs-empty-body hs-empty-body--divider">
                                Or add a slide manually using the form below.
                            </p>
                        </div>
                    )}

                    {slides.length > 0 && (
                        <div className="hs-slide-list" onDragLeave={handleDragLeave}>
                            {slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={[
                                        'hs-slide-row',
                                        !slide.is_active ? 'hs-slide-row--inactive' : '',
                                        dragOverIndex === index ? 'hs-slide-row--drag-over' : '',
                                    ].filter(Boolean).join(' ')}
                                    draggable
                                    onDragStart={e => handleDragStart(e, index)}
                                    onDragOver={e => handleDragOver(e, index)}
                                    onDrop={e => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="hs-drag-handle" title="Drag to reorder">
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/>
                                            <circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
                                            <circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
                                        </svg>
                                    </div>
                                    <span className="hs-order-badge">#{index + 1}</span>
                                    <div className="hs-thumb">
                                        <img src={slide.image_url} alt={slide.alt_text || 'Hero slide'} />
                                    </div>
                                    <div className="hs-slide-info">
                                        <span className="hs-alt-text">{slide.alt_text || <em>No alt text</em>}</span>
                                        <span className={`adm-badge ${slide.is_active ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                            {slide.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="hs-slide-actions">
                                        <button
                                            className="hs-order-btn"
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0}
                                            title="Move up"
                                        >▲</button>
                                        <button
                                            className="hs-order-btn"
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === slides.length - 1}
                                            title="Move down"
                                        >▼</button>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => handleToggleActive(slide)}
                                            disabled={togglingId === slide.id}
                                        >
                                            {togglingId === slide.id ? 'Saving…' : slide.is_active ? 'Hide' : 'Show'}
                                        </button>
                                        {confirmDeleteId === slide.id ? (
                                            <>
                                                <button
                                                    className="adm-btn hs-btn-danger"
                                                    onClick={() => handleDelete(slide.id)}
                                                    disabled={deletingId === slide.id}
                                                >
                                                    {deletingId === slide.id ? 'Deleting…' : 'Confirm'}
                                                </button>
                                                <button
                                                    className="adm-btn adm-btn-ghost"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                >Cancel</button>
                                            </>
                                        ) : (
                                            <button
                                                className="adm-btn hs-btn-danger-ghost"
                                                onClick={() => setConfirmDeleteId(slide.id)}
                                            >Delete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new slide */}
                    <div className="hs-add-section">
                        <h2 className="adm-section-title">Add New Slide</h2>
                        <div className="hs-add-form">
                            <ImageUploader
                                token={token}
                                onUploaded={setNewImageUrl}
                                initialUrl={newImageUrl}
                            />
                            <div className="hs-add-fields">
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Alt text (describes the image for accessibility)</label>
                                    <input
                                        className="adm-input"
                                        type="text"
                                        placeholder="e.g. Couple at sunset on Galle beach"
                                        value={newAltText}
                                        onChange={e => setNewAltText(e.target.value)}
                                    />
                                </div>
                                {addError && <p className="adm-error" style={{ marginTop: 0 }}>{addError}</p>}
                                <button
                                    className="adm-btn adm-btn-primary"
                                    onClick={handleAdd}
                                    disabled={adding}
                                >
                                    {adding ? 'Adding…' : 'Add Slide'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
