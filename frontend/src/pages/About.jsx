import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import { fetchTeamMembers, fetchSiteSettings } from '../lib/api';
import './About.css';


const DEFAULT_SETTINGS = {
    about_hero_image_url:  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
    about_story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    about_story_p1: 'Founded in the heart of Sri Lanka, Lensero Studios was born from a passion for storytelling through light and emotion. What began as a solo journey with a camera has evolved into a collective of artists dedicated to preserving love stories in their most authentic form.',
    about_story_p2: 'We believe that every love story is a unique work of art, deserving of imagery that captures not just the events, but the feelings, the atmosphere, and the intimate connections that make each wedding extraordinary.',
    about_phil1_title: 'Authentic Emotion',
    about_phil1_desc:  'We capture raw, unscripted moments that tell the true story of your day.',
    about_phil2_title: 'Editorial Elegance',
    about_phil2_desc:  'Magazine-worthy compositions with an artistic eye for light and detail.',
    about_phil3_title: 'Timeless Beauty',
    about_phil3_desc:  'Images that will feel as fresh and moving in fifty years as they do today.',
};

const About = () => {
    const [team, setTeam] = useState([]);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        fetchTeamMembers()
            .then(data => { if (data) setTeam(data); })
            .catch(() => {});
        fetchSiteSettings()
            .then(data => { if (data) setSettings(prev => ({ ...prev, ...data })); })
            .catch(() => {});
    }, []);

    const philosophyCards = [1, 2, 3].map(n => ({
        title: settings[`about_phil${n}_title`],
        desc:  settings[`about_phil${n}_desc`],
        icon: '✦',
    }));

    return (
        <motion.div
            className="about-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="label-text">Our Story</span>
                    <h1>About <em>Lensero</em></h1>
                    <p>Crafting timeless wedding narratives since 2018</p>
                </div>
                <div className="about-hero-image">
                    <img src={settings.about_hero_image_url} alt="About Lensero" />
                </div>
            </section>

            {/* Story Section */}
            <Reveal>
                <section className="about-story">
                    <div className="container">
                        <div className="story-layout">
                            <div className="story-image">
                                <img src={settings.about_story_image_url} alt="Our journey" />
                                <div className="story-frame-accent"></div>
                            </div>
                            <div className="story-text">
                                <span className="label-text">The Beginning</span>
                                <h2>Where Light <em>Meets Love</em></h2>
                                <p>{settings.about_story_p1}</p>
                                <p>{settings.about_story_p2}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* Philosophy Section */}
            <Reveal>
                <section className="about-philosophy">
                    <div className="container">
                        <div className="philosophy-header">
                            <span className="label-text">Our Approach</span>
                            <h2>Our <em>Philosophy</em></h2>
                        </div>
                        <div className="philosophy-grid">
                            {philosophyCards.map((item, i) => (
                                <div key={i} className="philosophy-card">
                                    <span className="philosophy-icon">{item.icon}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* Team Section */}
            {settings.show_team_section !== 'false' && team.length > 0 && (
                <Reveal>
                    <section className="about-team">
                        <div className="container">
                            <div className="team-header">
                                <span className="label-text">The Artists</span>
                                <h2>Meet the <em>Team</em></h2>
                            </div>
                            <div className="team-grid">
                                {team.map((member) => (
                                    <div key={member.id} className="team-card">
                                        <div className="team-photo">
                                            <img src={member.image_url} alt={member.name} />
                                        </div>
                                        <h3 className="team-name">{member.name}</h3>
                                        <span className="team-role">{member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </Reveal>
            )}

            <Reveal>
                <TestimonialsSection />
            </Reveal>

            <Footer />
        </motion.div>
    );
};

export default About;
