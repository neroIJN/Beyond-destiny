import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineCamera, HiOutlineStar, HiOutlinePhotograph } from 'react-icons/hi';
import './FeaturesSection.css';

const FeaturesSection = () => {
    const features = [
        {
            id: 1,
            icon: <HiOutlineHeart />,
            title: "Personal Touch",
            description: "Every session is crafted around your unique story and personality."
        },
        {
            id: 2,
            icon: <HiOutlineCamera />,
            title: "Pro Equipment",
            description: "State-of-the-art cameras and lenses for stunning image quality."
        },
        {
            id: 3,
            icon: <HiOutlineStar />,
            title: "Award Winning",
            description: "Recognized work featured in top publications worldwide."
        },
        {
            id: 4,
            icon: <HiOutlinePhotograph />,
            title: "Full Coverage",
            description: "From the first moment to the last, every memory captured."
        }
    ];

    // Organic delay pattern (not strictly sequential)
    const delays = [0, 0.15, 0.08, 0.22];

    return (
        <section className="features-section">
            <div className="container">
                <motion.div
                    className="features-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="features-eyebrow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        Why Us
                    </motion.span>
                    <h2 className="features-title">What makes us different</h2>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            className="feature-card glass-card"
                            initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -2 : 2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.6, 
                                delay: delays[index],
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ 
                                y: -10, 
                                rotate: 1,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <motion.div 
                                className="feature-icon"
                                animate={{ 
                                    y: [0, -4, 0],
                                }}
                                transition={{ 
                                    duration: 2.5 + index * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                            <div className="feature-glow" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
