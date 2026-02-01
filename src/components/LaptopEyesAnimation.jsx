import React from 'react';
import { motion } from 'framer-motion';

const LaptopEyesAnimation = ({ className = "w-96 h-96" }) => {
    return (
        <div className={`${className} flex items-center justify-center relative`}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* --- Laptop Group --- */}
                <g transform="translate(50, 200)">
                    {/* Screen Body */}
                    <path
                        d="M30 0 H270 A10 10 0 0 1 280 10 V160 H20 V10 A10 10 0 0 1 30 0Z"
                        fill="#f3f4f6"
                        stroke="#1f2937"
                        strokeWidth="4"
                    />
                    {/* Screen Inner (The Display) */}
                    <rect x="35" y="10" width="230" height="135" rx="2" fill="#111827" />

                    {/* Keyboard / Base */}
                    <path
                        d="M0 160 H300 L320 200 H-20 L0 160Z"
                        fill="#d1d5db"
                        stroke="#1f2937"
                        strokeWidth="4"
                        strokeLinejoin="round"
                    />
                    {/* Trackpad */}
                    <rect x="110" y="170" width="80" height="20" rx="2" fill="#9ca3af" />
                </g>

                {/* --- Scrolling Code Lines on Screen (Masked) --- */}
                <defs>
                    <clipPath id="screen-clip">
                        <rect x="85" y="210" width="230" height="135" />
                    </clipPath>
                    <filter id="glow-code">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g transform="translate(50, 200)" clipPath="url(#screen-clip)">
                    {/* We animate this group moving up to simulate scrolling */}
                    <motion.g
                        animate={{ y: [-20, -100] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        {/* Generate some random code lines */}
                        {[...Array(10)].map((_, i) => (
                            <React.Fragment key={i}>
                                <rect x="45" y={30 + i * 20} width={40 + Math.random() * 60} height="6" rx="3" fill="#3b82f6" filter="url(#glow-code)" opacity="0.8" />
                                <rect x={45 + 50 + Math.random() * 60} y={30 + i * 20} width={20 + Math.random() * 40} height="6" rx="3" fill="#10b981" filter="url(#glow-code)" opacity="0.8" />
                            </React.Fragment>
                        ))}
                        {[...Array(10)].map((_, i) => (
                            <React.Fragment key={`clone-${i}`}>
                                <rect x="45" y={230 + i * 20} width={40 + Math.random() * 60} height="6" rx="3" fill="#3b82f6" filter="url(#glow-code)" opacity="0.8" />
                                <rect x={45 + 50 + Math.random() * 60} y={230 + i * 20} width={20 + Math.random() * 40} height="6" rx="3" fill="#10b981" filter="url(#glow-code)" opacity="0.8" />
                            </React.Fragment>
                        ))}
                    </motion.g>
                </g>

                {/* --- Eyes with Glasses (Peeking over laptop) --- */}
                <g transform="translate(0, -90)">
                    {/* Glasses Frame - Adjusted for new position */}
                    <g stroke="black" strokeWidth="6" fill="none" transform="scale(0.8) translate(80, 150)">
                        {/* Left Lens */}
                        <path d="M50 50 Q20 50 20 90 Q20 130 50 130 Q80 130 80 90 Q80 50 50 50" />
                        {/* Right Lens */}
                        <path d="M200 50 Q170 50 170 90 Q170 130 200 130 Q230 130 230 90 Q230 50 200 50" />
                        {/* Bridge */}
                        <path d="M80 90 Q125 70 170 90" />
                        {/* Temples */}
                        <path d="M20 90 L-20 80" />
                        <path d="M230 90 L270 80" />
                    </g>

                    {/* Eyes Group - Masked by glasses or just positioned behind */}
                    {/* We just layer them. */}

                    {/* Left Eye */}
                    <g transform="scale(0.8) translate(80, 150)">
                        <circle cx="50" cy="90" r="28" fill="white" />
                        {/* Pupil */}
                        <motion.circle
                            cx="50" cy="90" r="10" fill="black"
                            animate={{ cx: [50, 55, 50, 45, 50], cy: [90, 92, 90, 92, 90] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Eyelid Blink */}
                        <motion.path
                            d="M20 90 Q50 90 80 90"
                            stroke="white"
                            strokeWidth="60" // Thick stroke to cover eye
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ opacity: [0, 1, 0, 0] }}
                            transition={{ duration: 3, times: [0, 0.1, 0.2, 1], repeat: Infinity, repeatDelay: 2 }}
                        />
                    </g>

                    {/* Right Eye */}
                    <g transform="scale(0.8) translate(80, 150)">
                        <circle cx="200" cy="90" r="28" fill="white" />
                        {/* Pupil */}
                        <motion.circle
                            cx="200" cy="90" r="10" fill="black"
                            animate={{ cx: [200, 205, 200, 195, 200], cy: [90, 92, 90, 92, 90] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Eyelid Blink */}
                        <motion.path
                            d="M170 90 Q200 90 230 90"
                            stroke="white"
                            strokeWidth="60"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ opacity: [0, 1, 0, 0] }}
                            transition={{ duration: 3, times: [0, 0.1, 0.2, 1], repeat: Infinity, repeatDelay: 2 }}
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default LaptopEyesAnimation;
