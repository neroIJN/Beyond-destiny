import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineX, HiOutlineArrowRight } from 'react-icons/hi';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } 
        },
        exit: { 
            opacity: 0, 
            transition: { duration: 0.3, delay: 0.15, ease: [0.4, 0, 0.2, 1] } 
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                staggerChildren: 0.06,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }
    };

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <motion.div
            className="sidebar-fullscreen"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Close Button */}
            <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
                <HiOutlineX />
            </button>

            {/* Content */}
            <motion.div className="sidebar-content" variants={contentVariants}>
                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <motion.div key={link.name} variants={linkVariants}>
                            <Link 
                                to={link.path} 
                                className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="link-text">{link.name}</span>
                                <HiOutlineArrowRight className="link-arrow" />
                            </Link>
                        </motion.div>
                    ))}

                    {location.pathname !== '/request-quote' && (
                        <motion.div variants={linkVariants} className="sidebar-cta-wrapper">
                            <Link 
                                to="/request-quote" 
                                className="sidebar-cta"
                                onClick={onClose}
                            >
                                <span>Request a Quote</span>
                                <HiOutlineArrowRight className="cta-icon" />
                            </Link>
                        </motion.div>
                    )}
                </nav>

                {/* Footer */}
                <motion.div className="sidebar-footer" variants={linkVariants}>
                    <div className="sidebar-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <FaTiktok />
                        </a>
                    </div>
                    <a href="mailto:hello@captured.studio" className="sidebar-email">
                        hello@captured.studio
                    </a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;
