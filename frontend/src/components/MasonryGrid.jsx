import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import './MasonryGrid.css';

const MasonryGrid = ({ items }) => {
    return (
        <div className="masonry-grid">
            {items && items.map((item, index) => (
                <motion.div
                    key={item.id || index}
                    className="masonry-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                    <div className="masonry-image-wrap">
                        <img src={item.image || item.src} alt={item.title || item.alt || 'Gallery image'} />
                        <div className="masonry-overlay">
                            <div className="overlay-content">
                                {item.category && <span className="masonry-category">{item.category}</span>}
                                {item.title && <h4 className="masonry-title">{item.title}</h4>}
                                <span className="masonry-action"><HiOutlineArrowRight /></span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MasonryGrid;
