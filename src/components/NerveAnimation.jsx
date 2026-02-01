import React from 'react';
import { motion } from 'framer-motion';

const NerveAnimation = () => {
    // Neural Strands Flowing from Right (Eye Position) to Left (Screen Edge)
    // Origin approx: x=85, y=50 (Right Center)

    const paths = [
        // Upper Strands
        "M 85 50 C 70 50, 60 20, 0 15",
        "M 85 50 C 75 45, 50 40, 0 30",

        // Middle Strands
        "M 85 50 C 65 50, 40 55, 0 50", // Main horizontal

        // Lower Strands
        "M 85 50 C 70 60, 50 80, 0 85",
        "M 85 50 C 75 55, 40 70, 0 70",

        // Divergent organic paths
        "M 85 50 C 80 30, 40 10, 0 5",
        "M 85 50 C 80 70, 40 90, 0 95",
    ];

    // Royal Blue for signal pulses
    const pulseColor = "#2563eb"; // Tailwind blue-600

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
            >
                <defs>
                    {/* Glow Filter for Pulses */}
                    <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {paths.map((d, i) => (
                    <g key={i}>
                        {/* The Nerve Strand (Dark Gray, cable-like) */}
                        <path
                            d={d}
                            stroke="#e5e7eb" // Gray-200, subtle structure
                            strokeWidth="0.3"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.5"
                        />

                        {/* The Signal Pulse (Blue, Glowing, Data Flow) */}
                        <circle r="0.6" fill={pulseColor} filter="url(#signal-glow)">
                            <animateMotion
                                dur={`${3 + Math.random() * 2}s`} // Slow movement
                                repeatCount="indefinite"
                                path={d}
                                keyPoints="0;1"
                                keyTimes="0;1"
                                calcMode="spline"
                                keySplines="0.4 0 0.2 1" // Slow in, Slow out
                            />
                            {/* Pulse intensity swell */}
                            <animate
                                attributeName="opacity"
                                values="0;1;0.8;0"
                                keyTimes="0;0.1;0.9;1"
                                dur={`${3 + Math.random() * 2}s`}
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="r"
                                values="0.4;0.7;0.4"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        </circle>

                        {/* Occasional secondary data packet */}
                        {i % 2 === 0 && (
                            <circle r="0.3" fill={pulseColor} opacity="0.4">
                                <animateMotion
                                    dur={`${4 + Math.random()}s`}
                                    repeatCount="indefinite"
                                    path={d}
                                    begin="1s"
                                />
                            </circle>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default NerveAnimation;
