import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';
import { submitContact, fetchSiteSettings } from '../lib/api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        venue: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [settings, setSettings] = useState({
        contact_email: 'Info@LenseroStudios.Com',
        contact_phone: '+94 77 456 7890',
        contact_address: '42 Light Avenue, Colombo 03, Sri Lanka',
        contact_hours: 'Mon – Sat: 9AM – 6PM',
    });

    useEffect(() => {
        fetchSiteSettings()
            .then(data => setSettings(prev => ({ ...prev, ...data })))
            .catch(() => {}); // fall back to defaults
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await submitContact({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                wedding_date: formData.weddingDate,
                venue: formData.venue,
                message: formData.message,
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', weddingDate: '', venue: '', message: '' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="contact-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="contact-page-hero">
                <div className="container">
                    <span className="label-text">Get in Touch</span>
                    <h1>Let's Create <em>Together</em></h1>
                    <div className="gold-rule"></div>
                </div>
            </section>

            <Reveal>
                <section className="contact-page-content">
                    <div className="contact-page-wrapper">
                        {/* Left — Details Panel */}
                        <div className="contact-details-panel">
                            <h2>We'd Love to <em>Hear From You</em></h2>
                            <p className="contact-page-intro">
                                Every love story is unique and we'd love to hear yours. Whether you're planning
                                an intimate elopement or a grand celebration, let's connect and craft something
                                extraordinary together.
                            </p>

                            <div className="contact-info-grid">
                                <div className="info-item">
                                    <span className="info-label">Email</span>
                                    <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Phone</span>
                                    <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}>{settings.contact_phone}</a>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Studio</span>
                                    <p>{settings.contact_address}</p>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Hours</span>
                                    <p>{settings.contact_hours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right — Form Panel */}
                        <div className="contact-form-panel">
                            {submitted && (
                                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'serif', color: '#c9a96e' }}>
                                    <p style={{ fontSize: '1.2rem' }}>Thank you! We'll be in touch soon.</p>
                                </div>
                            )}
                            {error && (
                                <p style={{ color: '#e55', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
                            )}
                            {!submitted && (
                            <form className="contact-page-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <input type="text" id="cp-name" name="name" value={formData.name} onChange={handleChange} placeholder=" " required />
                                        <label htmlFor="cp-name">Your Name</label>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" id="cp-email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
                                        <label htmlFor="cp-email">Email Address</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <input type="tel" id="cp-phone" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " />
                                        <label htmlFor="cp-phone">Phone Number</label>
                                    </div>
                                    <div className="form-group">
                                        <input type="date" id="cp-date" name="weddingDate" value={formData.weddingDate} onChange={handleChange} placeholder=" " />
                                        <label htmlFor="cp-date">Wedding Date</label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <input type="text" id="cp-venue" name="venue" value={formData.venue} onChange={handleChange} placeholder=" " />
                                    <label htmlFor="cp-venue">Wedding Venue</label>
                                </div>

                                <div className="form-group">
                                    <textarea id="cp-message" name="message" value={formData.message} onChange={handleChange} placeholder=" " rows="4" required></textarea>
                                    <label htmlFor="cp-message">Tell Us About Your Day</label>
                                </div>

                                <button type="submit" className="btn-accent" style={{ marginTop: '1rem', width: '100%' }} disabled={submitting}>
                                    {submitting ? 'Sending...' : 'Send Your Story'}
                                </button>
                            </form>
                            )}
                        </div>
                    </div>
                </section>
            </Reveal>

            <Footer />
        </motion.div>
    );
};

export default Contact;
