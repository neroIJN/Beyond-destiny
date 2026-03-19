import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    fullWidth = false
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
            x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            style={{ width: fullWidth ? '100%' : 'auto' }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
