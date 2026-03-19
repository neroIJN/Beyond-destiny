import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../../components/Reveal';
import Footer from '../../components/Footer';
import './Album.css';

const SunsetVows = () => {
    const coverImage = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80";
    const images = [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1658691530647-8b1169ab7352?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1684895603976-6ba905f8d237?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80"
    ];

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <motion.div
            className="album-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="album-hero" style={{ backgroundImage: `url(${coverImage})` }}>
                <div className="album-hero-overlay"></div>
                <div className="container">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <span className="label-text">Editorial</span>
                        <h1>Sunset Vows</h1>
                    </motion.div>
                </div>
            </section>

            <Reveal>
                <section className="album-gallery">
                    <div className="container">
                        <div className="album-masonry">
                            {images.map((img, index) => (
                                <motion.div 
                                    key={index} 
                                    className="album-item"
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: (index % 3) * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    <div className="album-image-wrap" onClick={() => setSelectedImage(img)} style={{ cursor: 'pointer' }}>
                                        <img src={img} alt={`Sunset Vows - ${index + 1}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            <Footer />

            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img 
                            src={selectedImage}
                            alt="Full size preview"
                            className="lightbox-img"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SunsetVows;
