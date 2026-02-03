import React from 'react';
import { motion } from 'framer-motion';

const LockEyesAnimation = ({ className = "w-12 h-12" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>

            {/* Lock Shape - Compact & Thicker */}
            <svg
                width="100%" height="100%" viewBox="0 0 200 200" fill="none"
                className="absolute inset-0 z-0 opacity-100 text-gray-900 dark:text-white transition-colors duration-300"
            >
                {/* Lock Body */}
                <motion.rect
                    x="50" y="85" width="100" height="75" rx="12"
                    stroke="currentColor" strokeWidth="10"
                    fill="none"
                />
                {/* Lock Shackle */}
                <motion.path
                    d="M70 85 V55 A30 30 0 0 1 130 55 V85"
                    stroke="currentColor" strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>

            {/* Eyes & Specs - Centered in Lock Body */}
            {/* Adjusted pt value to position eyes correctly within lock body */}
            <div className="absolute inset-0 flex items-center justify-center pt-5 z-10 w-full h-full">

                <div className="flex items-center gap-1 text-gray-900 dark:text-white transition-colors duration-300">
                    {/* Left Eye - Reduced size to w-5 h-5 (was w-8) */}
                    <div className="w-6 h-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-current rounded-full bg-white dark:bg-slate-900"></div>
                        <motion.div
                            className="w-1.5 h-3 bg-current rounded-full z-10"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            // Quicker Blink: reduced duration to 3s, blink itself is faster
                            transition={{ repeat: Infinity, duration: 3, times: [0, 0.05, 0.1], repeatDelay: 2 }}
                        />
                    </div>

                    {/* Bridge */}
                    <div className="w-1.5 h-0.5 bg-current"></div>

                    {/* Right Eye - Reduced size */}
                    <div className="w-6 h-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-current rounded-full bg-white dark:bg-slate-900"></div>
                        <motion.div
                            className="w-1.5 h-3 bg-current rounded-full z-10"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3, times: [0, 0.05, 0.1], repeatDelay: 2 }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LockEyesAnimation;
