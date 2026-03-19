import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    adminListAlbums, adminCreateAlbum, adminUpdateAlbum,
    adminGetAlbumPhotos, adminAddPhoto, adminDeletePhoto, adminReorderPhotos,
    adminListCategories,
} from '../../lib/api';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import './AdminAlbumEditor.css';

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function AdminAlbumEditor() {
    const { id } = useParams();
    const isNew = id === 'new';
    const { token } = useAdminAuth();
    const navigate = useNavigate();

    // Album form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('Weddings');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isPublished, setIsPublished] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    // Photos state (only in edit mode)
    const [photos, setPhotos] = useState([]);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [newPhotoAlt, setNewPhotoAlt] = useState('');
    const [addingPhoto, setAddingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState(null);
    const [albumId, setAlbumId] = useState(isNew ? null : id);

    // Dynamic categories from DB
    const [categories, setCategories] = useState(['Weddings', 'Engagements', 'Editorial', 'Pre-Shoots']);

    useEffect(() => {
        adminListCategories(token)
            .then(data => { if (data?.length) setCategories(data.map(c => c.name)); })
            .catch(() => {}); // silently keep defaults
    }, [token]);

    // Load existing album
    useEffect(() => {
        if (isNew) return;
        adminListAlbums(token).then(albums => {
            const album = albums.find(a => a.id === id);
            if (!album) { navigate('/admin/albums'); return; }
            setTitle(album.title);
            setSlug(album.slug);
            setCategory(album.category);
            setDisplayOrder(album.display_order);
            setIsPublished(album.is_published);
            setCoverUrl(album.cover_image_url);
            setAlbumId(album.id);
        }).catch(console.error);

        // Load album photos via the admin endpoint (queries by UUID, no published filter)
        adminGetAlbumPhotos(token, id)
            .then(photos => setPhotos(photos || []))
            .catch(console.error);
    }, [id, isNew, token]);

    // Auto-generate slug from title (only in create mode)
    const handleTitleChange = (val) => {
        setTitle(val);
        if (isNew) setSlug(slugify(val));
    };

    // Save album (create or update)
    const handleSave = async (e) => {
        e.preventDefault();
        if (!coverUrl) { setSaveError('Please upload a cover image first.'); return; }
        setSaving(true);
        setSaveError('');
        setSaveSuccess('');
        try {
            const payload = {
                title, slug, category,
                cover_image_url: coverUrl,
                display_order: Number(displayOrder),
                is_published: isPublished,
            };

            if (isNew) {
                const created = await adminCreateAlbum(token, payload);
                setSaveSuccess('Album created! You can now add photos below.');
                setAlbumId(created.id);
                // Navigate to edit mode so photos section appears
                navigate(`/admin/albums/${created.id}`, { replace: true });
            } else {
                await adminUpdateAlbum(token, id, payload);
                setSaveSuccess('Album saved successfully.');
            }
        } catch (err) {
            setSaveError(err.message || 'Failed to save album.');
        } finally {
            setSaving(false);
        }
    };

    // Add a photo
    const handleAddPhoto = async () => {
        if (!newPhotoUrl) return;
        setAddingPhoto(true);
        setPhotoError('');
        try {
            const photo = await adminAddPhoto(token, albumId, {
                url: newPhotoUrl,
                alt_text: newPhotoAlt,
                display_order: photos.length,
            });
            setPhotos(prev => [...prev, photo]);
            setNewPhotoUrl('');
            setNewPhotoAlt('');
        } catch (err) {
            setPhotoError(err.message || 'Failed to add photo.');
        } finally {
            setAddingPhoto(false);
        }
    };

    // Delete a photo
    const handleDeletePhoto = async (photoId) => {
        try {
            await adminDeletePhoto(token, albumId, photoId);
            setPhotos(prev => prev.filter(p => p.id !== photoId));
            setConfirmDeletePhotoId(null);
        } catch {
            setPhotoError('Failed to delete photo.');
        }
    };

    // Move photo up or down
    const handleMove = async (index, direction) => {
        const newPhotos = [...photos];
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= newPhotos.length) return;
        [newPhotos[index], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[index]];
        const reordered = newPhotos.map((p, i) => ({ ...p, display_order: i }));
        setPhotos(reordered);
        try {
            await adminReorderPhotos(token, albumId, reordered.map(p => ({ id: p.id, display_order: p.display_order })));
        } catch {
            setPhotoError('Failed to save order. Please try again.');
        }
    };

    return (
        <div className="adm-editor">
            <div className="adm-page-header">
                <div className="adm-editor-breadcrumb">
                    <Link to="/admin/albums" className="adm-breadcrumb-back">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Albums
                    </Link>
                    <span className="adm-breadcrumb-sep">/</span>
                    <span className="adm-breadcrumb-current">{isNew ? 'New Album' : title || 'Edit Album'}</span>
                </div>
            </div>

            <div className="adm-editor-grid">
                {/* ── LEFT: Album details ─────────────────────────────── */}
                <div className="adm-editor-left">
                    <div className="adm-card">
                        <h2 className="adm-editor-section-title">Album Details</h2>

                        {saveError && <div className="adm-error">{saveError}</div>}
                        {saveSuccess && <div className="adm-success">{saveSuccess}</div>}

                        <form onSubmit={handleSave}>
                            <div className="adm-field">
                                <label className="adm-label">Title *</label>
                                <input
                                    className="adm-input"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g. Golden Hour in Galle"
                                    required
                                />
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Slug *</label>
                                <input
                                    className="adm-input"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="golden-hour-in-galle"
                                    required
                                />
                                <span className="adm-field-hint">/portfolio/{slug || 'your-slug'}</span>
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Category *</label>
                                <select
                                    className="adm-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Display Order</label>
                                <input
                                    className="adm-input"
                                    type="number"
                                    value={displayOrder}
                                    onChange={(e) => setDisplayOrder(e.target.value)}
                                    min="0"
                                />
                                <span className="adm-field-hint">Lower numbers appear first in the portfolio grid</span>
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Published</label>
                                <div className="adm-toggle-row">
                                    <div>
                                        <div className="adm-toggle-label">Visible on public site</div>
                                        <div className="adm-toggle-sub">
                                            {isPublished ? 'This album is live and visible to visitors.' : 'This album is a draft — only you can see it.'}
                                        </div>
                                    </div>
                                    <label className="adm-toggle">
                                        <input
                                            type="checkbox"
                                            checked={isPublished}
                                            onChange={(e) => setIsPublished(e.target.checked)}
                                        />
                                        <span className="adm-toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="adm-field">
                                <label className="adm-label">Cover Image *</label>
                                <ImageUploader
                                    key={coverUrl || 'empty'}
                                    token={token}
                                    initialUrl={coverUrl}
                                    onUploaded={setCoverUrl}
                                />
                                {!coverUrl && <span className="adm-field-hint adm-field-hint--warn">A cover image is required to save the album.</span>}
                            </div>

                            <button
                                type="submit"
                                className="adm-btn adm-btn-primary adm-btn-full"
                                disabled={saving || !coverUrl}
                            >
                                {saving ? 'Saving...' : isNew ? 'Create Album' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── RIGHT: Photos (edit mode only) ─────────────────── */}
                {!isNew && albumId && (
                    <div className="adm-editor-right">
                        <div className="adm-card">
                            <h2 className="adm-editor-section-title">
                                Photos
                                <span className="adm-photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
                            </h2>

                            {photoError && <div className="adm-error">{photoError}</div>}

                            {/* Photo grid */}
                            {photos.length === 0 ? (
                                <p className="adm-photos-empty">No photos yet. Add your first photo below.</p>
                            ) : (
                                <div className="adm-photo-grid">
                                    {photos.map((photo, index) => (
                                        <div key={photo.id} className="adm-photo-tile">
                                            <img src={photo.url} alt={photo.alt_text || `Photo ${index + 1}`} />

                                            {/* Order controls */}
                                            <div className="adm-photo-order-btns">
                                                <button
                                                    className="adm-photo-order-btn"
                                                    onClick={() => handleMove(index, -1)}
                                                    disabled={index === 0}
                                                    title="Move up"
                                                >▲</button>
                                                <span className="adm-photo-index">{index + 1}</span>
                                                <button
                                                    className="adm-photo-order-btn"
                                                    onClick={() => handleMove(index, 1)}
                                                    disabled={index === photos.length - 1}
                                                    title="Move down"
                                                >▼</button>
                                            </div>

                                            {/* Delete */}
                                            {confirmDeletePhotoId === photo.id ? (
                                                <div className="adm-photo-confirm">
                                                    <button className="adm-photo-confirm-yes" onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
                                                    <button className="adm-photo-confirm-no" onClick={() => setConfirmDeletePhotoId(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <button className="adm-photo-delete-btn" onClick={() => setConfirmDeletePhotoId(photo.id)} title="Delete photo">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add photo section */}
                            <div className="adm-add-photo">
                                <h3 className="adm-add-photo-title">Add a Photo</h3>
                                <ImageUploader
                                    token={token}
                                    onUploaded={(url) => setNewPhotoUrl(url)}
                                    key={photos.length} /* reset uploader after each add */
                                />
                                <div className="adm-field" style={{ marginTop: '14px' }}>
                                    <label className="adm-label">Alt text (optional)</label>
                                    <input
                                        className="adm-input"
                                        value={newPhotoAlt}
                                        onChange={(e) => setNewPhotoAlt(e.target.value)}
                                        placeholder="Brief description for accessibility & SEO"
                                    />
                                </div>
                                <button
                                    className="adm-btn adm-btn-primary adm-btn-full"
                                    onClick={handleAddPhoto}
                                    disabled={!newPhotoUrl || addingPhoto}
                                >
                                    {addingPhoto ? 'Adding...' : 'Add to Album'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create mode — show message instead of photo panel */}
                {isNew && (
                    <div className="adm-editor-right">
                        <div className="adm-card adm-new-mode-hint">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--adm-border)' }}>
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p>Save the album details first, then you'll be able to add photos here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
