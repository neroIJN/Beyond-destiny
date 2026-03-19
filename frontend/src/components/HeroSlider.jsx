import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { HiChevronRight } from 'react-icons/hi2';
import { fetchHeroSlides, fetchSiteSettings } from '../lib/api';
import './HeroSlider.css';

const DEFAULT_SLIDES = [
    {
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85',
        alt_text: 'Couple under London bridge'
    },
    {
        image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2400&q=85',
        alt_text: 'Wedding ceremony'
    },
    {
        image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=2400&q=85',
        alt_text: 'Intimate portrait'
    }
];

const slideVariants = {
    enter: {
        opacity: 0,
        scale: 1.08,
    },
    center: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
        opacity: 0,
        scale: 1.04,
        transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
    }
};

const HeroSlider = () => {
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [heroTitle, setHeroTitle] = useState('CAPTURED MOMENTS');
    const [heroTagline, setHeroTagline] = useState('Crafted with passion, from the heart');
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    useEffect(() => {
        fetchHeroSlides()
            .then(data => { if (data && data.length > 0) setSlides(data); })
            .catch(() => {}); // fall back to defaults
        fetchSiteSettings()
            .then(settings => {
                if (settings.hero_title) setHeroTitle(settings.hero_title);
                if (settings.hero_tagline) setHeroTagline(settings.hero_tagline);
            })
            .catch(() => {}); // fall back to defaults
    }, []);

    const next = useCallback(() => {
        setCurrent(prev => (prev + 1) % total);
    }, [total]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <section className="hero-fullpage">
            {/* Full-screen crossfading slides */}
            <div className="hero-slide-container">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current}
                        className="hero-slide"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        <img src={slides[current].image_url} alt={slides[current].alt_text} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dark overlay */}
            <div className="hero-overlay" />

            {/* Centered content */}
            <div className="hero-overlay-content">
                <motion.div
                    className="hero-heading-group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    <h1 className="hero-main-title">{heroTitle}</h1>
                    <span className="hero-script-title">{heroTagline}</span>
                </motion.div>

                <motion.div
                    className="hero-cta-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                    <Link to="/contact" className="hero-cta-btn">
                        <span>READ MORE</span>
                    </Link>
                </motion.div>
            </div>

            {/* Slide counter — right side */}
            <motion.div
                className="hero-slide-counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                <span className="counter-current">{pad(current + 1)}</span>
                <span className="counter-divider">/</span>
                <span className="counter-total">{pad(total)}</span>
            </motion.div>

            {/* Next arrow — right side */}
            <motion.button
                className="hero-next-btn"
                onClick={next}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ x: 4 }}
                aria-label="Next slide"
            >
                <HiChevronRight />
            </motion.button>

            {/* Social links — bottom left */}
            <motion.div
                className="hero-social-links"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
            >
                <a href="#" aria-label="Facebook">FB</a>
                <span className="social-dash">—</span>
                <a href="#" aria-label="Instagram">IN</a>
                <span className="social-dash">—</span>
                <a href="#" aria-label="TikTok">TT</a>
            </motion.div>

            {/* Scroll indicator — bottom center */}
            <motion.div
                className="hero-scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
            >
                <motion.div
                    className="scroll-chevron"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                >
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                        <path d="M1 1L10 9L19 1" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSlider;
