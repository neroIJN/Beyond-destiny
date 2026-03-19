import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../../components/Reveal';
import Footer from '../../components/Footer';
import { fetchAlbum } from '../../lib/api';
import './Album.css';

const AlbumPage = () => {
    const { slug } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchAlbum(slug)
            .then(setAlbum)
            .catch(() => setError('Album not found'))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="album-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <p style={{ color: '#888', fontFamily: 'serif', fontSize: '1.2rem', letterSpacing: '0.1em' }}>Loading...</p>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="album-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <p style={{ color: '#888', fontFamily: 'serif', fontSize: '1.2rem' }}>Album not found.</p>
            </div>
        );
    }

    const images = album.photos || [];

    return (
        <motion.div
            className="album-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="album-hero" style={{ backgroundImage: `url(${album.cover_image_url})` }}>
                <div className="album-hero-overlay"></div>
                <div className="container">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <span className="label-text">{album.category}</span>
                        <h1>{album.title}</h1>
                    </motion.div>
                </div>
            </section>

            <Reveal>
                <section className="album-gallery">
                    <div className="container">
                        <div className="album-masonry">
                            {images.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    className="album-item"
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: (index % 3) * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    <div className="album-image-wrap" onClick={() => setSelectedImage(photo.url)} style={{ cursor: 'pointer' }}>
                                        <img src={photo.url} alt={photo.alt_text || `${album.title} - ${index + 1}`} />
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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AlbumPage;
