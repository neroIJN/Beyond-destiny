import React, { useState, useRef } from 'react';
import { adminUploadImage } from '../../lib/api';
import './ImageUploader.css';

/**
 * ImageUploader — self-contained file upload widget.
 *
 * Props:
 *   token      (string)   — JWT token for the admin API
 *   onUploaded (function) — called with the public URL once upload succeeds
 *   initialUrl (string)   — optional existing image URL to display on mount
 */
export default function ImageUploader({ token, onUploaded, initialUrl = '' }) {
    const [status, setStatus] = useState(initialUrl ? 'done' : 'idle'); // idle | uploading | done | error
    const [previewUrl, setPreviewUrl] = useState(initialUrl);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setStatus('uploading');
        setErrorMsg('');

        try {
            const data = await adminUploadImage(token, file);
            setPreviewUrl(data.url);
            setStatus('done');
            onUploaded(data.url);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Upload failed. Try again.');
            setPreviewUrl('');
        }

        // Reset file input so same file can be re-selected after error
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleReset = () => {
        setStatus('idle');
        setPreviewUrl('');
        setErrorMsg('');
        onUploaded('');
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleClick = () => {
        if (status !== 'uploading') inputRef.current?.click();
    };

    return (
        <div className="img-uploader">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {/* Idle state */}
            {status === 'idle' && (
                <div className="img-uploader-zone" onClick={handleClick}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                    <span className="img-uploader-hint">Click to choose or drag a photo here</span>
                    <span className="img-uploader-hint-sub">JPEG, PNG, WebP — max 20MB</span>
                </div>
            )}

            {/* Uploading state */}
            {status === 'uploading' && (
                <div className="img-uploader-preview">
                    {previewUrl && <img src={previewUrl} alt="Uploading preview" />}
                    <div className="img-uploader-overlay">
                        <div className="img-uploader-spinner" />
                        <span>Uploading...</span>
                    </div>
                </div>
            )}

            {/* Done state */}
            {status === 'done' && (
                <div className="img-uploader-preview">
                    <img src={previewUrl} alt="Uploaded" />
                    <div className="img-uploader-done-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <button className="img-uploader-change" onClick={handleReset} title="Change image">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    <span className="img-uploader-ready">Ready to save</span>
                </div>
            )}

            {/* Error state */}
            {status === 'error' && (
                <div className="img-uploader-zone img-uploader-zone--error" onClick={handleClick}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span className="img-uploader-hint" style={{ color: 'var(--adm-danger)' }}>{errorMsg}</span>
                    <span className="img-uploader-hint-sub">Click to try again</span>
                </div>
            )}
        </div>
    );
}
