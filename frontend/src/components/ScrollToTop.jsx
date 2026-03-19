import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowUp } from 'react-icons/hi';
import './ScrollToTop.css';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    // Automatically scroll to top when pathname changes (navigation)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <HiOutlineArrowUp />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
