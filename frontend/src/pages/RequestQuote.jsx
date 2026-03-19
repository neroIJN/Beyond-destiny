import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';
import { submitQuote } from '../lib/api';
import './RequestQuote.css';

const RequestQuote = () => {
    const [activeTab, setActiveTab] = useState('Weddings');
    const [formData, setFormData] = useState({
        names: '',
        email: '',
        phone: '',
        eventDate: '',
        eventVenue: '',
        hearAboutUs: '',
        budget: '',
        message: ''
    });

    const getDynamicLabels = () => {
        switch (activeTab) {
            case 'Weddings':
                return { date: 'Wedding Date *', venue: 'Wedding Venue *', vision: 'Tell us about your wedding vision & yourselves *' };
            case 'Engagements':
                return { date: 'Engagement Date *', venue: 'Engagement Location *', vision: 'Tell us about your engagement vision & yourselves *' };
            case 'Pre-shoots':
                return { date: 'Preferred Date *', venue: 'Preferred Location *', vision: 'Tell us about your shoot vision & yourselves *' };
            default:
                return { date: 'Event Date *', venue: 'Event Venue *', vision: 'Tell us about your vision & yourselves *' };
        }
    };
    
    const labels = getDynamicLabels();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

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
            await submitQuote({
                names: formData.names,
                email: formData.email,
                phone: formData.phone,
                event_type: activeTab,
                event_date: formData.eventDate,
                event_venue: formData.eventVenue,
                budget: formData.budget,
                hear_about_us: formData.hearAboutUs,
                message: formData.message,
            });
            setSubmitted(true);
            setFormData({ names: '', email: '', phone: '', eventDate: '', eventVenue: '', hearAboutUs: '', budget: '', message: '' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="request-quote-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="quote-hero">
                <div className="container">
                    <span className="label-text">Experience</span>
                    <h1>Request a <em>Quote</em></h1>
                    <div className="gold-rule"></div>
                </div>
            </section>

            <section className="quote-content section-padding" style={{ paddingTop: 0 }}>
                <div className="container">
                    <Reveal>
                        <div className="quote-wrapper">
                            <div className="quote-details">
                                <h2>Your Vision, <br/><em>Our Canvas</em></h2>
                                <p>
                                    We believe your story deserves to be told with authenticity and artistry. 
                                    Please share the details of your upcoming celebration, and we will curate 
                                    a custom proposal tailored to your unique requirements.
                                </p>

                                <div className="quote-packages">
                                    <div className="package-item">
                                        <h3><span className="accent-pill">01</span> Weddings & Elopements</h3>
                                        <p>Comprehensive, artistic documentation of your most significant day.</p>
                                    </div>
                                    <div className="package-item">
                                        <h3><span className="accent-pill">02</span> Engagement Sessions</h3>
                                        <p>Natural, editorial-style portraits celebrating your connection.</p>
                                    </div>
                                    <div className="package-item">
                                        <h3><span className="accent-pill">03</span> Casual & Editorial</h3>
                                        <p>Stylized lifestyle imagery for families, individuals, and brands.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-form-container">
                                <div className="quote-tabs">
                                    {['Weddings', 'Engagements', 'Pre-shoots'].map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            className={`quote-tab ${activeTab === tab ? 'active' : ''}`}
                                            onClick={() => handleTabChange(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {submitted && (
                                    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'serif', color: '#c9a96e' }}>
                                        <p style={{ fontSize: '1.2rem' }}>Quote request received! We'll get back to you within 24 hours.</p>
                                    </div>
                                )}
                                {error && (
                                    <p style={{ color: '#e55', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
                                )}
                                {!submitted && <form className="quote-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <input type="text" id="rq-names" name="names" value={formData.names} onChange={handleChange} placeholder=" " required />
                                            <label htmlFor="rq-names">Couple's / Your Names *</label>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <input type="email" id="rq-email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
                                            <label htmlFor="rq-email">Email Address *</label>
                                        </div>
                                        <div className="form-group">
                                            <input type="tel" id="rq-phone" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " />
                                            <label htmlFor="rq-phone">Phone Number</label>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <input type="date" id="rq-date" name="eventDate" value={formData.eventDate} onChange={handleChange} placeholder=" " required />
                                            <label htmlFor="rq-date" className="date-label">{labels.date}</label>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="rq-venue" name="eventVenue" value={formData.eventVenue} onChange={handleChange} placeholder=" " required />
                                            <label htmlFor="rq-venue">{labels.venue}</label>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <select id="rq-budget" name="budget" value={formData.budget} onChange={handleChange} required>
                                                <option value="" disabled hidden></option>
                                                <option value="Under $2k">Under $2,000</option>
                                                <option value="$2k - $4k">$2,000 - $4,000</option>
                                                <option value="$4k - $6k">$4,000 - $6,000</option>
                                                <option value="$6k+">$6,000+</option>
                                                <option value="Not Sure">Not Sure Yet</option>
                                            </select>
                                            <label htmlFor="rq-budget" className="select-label">Photography Budget *</label>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="rq-hear" name="hearAboutUs" value={formData.hearAboutUs} onChange={handleChange} placeholder=" " />
                                            <label htmlFor="rq-hear">How did you hear about us?</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <textarea id="rq-message" name="message" value={formData.message} onChange={handleChange} placeholder=" " rows="5" required></textarea>
                                        <label htmlFor="rq-message">{labels.vision}</label>
                                    </div>

                                    <button type="submit" className="btn-accent" style={{ marginTop: '1rem', width: '100%' }} disabled={submitting}>
                                        {submitting ? 'Sending...' : 'Request a Quote'}
                                    </button>
                                </form>}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
            
            <Footer />
        </motion.div>
    );
};

export default RequestQuote;
