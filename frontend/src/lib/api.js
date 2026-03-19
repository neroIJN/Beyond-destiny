const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, options);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || `Request failed: ${res.status}`);
    }
    return data;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function fetchAlbums() {
    return request('/api/albums');
}

export function fetchAlbum(slug) {
    return request(`/api/albums/${slug}`);
}

export function submitContact(data) {
    return request('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export function submitQuote(data) {
    return request('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export function adminLogin(email, password) {
    return request('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
}

function authHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

export function adminUploadImage(token, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
}

export function adminListAlbums(token) {
    return request('/api/admin/albums', { headers: authHeaders(token) });
}

export function adminCreateAlbum(token, data) {
    return request('/api/admin/albums', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateAlbum(token, id, data) {
    return request(`/api/admin/albums/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteAlbum(token, id) {
    return request(`/api/admin/albums/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

export function adminGetAlbumPhotos(token, albumId) {
    return request(`/api/admin/albums/${albumId}/photos`, { headers: authHeaders(token) });
}

export function adminAddPhoto(token, albumId, data) {
    return request(`/api/admin/albums/${albumId}/photos`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeletePhoto(token, albumId, photoId) {
    return request(`/api/admin/albums/${albumId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

export function adminReorderPhotos(token, albumId, photos) {
    return request(`/api/admin/albums/${albumId}/photos/reorder`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ photos }),
    });
}

export function adminListQuotes(token) {
    return request('/api/admin/quote-requests', { headers: authHeaders(token) });
}

export function adminMarkQuoteRead(token, id, isRead) {
    return request(`/api/admin/quote-requests/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ is_read: isRead }),
    });
}

export function adminDeleteQuote(token, id) {
    return request(`/api/admin/quote-requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

export function adminListContacts(token) {
    return request('/api/admin/contact-submissions', { headers: authHeaders(token) });
}

export function adminMarkContactRead(token, id, isRead) {
    return request(`/api/admin/contact-submissions/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ is_read: isRead }),
    });
}

export function adminDeleteContact(token, id) {
    return request(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Public CMS API ───────────────────────────────────────────────────────────

export function fetchHeroSlides() {
    return request('/api/hero-slides');
}

export function fetchTestimonials() {
    return request('/api/testimonials');
}

export function fetchShowcaseItems() {
    return request('/api/showcase');
}

export function fetchSiteSettings() {
    return request('/api/settings');
}

// ─── Admin CMS — Hero Slides ──────────────────────────────────────────────────

export function adminListHeroSlides(token) {
    return request('/api/admin/hero-slides', { headers: authHeaders(token) });
}

export function adminCreateHeroSlide(token, data) {
    return request('/api/admin/hero-slides', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateHeroSlide(token, id, data) {
    return request(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteHeroSlide(token, id) {
    return request(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Admin CMS — Testimonials ─────────────────────────────────────────────────

export function adminListTestimonials(token) {
    return request('/api/admin/testimonials', { headers: authHeaders(token) });
}

export function adminCreateTestimonial(token, data) {
    return request('/api/admin/testimonials', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateTestimonial(token, id, data) {
    return request(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteTestimonial(token, id) {
    return request(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Admin CMS — Showcase Items ───────────────────────────────────────────────

export function adminListShowcaseItems(token) {
    return request('/api/admin/showcase', { headers: authHeaders(token) });
}

export function adminCreateShowcaseItem(token, data) {
    return request('/api/admin/showcase', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateShowcaseItem(token, id, data) {
    return request(`/api/admin/showcase/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteShowcaseItem(token, id) {
    return request(`/api/admin/showcase/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Public CMS — Team Members ────────────────────────────────────────────────

export function fetchTeamMembers() {
    return request('/api/team-members');
}

// ─── Admin CMS — Team Members ─────────────────────────────────────────────────

export function adminListTeamMembers(token) {
    return request('/api/admin/team-members', { headers: authHeaders(token) });
}

export function adminCreateTeamMember(token, data) {
    return request('/api/admin/team-members', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateTeamMember(token, id, data) {
    return request(`/api/admin/team-members/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteTeamMember(token, id) {
    return request(`/api/admin/team-members/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Admin CMS — Site Settings ────────────────────────────────────────────────

export function adminGetSettings(token) {
    return request('/api/admin/settings', { headers: authHeaders(token) });
}

export function adminUpdateSettings(token, updates) {
    return request('/api/admin/settings', {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(updates),
    });
}

// ─── Public — Album Categories ────────────────────────────────────────────────

export function fetchAlbumCategories() {
    return request('/api/album-categories');
}

// ─── Admin — Album Categories ─────────────────────────────────────────────────

export function adminListCategories(token) {
    return request('/api/admin/album-categories', { headers: authHeaders(token) });
}

export function adminCreateCategory(token, data) {
    return request('/api/admin/album-categories', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateCategory(token, id, data) {
    return request(`/api/admin/album-categories/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteCategory(token, id) {
    return request(`/api/admin/album-categories/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}

// ─── Public — Services ────────────────────────────────────────────────────────

export function fetchServices() {
    return request('/api/services');
}

// ─── Admin — Services ─────────────────────────────────────────────────────────

export function adminListServices(token) {
    return request('/api/admin/services', { headers: authHeaders(token) });
}

export function adminCreateService(token, data) {
    return request('/api/admin/services', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminUpdateService(token, id, data) {
    return request(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
}

export function adminDeleteService(token, id) {
    return request(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
}
