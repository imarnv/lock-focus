import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusRuler = ({ isActive }) => {
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e) => {
            setMouseY(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isActive]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 pointer-events-none z-[9999]"
                >
                    {/* Top Overlay */}
                    <div
                        className="absolute top-0 left-0 w-full bg-black/20 backdrop-blur-[1px] transition-all duration-75"
                        style={{ height: mouseY - 60 }}
                    />

                    {/* The Ruler / Highlighted Area */}
                    <div
                        className="absolute left-0 w-full border-t border-b border-blue-400/50 bg-white/10"
                        style={{ top: mouseY - 60, height: 120 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-full shadow-[0_0_40px_rgba(37,99,235,0.2)]" />
                    </div>

                    {/* Bottom Overlay */}
                    <div
                        className="absolute bottom-0 left-0 w-full bg-black/20 backdrop-blur-[1px] transition-all duration-75"
                        style={{ top: mouseY + 60 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FocusRuler;
