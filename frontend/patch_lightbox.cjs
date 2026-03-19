const fs = require('fs');
const path = require('path');

const dir = 'd:/Antigravity/captured-moments/frontend/src/pages/albums';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Add useState if not present
        if (!content.includes('useState')) {
            content = content.replace(/import React from 'react';/, "import React, { useState } from 'react';");
        }

        // Add AnimatePresence if not present
        if (!content.includes('AnimatePresence')) {
            content = content.replace(/import { motion } from 'framer-motion';/, "import { motion, AnimatePresence } from 'framer-motion';");
        }

        // Add state variable
        if (!content.includes('const [selectedImage, setSelectedImage] = useState(null);')) {
            content = content.replace(/];\s*return \(/, "];\n\n    const [selectedImage, setSelectedImage] = useState(null);\n\n    return (");
        }

        // Add onClick to album-image-wrap
        if (!content.includes('onClick={() => setSelectedImage(img)}')) {
            content = content.replace(/<div className="album-image-wrap">/g, '<div className="album-image-wrap" onClick={() => setSelectedImage(img)} style={{ cursor: \'pointer\' }}>');
        }

        // Add Lightbox markup
        if (!content.includes('lightbox-overlay')) {
            const lightboxMarkup = `<Footer />

            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img 
                            src={selectedImage}
                            alt="Full size preview"
                            className="lightbox-img"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>`;
            content = content.replace(/<Footer \/>/, lightboxMarkup);
        }

        fs.writeFileSync(filePath, content);
        console.log(`Patched ${file}`);
    }
});
