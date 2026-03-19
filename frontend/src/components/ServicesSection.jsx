import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HiOutlineCamera, HiOutlineHeart, HiOutlineSparkles } from 'react-icons/hi';
import { fetchServices } from '../lib/api';
import './ServicesSection.css';

// Map icon_name strings from the DB to React icon components
const ICON_MAP = {
    heart:    <HiOutlineHeart />,
    camera:   <HiOutlineCamera />,
    sparkles: <HiOutlineSparkles />,
};

const FALLBACK_SERVICES = [
    {
        id: 'weddings',
        icon_name: 'heart',
        title: 'Weddings',
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        description: "Full-day wedding coverage with a focus on authentic moments and timeless imagery.",
        features: ["8+ hours coverage", "Two photographers", "Online gallery", "Print-ready files"]
    },
    {
        id: 'portraits',
        icon_name: 'camera',
        title: 'Portraits',
        image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
        description: "Personal and professional portrait sessions that capture your unique personality.",
        features: ["2-hour session", "Location scouting", "Wardrobe guidance", "25+ edited images"]
    },
    {
        id: 'events',
        icon_name: 'sparkles',
        title: 'Events',
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        description: "Corporate events, celebrations, and special occasions documented beautifully.",
        features: ["Flexible hours", "Quick turnaround", "Social media ready", "Highlight reel"]
    }
];

const ServicesSection = () => {
    const [services, setServices] = useState(FALLBACK_SERVICES);
    const [activeService, setActiveService] = useState(FALLBACK_SERVICES[0].id);

    useEffect(() => {
        fetchServices()
            .then(data => {
                if (data && data.length > 0) {
                    setServices(data);
                    setActiveService(data[0].id);
                }
            })
            .catch(() => {}); // silently keep fallback data
    }, []);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const sectionRef = useRef(null);
    const activeContent = services.find(s => s.id === activeService);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -8, y: x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <section className="services-section" ref={sectionRef}>
            <div className="container">
                <motion.div
                    className="services-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="services-eyebrow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        What We Do
                    </motion.span>
                    <h2 className="services-title">Services tailored to your story</h2>
                </motion.div>

                {/* Service Pills */}
                <motion.div 
                    className="services-pills"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {services.map((service, index) => (
                        <motion.button
                            key={service.id}
                            className={`service-pill ${activeService === service.id ? 'active' : ''}`}
                            onClick={() => setActiveService(service.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {ICON_MAP[service.icon_name] || <HiOutlineCamera />}
                            <span>{service.title}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Service Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService}
                        className="service-showcase"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="service-image">
                            <motion.div 
                                className="service-image-inner"
                                style={{ y: imageY }}
                            >
                                <img src={activeContent.image_url} alt={activeContent.title} />
                                <div className="service-image-grain" />
                            </motion.div>
                            <motion.div 
                                className="service-image-overlay"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 0.3 }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                        <motion.div 
                            className="service-details glass-card"
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                                transition: 'transform 0.1s ease-out'
                            }}
                        >
                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {activeContent.title}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {activeContent.description}
                            </motion.p>
                            <ul className="service-features">
                                {activeContent.features.map((feature, i) => (
                                    <motion.li 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.08 }}
                                    >
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ServicesSection;
