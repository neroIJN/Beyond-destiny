import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';
import './Blog.css';

const Blog = () => {
    const featuredPost = {
        id: 0,
        category: "Featured Story",
        title: "A Magical Sunset Wedding at the Southern Coast",
        excerpt: "When golden light meets the ocean breeze, every moment becomes a masterpiece. Join us as we relive this breathtaking celebration of love.",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        date: "February 10, 2025",
        author: "Lensero Team"
    };

    const posts = [
        {
            id: 1,
            category: "Wedding Tips",
            title: "The Art of Golden Hour Photography",
            excerpt: "Discover how the warm glow of golden hour transforms your wedding portraits into timeless works of art.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
            date: "Jan 15, 2025"
        },
        {
            id: 2,
            category: "Behind the Lens",
            title: "A Coastal Love Story in Mirissa",
            excerpt: "Join us as we relive the magical moments from an intimate beach wedding ceremony.",
            image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80",
            date: "Dec 20, 2024"
        },
        {
            id: 3,
            category: "Inspiration",
            title: "Planning Your Dream Destination Wedding",
            excerpt: "Everything you need to know about planning a breathtaking destination wedding in Sri Lanka.",
            image: "https://images.unsplash.com/photo-1661328117163-d1fb9d28f751?auto=format&fit=crop&w=700&q=80",
            date: "Nov 10, 2024"
        },
        {
            id: 4,
            category: "Style Guide",
            title: "Bridal Elegance: Trending Looks for 2025",
            excerpt: "From classic lace to modern minimalism, explore the bridal styles defining this year's wedding season.",
            image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80",
            date: "Oct 5, 2024"
        },
        {
            id: 5,
            category: "Wedding Tips",
            title: "Choosing Your Perfect Venue",
            excerpt: "A guide to finding a wedding venue that complements your vision and personality as a couple.",
            image: "https://images.unsplash.com/photo-1684895603976-6ba905f8d237?auto=format&fit=crop&w=700&q=80",
            date: "Sep 18, 2024"
        },
        {
            id: 6,
            category: "Behind the Lens",
            title: "The Magic of Candid Moments",
            excerpt: "Why the unscripted, candid moments often become the most treasured photographs of your day.",
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
            date: "Aug 22, 2024"
        }
    ];

    return (
        <motion.div
            className="blog-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="blog-page-hero">
                <div className="container">
                    <span className="label-text">The Journal</span>
                    <h1>Stories & <em>Insights</em></h1>
                    <div className="gold-rule"></div>
                </div>
            </section>

            {/* Featured Post */}
            <Reveal>
                <section className="featured-post">
                    <div className="container">
                        <div className="featured-card">
                            <div className="featured-image">
                                <img src={featuredPost.image} alt={featuredPost.title} />
                            </div>
                            <div className="featured-content">
                                <span className="gold-pill">{featuredPost.category}</span>
                                <h2>{featuredPost.title}</h2>
                                <p>{featuredPost.excerpt}</p>
                                <div className="featured-meta">
                                    <span>{featuredPost.date}</span>
                                    <span>·</span>
                                    <span>{featuredPost.author}</span>
                                </div>
                                <Link to="/blog" className="read-more">
                                    Read Full Story <span className="arrow">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* Blog Grid */}
            <Reveal>
                <section className="blog-page-grid-section">
                    <div className="container">
                        <div className="blog-page-grid">
                            {posts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    className="blog-page-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                >
                                    <Link to="/blog" className="card-image-link">
                                        <div className="card-image">
                                            <img src={post.image} alt={post.title} />
                                        </div>
                                    </Link>
                                    <div className="card-body">
                                        <div className="card-meta">
                                            <span className="gold-pill">{post.category}</span>
                                            <span className="card-date">{post.date}</span>
                                        </div>
                                        <h3 className="card-title">
                                            <Link to="/blog">{post.title}</Link>
                                        </h3>
                                        <p className="card-excerpt">{post.excerpt}</p>
                                        <Link to="/blog" className="read-more">
                                            Read More <span className="arrow">→</span>
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            <Footer />
        </motion.div>
    );
};

export default Blog;
