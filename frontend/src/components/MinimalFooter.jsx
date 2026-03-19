import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';
import './MinimalFooter.css';

const MinimalFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="minimal-footer">
            <div className="minimal-footer-content">
                <div className="minimal-footer-left">
                    <span className="label-text">Follow Along</span>
                    <a href="https://instagram.com/lenserostudios" target="_blank" rel="noopener noreferrer" className="instagram-handle">
                        @lenserostudios
                    </a>
                </div>

                <div className="minimal-footer-center">
                    <a href="mailto:Info@LenseroStudios.Com" className="footer-email">Info@LenseroStudios.Com</a>
                    <div className="footer-mini-social">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                    </div>
                </div>

                <div className="minimal-footer-right">
                    <p className="copyright">© {currentYear} Lensero Studios</p>
                    <button className="scroll-top-btn" onClick={scrollToTop}>
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default MinimalFooter;
