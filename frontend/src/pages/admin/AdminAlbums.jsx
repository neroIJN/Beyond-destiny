import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminListAlbums, adminDeleteAlbum } from '../../lib/api';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import './AdminAlbums.css';

export default function AdminAlbums() {
    const { token } = useAdminAuth();
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = () => {
        setLoading(true);
        adminListAlbums(token)
            .then(setAlbums)
            .catch(() => setError('Failed to load albums.'))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await adminDeleteAlbum(token, id);
            setAlbums(prev => prev.filter(a => a.id !== id));
            setConfirmDeleteId(null);
        } catch {
            setError('Failed to delete album.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="adm-albums">
            <div className="adm-page-header">
                <h1 className="adm-page-title">Albums</h1>
                <Link to="/admin/albums/new" className="adm-btn adm-btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add New Album
                </Link>
            </div>

            {error && <div className="adm-error">{error}</div>}

            {loading ? (
                <p className="adm-loading-text">Loading albums...</p>
            ) : albums.length === 0 ? (
                <div className="adm-card adm-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--adm-border)', marginBottom: '12px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>No albums yet. Create your first one!</p>
                    <Link to="/admin/albums/new" className="adm-btn adm-btn-primary" style={{ marginTop: '16px' }}>
                        Add New Album
                    </Link>
                </div>
            ) : (
                <div className="adm-album-list">
                    {albums.map(album => (
                        <div key={album.id} className="adm-album-row">
                            {/* Thumbnail */}
                            <div className="adm-album-thumb">
                                <img
                                    src={album.cover_image_url}
                                    alt={album.title}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>

                            {/* Info */}
                            <div className="adm-album-info">
                                <span className="adm-album-name">{album.title}</span>
                                <div className="adm-album-meta">
                                    <span className="adm-album-cat">{album.category}</span>
                                    <span className="adm-album-order">Order: {album.display_order}</span>
                                </div>
                            </div>

                            {/* Status badge */}
                            <span className={`adm-badge ${album.is_published ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                {album.is_published ? 'Published' : 'Draft'}
                            </span>

                            {/* Actions */}
                            <div className="adm-album-actions">
                                {confirmDeleteId === album.id ? (
                                    <div className="adm-confirm-delete">
                                        <span className="adm-confirm-text">Delete this album?</span>
                                        <button
                                            className="adm-btn adm-btn-danger"
                                            onClick={() => handleDelete(album.id)}
                                            disabled={deleting}
                                        >
                                            {deleting ? 'Deleting...' : 'Yes, delete'}
                                        </button>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => setConfirmDeleteId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            className="adm-btn adm-btn-ghost"
                                            onClick={() => navigate(`/admin/albums/${album.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="adm-btn adm-btn-danger"
                                            onClick={() => setConfirmDeleteId(album.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
