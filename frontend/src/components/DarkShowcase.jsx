import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { fetchShowcaseItems } from '../lib/api';
import './DarkShowcase.css';

const DEFAULT_SHOWCASE = [
    {
        image_url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
        title: "The First Look",
        category: "Intimate Moments"
    },
    {
        image_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
        title: "Golden Hour",
        category: "Outdoor Sessions"
    },
    {
        image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        title: "Celebration",
        category: "Wedding Day"
    },
    {
        image_url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=800&q=80",
        title: "Behind The Veil",
        category: "Bridal Portraits"
    },
    {
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        title: "Together Forever",
        category: "Couple Sessions"
    }
];

const DarkShowcase = () => {
    const [showcaseItems, setShowcaseItems] = useState(DEFAULT_SHOWCASE);

    useEffect(() => {
        fetchShowcaseItems()
            .then(data => { if (data && data.length > 0) setShowcaseItems(data); })
            .catch(() => {}); // fall back to defaults
    }, []);

    // Double the items for infinite scroll effect
    const allImages = [...showcaseItems, ...showcaseItems];

    return (
        <section className="dark-showcase">
            <div className="dark-showcase-header">
                <motion.span 
                    className="showcase-eyebrow"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Selected Work
                </motion.span>
                <motion.h2 
                    className="showcase-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Stories We've Told
                </motion.h2>
            </div>

            <div className="showcase-track-container">
                <div className="showcase-track">
                    {allImages.map((item, index) => (
                        <motion.div
                            key={index}
                            className="showcase-item"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="showcase-image-wrap">
                                <img src={item.image_url} alt={item.title} />
                                <div className="showcase-overlay">
                                    <span className="showcase-view">
                                        <HiOutlineArrowRight />
                                    </span>
                                </div>
                                <div className="showcase-grain"></div>
                            </div>
                            <div className="showcase-meta">
                                <span className="showcase-category">{item.category}</span>
                                <h3 className="showcase-item-title">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div 
                className="showcase-cta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <a href="/portfolio" className="showcase-link">
                    View Full Portfolio <HiOutlineArrowRight />
                </a>
            </motion.div>
        </section>
    );
};

export default DarkShowcase;
