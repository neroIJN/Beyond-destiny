import React, { useEffect, useState, useRef } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthContext';
import ImageUploader from '../../components/admin/ImageUploader';
import {
    adminListTeamMembers,
    adminCreateTeamMember,
    adminUpdateTeamMember,
    adminDeleteTeamMember,
    adminGetSettings,
    adminUpdateSettings,
} from '../../lib/api';
import './AdminTeamMembers.css';

export default function AdminTeamMembers() {
    const { token } = useAdminAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Inline edit
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    // Delete confirm
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Toggling active
    const [togglingId, setTogglingId] = useState(null);

    // Drag-and-drop reorder
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const dragIndexRef = useRef(null);
    const dragNodeRef = useRef(null);

    // Add form
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    // Global toggle for "Meet The Team" section
    const [showTeamSection, setShowTeamSection] = useState(true);
    const [togglingGlobal, setTogglingGlobal] = useState(false);

    useEffect(() => {
        adminListTeamMembers(token)
            .then(setMembers)
            .catch(() => setError('Failed to load team members.'));
        
        adminGetSettings(token)
            .then(data => {
                if (data && data.show_team_section !== undefined) {
                    setShowTeamSection(data.show_team_section === 'true');
                }
            })
            .catch(() => {});
            
        setLoading(false);
    }, [token]);

    // ── Add ────────────────────────────────────────────────────────────────────

    async function handleAdd() {
        if (!newImageUrl) { setAddError('Please upload a photo first.'); return; }
        if (!newName.trim()) { setAddError('Name is required.'); return; }
        if (!newRole.trim()) { setAddError('Role is required.'); return; }
        setAdding(true);
        setAddError('');
        try {
            const member = await adminCreateTeamMember(token, {
                name: newName.trim(),
                role: newRole.trim(),
                image_url: newImageUrl,
                display_order: members.length,
            });
            setMembers(prev => [...prev, member]);
            setNewName('');
            setNewRole('');
            setNewImageUrl('');
        } catch {
            setAddError('Failed to add team member. Try again.');
        } finally {
            setAdding(false);
        }
    }

    // ── Edit ───────────────────────────────────────────────────────────────────

    function startEdit(member) {
        setEditingId(member.id);
        setEditForm({ name: member.name, role: member.role, image_url: member.image_url });
    }

    async function handleSaveEdit(member) {
        setSaving(true);
        try {
            const updated = await adminUpdateTeamMember(token, member.id, {
                name: editForm.name,
                role: editForm.role,
                image_url: editForm.image_url,
                display_order: member.display_order,
                is_active: member.is_active,
            });
            setMembers(prev => prev.map(m => m.id === member.id ? updated : m));
            setEditingId(null);
        } catch {
            // silently ignore
        } finally {
            setSaving(false);
        }
    }

    // ── Toggle active ──────────────────────────────────────────────────────────

    async function handleToggleActive(member) {
        setTogglingId(member.id);
        try {
            const updated = await adminUpdateTeamMember(token, member.id, {
                name: member.name,
                role: member.role,
                image_url: member.image_url,
                display_order: member.display_order,
                is_active: !member.is_active,
            });
            setMembers(prev => prev.map(m => m.id === member.id ? updated : m));
        } catch {
            // silently ignore
        } finally {
            setTogglingId(null);
        }
    }

    // ── ▲▼ Move ────────────────────────────────────────────────────────────────

    async function handleMove(index, direction) {
        const newMembers = [...members];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newMembers.length) return;
        [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
        const updated = newMembers.map((m, i) => ({ ...m, display_order: i }));
        setMembers(updated);
        try {
            await Promise.all([
                adminUpdateTeamMember(token, updated[index].id, {
                    name: updated[index].name, role: updated[index].role,
                    image_url: updated[index].image_url,
                    display_order: updated[index].display_order, is_active: updated[index].is_active,
                }),
                adminUpdateTeamMember(token, updated[targetIndex].id, {
                    name: updated[targetIndex].name, role: updated[targetIndex].role,
                    image_url: updated[targetIndex].image_url,
                    display_order: updated[targetIndex].display_order, is_active: updated[targetIndex].is_active,
                }),
            ]);
        } catch { /* silently ignore */ }
    }

    // ── Global Settings ────────────────────────────────────────────────────────

    async function handleToggleShowTeam() {
        const newValue = !showTeamSection;
        setTogglingGlobal(true);
        try {
            await adminUpdateSettings(token, { show_team_section: String(newValue) });
            setShowTeamSection(newValue);
        } catch {
            // silently ignore
        } finally {
            setTogglingGlobal(false);
        }
    }

    // ── Drag-and-drop ──────────────────────────────────────────────────────────

    function handleDragStart(e, index) {
        dragIndexRef.current = index;
        dragNodeRef.current = e.currentTarget;
        setTimeout(() => { dragNodeRef.current?.classList.add('tm-member-row--dragging'); }, 0);
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
        const reordered = [...members];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(dropIndex, 0, moved);
        const withNewOrder = reordered.map((m, i) => ({ ...m, display_order: i }));
        setMembers(withNewOrder);
        setDragOverIndex(null);
        setSavingOrder(true);
        try {
            await Promise.all(withNewOrder.map(m =>
                adminUpdateTeamMember(token, m.id, {
                    name: m.name, role: m.role, image_url: m.image_url,
                    display_order: m.display_order, is_active: m.is_active,
                })
            ));
        } catch { /* silently ignore */ }
        finally { setSavingOrder(false); }
    }

    function handleDragEnd() {
        dragNodeRef.current?.classList.remove('tm-member-row--dragging');
        dragIndexRef.current = null;
        dragNodeRef.current = null;
        setDragOverIndex(null);
    }

    function handleDragLeave(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragOverIndex(null);
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    async function handleDelete(id) {
        setDeletingId(id);
        setError('');
        try {
            await adminDeleteTeamMember(token, id);
            setMembers(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete team member.');
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    }

    return (
        <div className="adm-quotes">
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">Team Members</h1>
                    {!loading && (
                        <p className="adm-page-subtitle">
                            {members.length} member{members.length !== 1 ? 's' : ''}
                            {savingOrder && <span className="tm-saving-indicator">Saving order…</span>}
                        </p>
                    )}
                </div>
                {!loading && (
                    <div className="tm-global-toggle-container">
                        <div className="tm-global-toggle-label">
                            <span className="tm-toggle-title">Show on About Page</span>
                            <p className="tm-toggle-desc">Toggle the "Meet The Team" section visibility</p>
                        </div>
                        <button 
                            className={`tm-global-toggle ${showTeamSection ? 'tm-global-toggle--on' : 'tm-global-toggle--off'}`}
                            onClick={handleToggleShowTeam}
                            disabled={togglingGlobal}
                        >
                            <div className="tm-toggle-switch"></div>
                            <span className="tm-toggle-text">{showTeamSection ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="adm-error">{error}</div>}
            {loading && <p className="adm-loading-text">Loading team members…</p>}

            {!loading && (
                <>
                    {/* Member list */}
                    {members.length === 0 && (
                        <div className="tm-empty-state">
                            <svg className="tm-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <h3 className="tm-empty-title">No team members yet</h3>
                            <p className="tm-empty-body">
                                Run the migration to seed the 3 default team members, or add them manually below.
                            </p>
                            <pre className="tm-empty-code">psql $DATABASE_URL &lt; backend/db/migrations/005_create_team_members.sql</pre>
                        </div>
                    )}

                    {members.length > 0 && (
                        <div className="tm-member-list" onDragLeave={handleDragLeave}>
                            {members.map((member, index) => (
                                <div key={member.id}>
                                    <div
                                        className={[
                                            'tm-member-row',
                                            !member.is_active ? 'tm-member-row--inactive' : '',
                                            dragOverIndex === index ? 'tm-member-row--drag-over' : '',
                                        ].filter(Boolean).join(' ')}
                                        draggable
                                        onDragStart={e => handleDragStart(e, index)}
                                        onDragOver={e => handleDragOver(e, index)}
                                        onDrop={e => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="tm-drag-handle" title="Drag to reorder">
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                <circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/>
                                                <circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
                                                <circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
                                            </svg>
                                        </div>
                                        <span className="tm-order-badge">#{index + 1}</span>
                                        <div className="tm-avatar">
                                            <img src={member.image_url} alt={member.name} />
                                        </div>
                                        <div className="tm-member-info">
                                            <span className="tm-member-name">{member.name}</span>
                                            <span className="tm-member-role">{member.role}</span>
                                        </div>
                                        <span className={`adm-badge ${member.is_active ? 'adm-badge-published' : 'adm-badge-draft'}`}>
                                            {member.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                        <div className="tm-member-actions">
                                            <button className="tm-order-btn" onClick={() => handleMove(index, -1)} disabled={index === 0} title="Move up">▲</button>
                                            <button className="tm-order-btn" onClick={() => handleMove(index, 1)} disabled={index === members.length - 1} title="Move down">▼</button>
                                            <button
                                                className="adm-btn adm-btn-ghost"
                                                onClick={() => editingId === member.id ? setEditingId(null) : startEdit(member)}
                                            >
                                                {editingId === member.id ? 'Cancel' : 'Edit'}
                                            </button>
                                            <button
                                                className="adm-btn adm-btn-ghost"
                                                onClick={() => handleToggleActive(member)}
                                                disabled={togglingId === member.id}
                                            >
                                                {togglingId === member.id ? 'Saving…' : member.is_active ? 'Hide' : 'Show'}
                                            </button>
                                            {confirmDeleteId === member.id ? (
                                                <>
                                                    <button
                                                        className="adm-btn tm-btn-danger"
                                                        onClick={() => handleDelete(member.id)}
                                                        disabled={deletingId === member.id}
                                                    >
                                                        {deletingId === member.id ? 'Deleting…' : 'Confirm'}
                                                    </button>
                                                    <button className="adm-btn adm-btn-ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <button className="adm-btn tm-btn-danger-ghost" onClick={() => setConfirmDeleteId(member.id)}>Delete</button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inline edit panel */}
                                    {editingId === member.id && (
                                        <div className="tm-edit-panel">
                                            <div className="tm-edit-grid">
                                                <ImageUploader
                                                    token={token}
                                                    onUploaded={url => setEditForm(f => ({ ...f, image_url: url }))}
                                                    initialUrl={editForm.image_url}
                                                />
                                                <div className="tm-edit-fields">
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Name</label>
                                                        <input
                                                            className="adm-input"
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="adm-form-group">
                                                        <label className="adm-form-label">Role / Title</label>
                                                        <input
                                                            className="adm-input"
                                                            type="text"
                                                            value={editForm.role}
                                                            onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                                                        />
                                                    </div>
                                                    <button
                                                        className="adm-btn adm-btn-primary"
                                                        onClick={() => handleSaveEdit(member)}
                                                        disabled={saving}
                                                    >
                                                        {saving ? 'Saving…' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new member */}
                    <div className="tm-add-section">
                        <h2 className="adm-section-title">Add Team Member</h2>
                        <div className="tm-add-form">
                            <ImageUploader
                                token={token}
                                onUploaded={setNewImageUrl}
                                initialUrl={newImageUrl}
                            />
                            <div className="tm-add-fields">
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Full Name</label>
                                    <input
                                        className="adm-input"
                                        type="text"
                                        placeholder="e.g. Ashen Perera"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                    />
                                </div>
                                <div className="adm-form-group">
                                    <label className="adm-form-label">Role / Title</label>
                                    <input
                                        className="adm-input"
                                        type="text"
                                        placeholder="e.g. Lead Photographer"
                                        value={newRole}
                                        onChange={e => setNewRole(e.target.value)}
                                    />
                                </div>
                                {addError && <p className="adm-error" style={{ marginTop: 0 }}>{addError}</p>}
                                <button
                                    className="adm-btn adm-btn-primary"
                                    onClick={handleAdd}
                                    disabled={adding}
                                >
                                    {adding ? 'Adding…' : 'Add Member'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
