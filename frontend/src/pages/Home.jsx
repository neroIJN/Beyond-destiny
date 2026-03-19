import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi';
import HeroSlider from '../components/HeroSlider';
import SignatureSection from '../components/SignatureSection';
import ParallaxBand from '../components/ParallaxBand';
import StatsCounter from '../components/StatsCounter';
import VideoSection from '../components/VideoSection';
import DarkShowcase from '../components/DarkShowcase';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturesSection from '../components/FeaturesSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import './Home.css';

const Home = () => {
    return (
        <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <HeroSlider />

            <Reveal>
                <SignatureSection />
            </Reveal>

            {/* Full-bleed visual break */}
            <ParallaxBand 
                image="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
                quote="Every love story is beautiful, but yours is my favorite to tell."
                author="— The Lensero Philosophy"
            />

            <Reveal>
                <StatsCounter />
            </Reveal>

            {/* <Reveal>
                <VideoSection />
            </Reveal> */}

            {/* Dark contrast section */}
            <DarkShowcase />

            <Reveal>
                <ServicesSection />
            </Reveal>

            {/* <Reveal>
                <TestimonialsSection />
            </Reveal> */}

            <Reveal>
                <FeaturesSection />
            </Reveal>

            {/* <Reveal>
                <BlogSection />
            </Reveal> */}

            {/* Instagram Strip */}
            <Reveal>
                <section className="instagram-strip">
                    <div className="container">
                        <div className="instagram-header">
                            <motion.span 
                                className="instagram-eyebrow"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                Follow the Journey
                            </motion.span>
                            <motion.h2 
                                className="instagram-title"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                @lenserostudios
                            </motion.h2>
                        </div>
                        <div className="instagram-grid">
                            {[
                                "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=400&q=80",
                                "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80",
                                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
                                "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=400&q=80",
                                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
                                "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80"
                            ].map((img, i) => (
                                <motion.div 
                                    key={i} 
                                    className="insta-item"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <img src={img} alt={`Instagram ${i + 1}`} />
                                    <div className="insta-overlay">
                                        <HiOutlineHeart />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <ContactSection />
            </Reveal>

            <Footer />
        </motion.div>
    );
};

export default Home;
