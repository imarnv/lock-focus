import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Zap, Brain, CheckCircle2 } from 'lucide-react';

const DyslexicWord = ({ word, mode }) => {
    // Simple scrambling effect
    const [displayWord, setDisplayWord] = useState(word);

    useEffect(() => {
        if (mode !== 'dyslexia') {
            if (displayWord !== word) setDisplayWord(word);
            return;
        }

        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const arr = word.split('');
                if (arr.length > 3) {
                    const i = Math.floor(Math.random() * (arr.length - 2)) + 1;
                    const temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    setDisplayWord(arr.join(''));
                }
            } else {
                setDisplayWord(word);
            }
        }, 500); // Scramble every 500ms

        return () => clearInterval(interval);
    }, [mode, word]); // Included mode as dependency

    return <span className="inline-block mr-1">{displayWord} </span>;
};

const VisionSimulator = () => {
    const [mode, setMode] = useState('normal'); // normal, dyslexia, adhd, solution

    const text = "Reading is a complex cognitive process. For many, the letters don't stay still, or focus drifts away. Lock Focus stabilizes this experience, allowing you to comprehend content without the struggle.";

    return (
        <div className="w-full max-w-4xl mx-auto my-16 p-1">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Experience the Difference</h2>
                <p className="text-gray-500">See how Lock Focus transforms the reading experience.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={() => setMode('normal')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'normal' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        Normal
                    </button>
                    <button
                        onClick={() => setMode('dyslexia')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'dyslexia' ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500/20' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <Eye className="w-4 h-4" /> Dyslexia View
                    </button>
                    <button
                        onClick={() => setMode('adhd')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'adhd' ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500/20' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <Zap className="w-4 h-4" /> ADHD View
                    </button>
                    <button
                        onClick={() => setMode('solution')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'solution' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                    >
                        <Brain className="w-4 h-4" /> Lock Focus
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative p-12 min-h-[300px] flex items-center justify-center text-lg md:text-2xl leading-relaxed transition-all duration-500">

                    {/* ADHD Blur Layer */}
                    {mode === 'adhd' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0.2, 0.8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 pointer-events-none"
                        />
                    )}

                    {/* ADHD Distraction */}
                    {mode === 'adhd' && (
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 200, opacity: [0, 1, 0], y: [-20, 20] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-yellow-400/30 blur-xl z-20 pointer-events-none"
                        />
                    )}

                    {/* Text Layer */}
                    <div className={`relative z-0 max-w-2xl ${mode === 'adhd' ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
                        {mode === 'dyslexia' ? (
                            <div className="font-serif">
                                {text.split(' ').map((word, i) => (
                                    <DyslexicWord key={i} word={word} mode={mode} />
                                ))}
                            </div>
                        ) : mode === 'solution' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-sans font-medium text-gray-800 dark:text-gray-100"
                            >
                                {/* Bionic Reading Style Highlight */}
                                {text.split(' ').map((word, i) => {
                                    const half = Math.ceil(word.length / 2);
                                    const boldPart = word.slice(0, half);
                                    const normalPart = word.slice(half);
                                    return (
                                        <span key={i} className="inline-block mr-1.5 px-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-default">
                                            <b className="text-gray-900 dark:text-white font-bold">{boldPart}</b>
                                            <span className="opacity-70">{normalPart}</span>
                                        </span>
                                    );
                                })}
                                <div className="mt-6 flex items-center gap-2 text-sm text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full w-fit mx-auto">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Cognitive Load Optimized
                                </div>
                            </motion.div>
                        ) : (
                            <div className="font-serif text-gray-600">
                                {text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionSimulator;
