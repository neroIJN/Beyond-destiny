import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import './BlogSection.css';

const BlogSection = () => {
    const posts = [
        {
            id: 1,
            category: "Tips",
            title: "The Art of Golden Hour Photography",
            excerpt: "Discover how the warm glow of golden hour transforms your portraits into timeless works of art.",
            image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=80",
            date: "Jan 15, 2025"
        },
        {
            id: 2,
            category: "Story",
            title: "A Coastal Love Story in Mirissa",
            excerpt: "Join us as we relive the magical moments from an intimate beach ceremony.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
            date: "Dec 20, 2024"
        },
        {
            id: 3,
            category: "Guide",
            title: "Planning Your Dream Destination Shoot",
            excerpt: "Everything you need to know about planning a breathtaking destination session.",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
            date: "Nov 10, 2024"
        }
    ];

    return (
        <section className="blog-section">
            <div className="container">
                <motion.div
                    className="blog-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="blog-eyebrow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        Journal
                    </motion.span>
                    <h2 className="blog-title">Stories & insights from our work</h2>
                </motion.div>

                <div className="blog-grid">
                    {posts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </div>

                <motion.div
                    className="blog-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link to="/blog" className="blog-link">
                        <span>View all stories</span>
                        <HiOutlineArrowRight />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const BlogCard = ({ post, index }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -6, y: x * 6 });
        setImageOffset({ x: x * -10, y: y * -10 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setImageOffset({ x: 0, y: 0 });
    };

    // Alternate entry directions
    const xDirection = index % 2 === 0 ? -40 : 40;

    return (
        <motion.article
            ref={cardRef}
            className="blog-card glass-card"
            initial={{ opacity: 0, x: xDirection, rotateY: index % 2 === 0 ? -5 : 5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <Link to="/blog" className="card-image-link">
                <div className="card-image">
                    <motion.img 
                        src={post.image} 
                        alt={post.title}
                        style={{
                            x: imageOffset.x,
                            y: imageOffset.y
                        }}
                    />
                    <div className="card-image-shimmer" />
                    <div className="card-image-overlay" />
                </div>
            </Link>
            <div className="card-body">
                <div className="card-meta">
                    <span className="card-category">{post.category}</span>
                    <span className="card-date">{post.date}</span>
                </div>
                <h3 className="card-title">
                    <Link to="/blog">{post.title}</Link>
                </h3>
                <p className="card-excerpt">{post.excerpt}</p>
            </div>
        </motion.article>
    );
};

export default BlogSection;
