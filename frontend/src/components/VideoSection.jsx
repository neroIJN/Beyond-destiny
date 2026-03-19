import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiOutlinePlay } from 'react-icons/hi';
import './VideoSection.css';

const VideoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
    const badgeY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const titleWords = "See how we bring your vision to life".split(' ');

    return (
        <section className="video-section" ref={sectionRef}>
            <div className="container">
                <motion.div
                    className="video-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="video-eyebrow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        Our Story
                    </motion.span>
                    <h2 className="video-title">
                        {titleWords.map((word, i) => (
                            <motion.span
                                key={i}
                                className="video-title-word"
                                initial={{ opacity: 0, y: 20, rotateX: -40 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                            >
                                {word}{' '}
                            </motion.span>
                        ))}
                    </h2>
                </motion.div>

                <div className="video-wrapper">
                    {!isPlaying ? (
                        <motion.div 
                            className="video-cover"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <motion.div 
                                className="video-cover-image"
                                style={{ 
                                    y: imageY,
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80")' 
                                }}
                            />
                            <div className="video-grain" />
                            <motion.div 
                                className="video-duotone"
                                animate={{ opacity: isHovered ? 0.4 : 0 }}
                                transition={{ duration: 0.4 }}
                            />
                            
                            {/* Floating Badge */}
                            <motion.div 
                                className="video-badge glass"
                                style={{ y: badgeY }}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <span className="badge-number">2min</span>
                                <span className="badge-label">Showreel</span>
                            </motion.div>

                            <motion.button 
                                className="play-button glass" 
                                onClick={handlePlay}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.span 
                                    className="play-icon-wrapper"
                                    animate={{ 
                                        boxShadow: isHovered 
                                            ? '0 0 40px rgba(196, 130, 109, 0.6)' 
                                            : '0 4px 20px rgba(196, 130, 109, 0.3)'
                                    }}
                                >
                                    <HiOutlinePlay />
                                </motion.span>
                                <span className="play-text">Watch Reel</span>
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="video-player-container"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="Captured Moments Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
