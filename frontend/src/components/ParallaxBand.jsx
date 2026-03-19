import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ParallaxBand.css';

const ParallaxBand = ({ 
    image = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    quote = "Every love story is beautiful, but yours is my favorite to tell.",
    author = "— The Lensero Philosophy"
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

    return (
        <section className="parallax-band" ref={ref}>
            <motion.div 
                className="parallax-image-container"
                style={{ y }}
            >
                <img src={image} alt="Cinematic moment" />
                <div className="parallax-grain"></div>
            </motion.div>
            
            <motion.div 
                className="parallax-content"
                style={{ opacity }}
            >
                <motion.blockquote
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {quote}
                </motion.blockquote>
                <motion.cite
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    {author}
                </motion.cite>
            </motion.div>
        </section>
    );
};

export default ParallaxBand;
