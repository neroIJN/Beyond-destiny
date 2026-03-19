import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import './SignatureSection.css';

const SignatureSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

    const images = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=700",
            alt: "Intimate portrait",
            size: "large"
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=500",
            alt: "Golden hour",
            size: "medium"
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=500",
            alt: "Celebration",
            size: "small"
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&q=80&w=400",
            alt: "Detail shot",
            size: "accent"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }
    };

    const imageReveal = {
        hidden: { 
            opacity: 0, 
            scale: 1.1,
            rotate: -3
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        }
    };

    return (
        <section className="signature-section" ref={sectionRef}>
            <div className="container">
                <div className="signature-layout">
                    {/* Content Side */}
                    <motion.div
                        className="signature-content"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <motion.span 
                            className="signature-eyebrow" 
                            variants={itemVariants}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            About Us
                        </motion.span>
                        
                        <motion.h2 className="signature-title" variants={itemVariants}>
                            Creating visual stories that last a lifetime
                        </motion.h2>
                        
                        <motion.div className="signature-card glass-card" variants={itemVariants}>
                            <p>
                                We're a team of passionate photographers dedicated to capturing 
                                authentic moments. Our approach combines artistic vision with 
                                genuine connection, creating images that tell your unique story.
                            </p>
                            <p>
                                Every session is a collaboration — we listen, we observe, 
                                and we create something beautiful together.
                            </p>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <Link to="/about" className="signature-link">
                                <span>Learn more about us</span>
                                <HiOutlineArrowRight />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Bento Grid Images */}
                    <div className="signature-bento">
                        <motion.div
                            className="bento-item bento-large"
                            style={{ y: y1 }}
                            variants={imageReveal}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <div className="bento-image">
                                <img src={images[0].src} alt={images[0].alt} />
                                <div className="bento-grain"></div>
                                <div className="bento-overlay">
                                    <span className="bento-tag">Featured</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bento-item bento-medium"
                            style={{ y: y2 }}
                            variants={imageReveal}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bento-image">
                                <img src={images[1].src} alt={images[1].alt} />
                                <div className="bento-grain"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bento-item bento-small"
                            style={{ y: y3, rotate }}
                            variants={imageReveal}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bento-image">
                                <img src={images[2].src} alt={images[2].alt} />
                                <div className="bento-grain"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bento-item bento-accent"
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            whileHover={{ rotate: 0, scale: 1.05 }}
                        >
                            <div className="bento-image circle">
                                <img src={images[3].src} alt={images[3].alt} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignatureSection;
