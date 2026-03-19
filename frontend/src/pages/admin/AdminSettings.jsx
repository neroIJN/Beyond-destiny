import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import { adminGetSettings, adminUpdateSettings } from '../../lib/api';
import './AdminSettings.css';

const SETTING_FIELDS = [
    {
        group: 'Contact Information',
        fields: [
            { key: 'contact_email', label: 'Email Address', type: 'email', placeholder: 'info@example.com' },
            { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+94 77 456 7890' },
            { key: 'contact_address', label: 'Studio Address', type: 'text', placeholder: '42 Light Avenue, Colombo 03' },
            { key: 'contact_hours', label: 'Opening Hours', type: 'text', placeholder: 'Mon – Sat: 9AM – 6PM' },
        ]
    },
    {
        group: 'Homepage Hero Text',
        fields: [
            { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'CAPTURED MOMENTS' },
            { key: 'hero_tagline', label: 'Hero Tagline', type: 'text', placeholder: 'Crafted with passion, from the heart' },
        ]
    },
    {
        group: 'About Page — Images',
        fields: [
            { key: 'about_hero_image_url',  label: 'About Hero Image',    type: 'image' },
            { key: 'about_story_image_url', label: 'Story Section Image', type: 'image' },
        ]
    },
    {
        group: 'About Page — Story Text',
        fields: [
            { key: 'about_story_p1', label: 'Story Paragraph 1', type: 'textarea', placeholder: 'Founded in the heart of Sri Lanka…' },
            { key: 'about_story_p2', label: 'Story Paragraph 2', type: 'textarea', placeholder: 'We believe that every love story…' },
        ]
    },
    {
        group: 'About Page — Philosophy Cards',
        fields: [
            { key: 'about_phil1_title', label: 'Card 1 Title',       type: 'text',     placeholder: 'Authentic Emotion' },
            { key: 'about_phil1_desc',  label: 'Card 1 Description', type: 'textarea', placeholder: 'We capture raw, unscripted moments…' },
            { key: 'about_phil2_title', label: 'Card 2 Title',       type: 'text',     placeholder: 'Editorial Elegance' },
            { key: 'about_phil2_desc',  label: 'Card 2 Description', type: 'textarea', placeholder: 'Magazine-worthy compositions…' },
            { key: 'about_phil3_title', label: 'Card 3 Title',       type: 'text',     placeholder: 'Timeless Beauty' },
            { key: 'about_phil3_desc',  label: 'Card 3 Description', type: 'textarea', placeholder: 'Images that will feel as fresh…' },
        ]
    },
];

export default function AdminSettings() {
    const { token } = useAdminAuth();
    const [values, setValues] = useState({});
    const [original, setOriginal] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        adminGetSettings(token)
            .then(data => {
                setValues(data);
                setOriginal(data);
            })
            .catch(() => setError('Failed to load settings.'))
            .finally(() => setLoading(false));
    }, [token]);

    function handleChange(key, value) {
        setSaveSuccess(false);
        setValues(prev => ({ ...prev, [key]: value }));
    }

    async function handleSave() {
        setSaving(true);
        setSaveSuccess(false);
        setError('');
        try {
            await adminUpdateSettings(token, values);
            setOriginal(values);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch {
            setError('Failed to save settings. Try again.');
        } finally {
            setSaving(false);
        }
    }

    const hasChanges = Object.keys(values).some(k => values[k] !== original[k]);

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Site Settings</h1>
                    <p className="adm-page-subtitle">Contact info and homepage text shown on the public website</p>
                </div>
                <button
                    className="adm-btn adm-btn-primary"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                >
                    {saving ? 'Saving…' : 'Save All'}
                </button>
            </div>

            {saveSuccess && (
                <div className="adms-success-banner">Settings saved successfully.</div>
            )}
            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading settings…</p>}

            {!loading && (
                <div className="adms-form">
                    {SETTING_FIELDS.map(group => (
                        <div key={group.group} className="adms-group">
                            <h2 className="adm-section-title">{group.group}</h2>
                            <div className="adms-group-card">
                                {group.fields.map(field => (
                                    <div key={field.key} className="adms-field">
                                        <label className="adms-label" htmlFor={`setting-${field.key}`}>
                                            {field.label}
                                        </label>
                                        {field.type === 'image' ? (
                                            <div className={`adms-image-field${values[field.key] !== original[field.key] ? ' adms-image-field--changed' : ''}`}>
                                                <ImageUploader
                                                    token={token}
                                                    initialUrl={values[field.key] || ''}
                                                    onUploaded={url => handleChange(field.key, url)}
                                                />
                                            </div>
                                        ) : field.type === 'textarea' ? (
                                            <textarea
                                                id={`setting-${field.key}`}
                                                className={`adm-input adms-textarea${values[field.key] !== original[field.key] ? ' adms-input--changed' : ''}`}
                                                rows={3}
                                                value={values[field.key] || ''}
                                                placeholder={field.placeholder}
                                                onChange={e => handleChange(field.key, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                id={`setting-${field.key}`}
                                                className={`adm-input${values[field.key] !== original[field.key] ? ' adms-input--changed' : ''}`}
                                                type={field.type}
                                                value={values[field.key] || ''}
                                                placeholder={field.placeholder}
                                                onChange={e => handleChange(field.key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="adms-actions">
                        <button
                            className="adm-btn adm-btn-primary"
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                        >
                            {saving ? 'Saving…' : 'Save All'}
                        </button>
                        {!hasChanges && !saving && (
                            <span className="adms-no-changes">No unsaved changes</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
