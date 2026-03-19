import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Column 1 — Brand + Social */}
                    <div className="footer-col">
                        <Link to="/" className="footer-logo">
                            Lensero<span className="logo-dot">.</span>
                        </Link>
                        <p className="footer-about">
                            Crafting authentic visual stories that celebrate
                            your unique moments and memories.
                        </p>
                        <div className="footer-social">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="https://wa.me/94774567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* Column 2 — Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Explore</h4>
                        <nav className="footer-nav">
                            <Link to="/">Home</Link>
                            <Link to="/about">About</Link>
                            <Link to="/portfolio">Portfolio</Link>
                            <Link to="/blog">Blog</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>

                    {/* Column 3 — Newsletter */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Stay Updated</h4>
                        <p className="newsletter-text">
                            Get tips, stories, and exclusive offers delivered to your inbox.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="newsletter-input-wrap">
                                <input type="email" placeholder="Your email address" />
                                <button type="submit" aria-label="Subscribe">
                                    <HiOutlineArrowRight />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>© {currentYear} Lensero Studios. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
