import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';
import { fetchAlbums, fetchAlbumCategories } from '../lib/api';
import './Portfolio.css';

const Portfolio = () => {
    const [categories, setCategories] = useState(['All', 'Weddings', 'Engagements', 'Editorial', 'Pre-Shoots']);
    const [activeFilter, setActiveFilter] = useState('All');
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlbumCategories()
            .then(data => { if (data?.length) setCategories(['All', ...data.map(c => c.name)]); })
            .catch(() => {}); // keep hardcoded fallback on error
        fetchAlbums()
            .then(setPortfolioItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeFilter === 'All'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);

    return (
        <motion.div
            className="portfolio-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="portfolio-hero">
                <div className="container">
                    <span className="label-text">Our Work</span>
                    <h1>Portfolio</h1>
                    <div className="gold-rule"></div>
                </div>
            </section>

            <Reveal>
                <section className="portfolio-content">
                    <div className="container">
                        <div className="filter-tabs">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading...</div>
                        ) : (
                            <div className="portfolio-masonry">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="portfolio-item"
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <Link
                                                to={`/portfolio/${item.slug}`}
                                                className="portfolio-link-wrap"
                                                style={{textDecoration: 'none', display: 'block'}}
                                                onClick={() => window.scrollTo(0, 0)}
                                            >
                                                <div className="portfolio-image-wrap">
                                                    <img src={item.cover_image_url} alt={item.title} />
                                                    <div className="portfolio-overlay">
                                                        <span className="gold-pill">{item.category}</span>
                                                        <h3>{item.title}</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>
            </Reveal>

            <Footer />
        </motion.div>
    );
};

export default Portfolio;
