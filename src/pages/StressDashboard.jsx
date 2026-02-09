import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { ArrowLeft, Sparkles, Activity, Palette, Wind, Heart, Smile } from 'lucide-react';
import ProgressCharts from '../components/ProgressCharts';

const StressDashboard = () => {
    const stressReliefTips = [
        "Take a deep breath. Inhale for 4, hold for 4, exhale for 8.",
        "Color matching can help ground your focus and reduce anxiety.",
        "Soft pastel colors are scientifically shown to lower heart rate.",
        "Remember to blink often and look away from the screen every 20 minutes.",
    ];
    const tip = stressReliefTips[Math.floor(Math.random() * stressReliefTips.length)];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/40 via-background to-background dark:from-pink-900/20 dark:via-background dark:to-background transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="p-3 glass rounded-xl hover:scale-105 transition-transform text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[10px] font-bold tracking-wider uppercase border border-pink-200 dark:border-pink-800">
                                        Calm Workspace
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    Relax & Rejuvenate.
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 text-sm font-medium">
                                <Sparkles className="w-4 h-4 text-pink-400" />
                                <span>Zen State: Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                                    Washing away the cognitive load.
                                </h2>
                                <div className="flex items-start gap-3 mb-8 p-4 bg-pink-50/50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-800/20">
                                    <Smile className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wide mb-1">Gentle Reminder</p>
                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                            "{tip}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="h-12 px-6 rounded-xl flex items-center gap-2.5 font-semibold glass text-pink-600 dark:text-pink-400">
                                        <Wind size={18} />
                                        <span>Deep Breathing</span>
                                    </div>
                                    <div className="h-12 px-6 rounded-xl flex items-center gap-2.5 font-semibold glass text-orange-600 dark:text-orange-400">
                                        <Heart size={18} />
                                        <span>Focus Bloom</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative BG Elements */}
                            <div className="absolute right-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none transform translate-x-12 translate-y-12 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6">
                                <Activity size={300} />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-3xl p-8 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-lg mb-4">Daily Calmness</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Your stress levels have been stable this week. Keep up the mindfulness!
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">Current Relaxation</span>
                                        <span className="text-pink-500 font-bold">85%</span>
                                    </div>
                                    <div className="h-2 bg-pink-100 dark:bg-pink-900/30 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-pink-400 to-rose-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Games Grid */}
                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-8">Relaxation Modules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link to="/color-match" className="group">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="h-full glass-card hover:bg-white dark:hover:bg-slate-800 rounded-3xl p-6 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 relative overflow-hidden"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 flex items-center justify-center mb-6">
                                        <Palette size={26} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-pink-500 transition-colors">Color Match</h3>
                                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                        A meditative color blending game. Find the perfect hue to restore balance and harmony.
                                    </p>
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform">
                                        <span>Start Matching</span>
                                        <ArrowLeft className="rotate-180 w-4 h-4" />
                                    </div>
                                </motion.div>
                            </Link>

                            <Link to="/balloon-pop" className="group">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="h-full glass-card hover:bg-white dark:hover:bg-slate-800 rounded-3xl p-6 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 relative overflow-hidden"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-6">
                                        <Activity size={26} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">Balloon Pop</h3>
                                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                        A gentle activity to focus your attention. Pop only the target colors as they float by.
                                    </p>
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                        <span>Start Popping</span>
                                        <ArrowLeft className="rotate-180 w-4 h-4" />
                                    </div>
                                </motion.div>
                            </Link>

                            <Link to="/zen-drive" className="group">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="h-full glass-card hover:bg-white dark:hover:bg-slate-800 rounded-3xl p-6 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 relative overflow-hidden"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mb-6">
                                        <Wind size={26} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-green-500 transition-colors">Zen Drive</h3>
                                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                        A peaceful 3D driving experience. Coast through pastel landscapes and clear your mind.
                                    </p>
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm font-bold text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                                        <span>Start Driving</span>
                                        <ArrowLeft className="rotate-180 w-4 h-4" />
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="glass-card rounded-3xl p-8 border border-white/50 dark:border-white/5">
                        <ProgressCharts />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StressDashboard;
