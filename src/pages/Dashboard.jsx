import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Play, Activity, Brain, Layers, ArrowRight, Zap, BookOpen } from 'lucide-react';

const Card = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={`bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-8 ${className}`}
    >
        {children}
    </motion.div>
);

const Dashboard = () => {
    return (
        <DashboardLayout>
            {/* HERO SECTION */}
            <section className="relative py-12 mb-12">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-40 left-20 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-30"
                    />
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                    >
                        Version 2.0 • Neural Interface Active
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-light tracking-tight text-gray-900"
                    >
                        Adaptive Reading.<br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Designed for Your Mind.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 font-light"
                    >
                        Your personal cognitive workspace. Calibrate your focus, track your patterns, and read with precision.
                    </motion.p>
                </div>
            </section>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 z-10 relative">

                {/* A. PROJECT OVERVIEW (Span 4) */}
                <div className="md:col-span-4">
                    <Card delay={0.1} className="h-full flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                    <Layers className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <h2 className="text-xl font-bold">System Status</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium">Neural Engine: Online</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium">Eye Tracking: Calibrated</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-sm font-medium">Synced with Cloud</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <p className="text-xs text-gray-400">Last synced: Just now</p>
                        </div>
                    </Card>
                </div>

                {/* B. START SCAN CTA (Span 4 - Center Dominant) */}
                <div className="md:col-span-4">
                    <Card delay={0.2} className="h-full relative overflow-hidden group border-blue-100 hover:border-blue-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
                            <motion.div
                                className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200"
                                animate={{ boxShadow: ["0 0 0 0px rgba(37, 99, 235, 0.2)", "0 0 0 20px rgba(37, 99, 235, 0)"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Play className="w-8 h-8 text-white ml-1" />
                            </motion.div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">New Focus Scan</h2>
                                <p className="text-gray-500 text-sm">3 Minutes • Calibration & Analysis</p>
                            </div>

                            <Link to="/focus-scan" className="w-full">
                                <button className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                    Start Analysis <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* C. COGNITIVE MODES (Span 4) */}
                <div className="md:col-span-4">
                    <Card delay={0.3} className="h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <Brain className="w-6 h-6 text-gray-700" />
                            </div>
                            <h2 className="text-xl font-bold">Cognitive Modes</h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {["ADHD Support", "Dyslexia", "Visual Stress", "Deep Work", "Speed Read"].map((mode, i) => (
                                <div key={i} className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 cursor-pointer transition-all">
                                    {mode}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Zap className="w-4 h-4 text-orange-500 mt-1" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    <strong>Tip:</strong> Select 'Deep Work' to activate aggressive blocking and high-contrast text mode.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* D. LATEST ANALYSIS SUMMARY (Span 12) */}
                <div className="md:col-span-12">
                    <Link to="/test-results" className="block">
                        <Card delay={0.4} className="min-h-[180px] hover:border-blue-200 hover:ring-2 hover:ring-blue-50 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    {/* Icon / Score Circle */}
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                            <motion.circle
                                                cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray="226"
                                                initial={{ strokeDashoffset: 226 }} animate={{ strokeDashoffset: 226 - (226 * 0.85) }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            />
                                        </svg>
                                        <span className="absolute text-xl font-bold text-gray-900">85</span>
                                    </div>

                                    {/* Text Summary */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Latest Cognitive Analysis</h2>
                                        <p className="text-gray-500 mb-2">Completed just now • <span className="text-green-600 font-medium">Optimal Focus Detected</span></p>

                                        <div className="flex gap-4 mt-2">
                                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">Reading: 250 WPM</div>
                                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">Reaction: 280ms</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow / CTA */}
                                <div className="pr-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
