import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineArrowRight } from 'react-icons/hi';
import { submitContact } from '../lib/api';
import './ContactSection.css';

const ContactSection = () => {
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
        <section className="contact-section">
            <div className="contact-wrapper">
                {/* Left Panel — Info Card */}
                <motion.div
                    className="contact-left glass-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="contact-eyebrow">Get in Touch</span>
                    <h2 className="contact-title">Let's Create Together</h2>
                    <p className="contact-intro">
                        Every story is unique. Share your vision with us and let's create something beautiful.
                    </p>

                    <div className="contact-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <HiOutlineMail />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Email</span>
                                <a href="mailto:Info@LenseroStudios.Com">Info@LenseroStudios.Com</a>
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <HiOutlinePhone />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Phone</span>
                                <a href="tel:+94774567890">+94 77 456 7890</a>
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-icon">
                                <HiOutlineLocationMarker />
                            </div>
                            <div className="detail-content">
                                <span className="detail-label">Studio</span>
                                <p>Colombo, Sri Lanka</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel — Form */}
                <motion.div
                    className="contact-right"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    {submitted ? (
                        <div className="contact-form glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', textAlign: 'center' }}>
                            <div>
                                <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</p>
                                <p style={{ fontFamily: 'serif', color: '#c9a96e', fontSize: '1.1rem' }}>Thank you! We'll be in touch soon.</p>
                            </div>
                        </div>
                    ) : (
                        <form className="contact-form glass-card" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        id="weddingDate"
                                        name="weddingDate"
                                        value={formData.weddingDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="venue"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Wedding Venue"
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your day..."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            {error && (
                                <p style={{ color: '#e55', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>
                            )}
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? 'Sending...' : <><span>Send Message</span> <HiOutlineArrowRight /></>}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
