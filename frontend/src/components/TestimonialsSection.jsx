import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiStar } from 'react-icons/hi';
import { fetchTestimonials } from '../lib/api';
import './TestimonialsSection.css';

const DEFAULT_TESTIMONIALS = [
    {
        id: 'default-1',
        image_url: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&w=200&q=80",
        quote: "Lensero captured every emotion, every stolen glance, and every joyful tear. Looking at our photos feels like reliving the most beautiful day of our lives.",
        couple: "Amanda & David",
        location: "Galle, Sri Lanka",
        rating: 5
    },
    {
        id: 'default-2',
        image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80",
        quote: "We were blown away by the artistic quality and attention to detail. Every photograph is a masterpiece that we will treasure for generations to come.",
        couple: "Jessica & Michael",
        location: "Kandy, Sri Lanka",
        rating: 5
    },
    {
        id: 'default-3',
        image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=200&q=80",
        quote: "From our engagement shoot to the wedding day, Lensero made us feel comfortable and the results exceeded all our expectations. Pure magic!",
        couple: "Sarah & James",
        location: "Colombo, Sri Lanka",
        rating: 5
    }
];

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
    const [current, setCurrent] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        fetchTestimonials()
            .then(data => { if (data && data.length > 0) setTestimonials(data); })
            .catch(() => {}); // fall back to defaults
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const quoteY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prev = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [next]);

    const t = testimonials[current];
    const quoteWords = t.quote.split(' ');

    return (
        <section className="testimonials-section" ref={sectionRef}>
            {/* Decorative Quote Marks */}
            <motion.div 
                className="quote-decoration left"
                style={{ y: quoteY }}
            >
                "
            </motion.div>
            <motion.div 
                className="quote-decoration right"
                style={{ y: quoteY }}
            >
                "
            </motion.div>

            <div className="container">
                <motion.div
                    className="testimonials-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="testimonials-eyebrow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        Kind Words
                    </motion.span>
                    <h2 className="testimonials-title">What Couples Say</h2>
                </motion.div>

                <div className="testimonials-carousel">
                    <motion.button 
                        className="carousel-nav prev" 
                        onClick={prev} 
                        aria-label="Previous testimonial"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <HiOutlineChevronLeft />
                    </motion.button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={t.id}
                            className="testimonial-card glass-card"
                            initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateY: 15, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            style={{ perspective: 1000 }}
                        >
                            <div className="stars">
                                {[...Array(t.rating)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1, type: "spring" }}
                                    >
                                        <HiStar className="star" />
                                    </motion.span>
                                ))}
                            </div>

                            <blockquote className="testimonial-quote">
                                "
                                {quoteWords.map((word, i) => (
                                    <motion.span
                                        key={i}
                                        className="quote-word"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
                                    >
                                        {word}{' '}
                                    </motion.span>
                                ))}
                                "
                            </blockquote>

                            <div className="testimonial-author">
                                <motion.div 
                                    className="author-avatar"
                                    animate={{ 
                                        y: [0, -5, 0],
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <img src={t.image_url} alt={t.couple} />
                                </motion.div>
                                <motion.div 
                                    className="author-info"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h4 className="author-name">{t.couple}</h4>
                                    <span className="author-location">{t.location}</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <motion.button 
                        className="carousel-nav next" 
                        onClick={next} 
                        aria-label="Next testimonial"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <HiOutlineChevronRight />
                    </motion.button>
                </div>

                <div className="carousel-dots">
                    {testimonials.map((_, i) => (
                        <motion.button
                            key={i}
                            className={`dot ${i === current ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to testimonial ${i + 1}`}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
