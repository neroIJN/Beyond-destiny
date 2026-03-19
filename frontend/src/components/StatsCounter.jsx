import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import './StatsCounter.css';

const StatsCounter = () => {
    const stats = [
        { id: 1, value: 500, label: "Stories Told", suffix: "+" },
        { id: 2, value: 8, label: "Years Experience", suffix: "+" },
        { id: 3, value: 15, label: "Destinations", suffix: "" },
        { id: 4, value: 100, label: "Happy Clients", suffix: "%" },
    ];

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const containerY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

    return (
        <section className="stats-section" ref={sectionRef}>
            <div className="container">
                <motion.div 
                    className="stats-grid"
                    style={{ y: containerY }}
                >
                    {stats.map((stat, index) => (
                        <CounterItem key={stat.id} stat={stat} index={index} isInView={isInView} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const CounterItem = ({ stat, index, isInView }) => {
    const [count, setCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showGlow, setShowGlow] = useState(false);

    useEffect(() => {
        if (isInView) {
            // Stagger start time
            const startDelay = index * 150;
            
            const startTimer = setTimeout(() => {
                let start = 0;
                const end = stat.value;
                const duration = 2000;
                const increment = end / (duration / 16);

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= end) {
                        start = end;
                        clearInterval(timer);
                        setIsComplete(true);
                        setShowGlow(true);
                        // Remove glow after animation
                        setTimeout(() => setShowGlow(false), 600);
                    }
                    setCount(Math.floor(start));
                }, 16);

                return () => clearInterval(timer);
            }, startDelay);

            return () => clearTimeout(startTimer);
        }
    }, [isInView, stat.value, index]);

    return (
        <motion.div
            className={`stat-card glass-card ${showGlow ? 'glowing' : ''}`}
            initial={{ opacity: 0, y: 40, rotateX: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 } 
            }}
            style={{ perspective: 1000 }}
        >
            <motion.span 
                className="stat-value"
                animate={isComplete ? {
                    scale: [1, 1.12, 1],
                } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {count}{stat.suffix}
            </motion.span>
            <motion.span 
                className="stat-label"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.3 }}
            >
                {stat.label}
            </motion.span>
            <div className="stat-decoration" />
        </motion.div>
    );
};

export default StatsCounter;
