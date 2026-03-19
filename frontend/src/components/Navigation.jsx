import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineMenuAlt3, HiOutlineArrowRight } from 'react-icons/hi';
import Sidebar from './Sidebar';
import './Navigation.css';

const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            if (isSidebarOpen && window.scrollY > 20) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSidebarOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <>
            <motion.nav
                className={`navigation ${scrolled ? 'hidden' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: scrolled ? -100 : 0, opacity: scrolled ? 0 : 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ pointerEvents: scrolled ? 'none' : 'auto' }}
            >
                <div className="nav-container">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <span className="logo-text">captured</span>
                        <span className="logo-dot"></span>
                    </Link>

                    {/* Center Pill Navigation */}
                    <div className="nav-pill desktop-only">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`nav-pill-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="nav-actions">
                        {location.pathname !== '/request-quote' && (
                            <Link to="/request-quote" className="nav-cta desktop-only">
                                <span>Request a Quote</span>
                                <HiOutlineArrowRight className="cta-icon" />
                            </Link>
                        )}
                        
                        <button 
                            className="menu-btn"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <HiOutlineMenuAlt3 />
                        </button>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isSidebarOpen && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
