import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
    Play, Eye, ChevronDown, Check, ArrowRight,
    FileText, ArrowUpRight, Scan, Activity, Sparkles
} from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import ProgressCharts from '../components/ProgressCharts';
import AuroraAnimation from '../components/AuroraAnimation';
import { storage } from '../utils/storage';
import VisionStudioCards from '../components/VisionStudioCards';
import LeaderboardWidget from '../components/LeaderboardWidget';

// Optimized CSS Keyframes for Performance
const dashboardStyles = `
  @keyframes scan-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.08); opacity: 0.8; }
    100% { transform: scale(1); opacity: 0.4; }
  }
  @keyframes orbital-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes orbital-rotate-rev {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes floating-particle {
    0% { transform: translateY(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-12px); opacity: 0; }
  }
  .gpu-accelerated {
    will-change: transform, opacity;
  }
`;

const Card = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 p-8 ${className}`}
    >
        {children}
    </motion.div>
);

const GraphLine = ({ data, fallback }) => {
    const points = (data && data.length > 0) ? data : fallback;
    const max = Math.max(...points, 100);
    const min = Math.min(...points, 0);
    // Generate path for 100x100 viewbox
    const pathD = points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 100 - ((p - min) / (max - min)) * 80 - 10; // 10px padding
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Area under curve for tech feel */}
            <motion.path
                d={`${pathD} V 120 H 0 Z`}
                fill="url(#scoreGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const Dashboard = () => {
    const { colorBlindMode, setColorBlindMode } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const colorBlindOptions = [
        { value: 'none', label: 'None' },
        { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
        { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
        { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <DashboardLayout>
            {/* HERO SECTION — Premium HUD Upgrade */}
            <section className="relative w-full h-[420px] md:h-[480px] rounded-[3.5rem] overflow-hidden bg-[#050a1a] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] mb-14 group">
                {/* Enhanced Aurora Background */}
                <div className="absolute inset-0 z-0 opacity-80 scale-110 group-hover:scale-125 transition-transform duration-1000">
                    <AuroraAnimation />
                </div>

                {/* Technical HUD Overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full border-[1.5rem] border-[#0a1128]/50" />
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-between p-12 md:p-20">
                    <div className="flex flex-col items-start gap-8 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-blue-400 text-xs font-bold tracking-[0.3em] uppercase"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            System Active: 0.98.4
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-2"
                            >
                                {getGreeting()},
                            </motion.h1>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500"
                            >
                                Explorer.
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="text-xl text-gray-400 max-w-[420px] leading-relaxed"
                        >
                            Optical baseline stable. Cognitive load at <span className="text-emerald-400 font-bold">12%</span>. Current focus potential is <span className="text-white font-bold">highly optimized</span>.
                        </motion.p>
                    </div>

                    <div className="hidden lg:flex relative items-center justify-center w-[450px] h-[450px]">
                        <style>{dashboardStyles}</style>
                        {/* Immersive Orbital Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[420, 320, 220].map((size, i) => (
                                <div
                                    key={size}
                                    className={`absolute rounded-full border border-white/[0.03] dark:border-blue-500/10 gpu-accelerated`}
                                    style={{
                                        width: size,
                                        height: size,
                                        animation: `${i % 2 === 0 ? 'orbital-rotate' : 'orbital-rotate-rev'} ${20 + i * 10}s linear infinite, pulse-ring 4s ease-in-out infinite`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Central Pulse Core */}
                        <motion.div
                            className="relative w-48 h-48 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[60px]" />
                            <div className="relative w-full h-full rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex flex-col items-center justify-center p-6 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Status</div>
                                <div className="text-4xl font-black text-white tracking-tighter">OS.v4</div>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Optimized</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Data Nodes */}
                        <motion.div
                            className="absolute top-10 right-10 p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                        >
                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Neural XP</div>
                            <div className="text-2xl font-black text-white">{storage.getUser().xp.toLocaleString()}</div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 left-0 p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
                        >
                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Cognitive Rank</div>
                            <div className="text-xl font-black text-blue-400 uppercase tracking-tight">Master Explorer</div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-10 right-20 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl flex items-center gap-3"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                        >
                            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Activity size={16} />
                            </div>
                            <div>
                                <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Efficiency</div>
                                <div className="text-sm font-bold text-white leading-none">98.2%</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DASHBOARD GRID — COMMAND DECK LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative mb-12">

                {/* 1. FOCUS COMMAND CENTER (Wide Format) */}
                <div className="lg:col-span-7">
                    <Link to="/focus-scan" className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] border border-blue-500/20 shadow-2xl shadow-blue-900/10 flex flex-col justify-between p-10 h-full min-h-[320px] transition-all hover:scale-[1.01] active:scale-[0.99] hover:border-blue-500/40">

                        {/* Animated Background - Cinematic */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute top-0 bottom-0 left-0 w-[40%] bg-blue-600/10 blur-[100px]"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

                            {/* Scanning Beam (Horizontal) */}
                            <motion.div
                                className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                animate={{ left: ['0%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Top HUD */}
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md group-hover:bg-blue-500/20 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:animate-pulse"></div>
                                    <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase group-hover:text-blue-200 transition-colors">System Ready</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    Calibration Required
                                </div>
                            </div>
                            <Scan className="w-6 h-6 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10 mt-6 mb-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-[0.9] group-hover:translate-x-1 transition-transform duration-300">
                                INITIATE<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">FOCUS SCAN</span>
                            </h2>
                            <p className="text-sm text-gray-400 max-w-md leading-relaxed group-hover:text-gray-300 transition-colors">
                                Perform a comprehensive 3-minute neural analysis to calibrate your cognitive baseline and optimize daily tasks.
                            </p>
                        </div>

                        {/* Bottom Action Area */}
                        <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Est. Duration</span>
                                    <span className="text-sm font-bold text-white">3 Min 00s</span>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Modules</span>
                                    <span className="text-sm font-bold text-white">Reaction • Memory • Tracking</span>
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 pl-6 pr-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/40 text-white font-bold tracking-wider shadow-lg shadow-blue-600/20 transition-all group/btn"
                            >
                                START SCAN <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </motion.div>
                        </div>
                    </Link>
                </div>

                {/* 2. COGNITIVE SCORE (Wide Format) */}
                <div className="lg:col-span-5">
                    <Link to="/test-results" className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f1629] border border-gray-800 p-8 h-full min-h-[320px] flex flex-col hover:border-blue-500/30 transition-all">

                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Live Metrics</span>
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Focus Score</h3>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 tracking-tighter">
                                    {storage.getStats().focusScore}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md mt-1">+2.4% vs last week</span>
                            </div>
                        </div>

                        {/* Interactive Graph Area */}
                        <div className="relative z-10 flex-1 w-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden p-4 group-hover:bg-white/10 transition-colors">
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                {/* Grid Background */}
                            </div>
                            <div className="w-full h-full relative">
                                <GraphLine data={storage.getSessions().map(s => s.score).slice(-7)} fallback={[40, 60, 45, 75, 65, 90, storage.getStats().focusScore]} />
                            </div>
                        </div>

                        <div className="relative z-10 mt-5 flex justify-between items-center text-xs font-medium text-gray-500">
                            <span>Last 7 Days</span>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>Stable</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Peaking</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 3. ROW 2: ADAPTIVE READER + LEADERBOARD + GOALS */}

                {/* Adaptive Reader */}
                <div className="lg:col-span-4 min-h-[280px]">
                    <Link to="/adaptive-reader" className="block h-full">
                        <Card delay={0.2} className="h-full bg-[#0d1520] border-teal-500/20 hover:border-teal-400/40 relative overflow-hidden group p-8 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10">
                                <div className="p-3 bg-teal-500/10 w-fit rounded-xl mb-4 text-teal-400">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Adaptive<br />Reader</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Text-to-speech & visual aids for Dyslexia/ADHD support.
                                </p>
                            </div>
                            <div className="relative z-10 flex items-center text-xs font-bold text-teal-400 tracking-wider uppercase mt-6 group-hover:translate-x-2 transition-transform">
                                Open Interface <ArrowRight size={12} className="ml-2" />
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-5 min-h-[280px]">
                    <div className="h-full rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20"></div>
                        <div className="p-1 h-full">
                            <LeaderboardWidget />
                        </div>
                    </div>
                </div>

                {/* Daily Goals / Stats Widget */}
                <div className="lg:col-span-3 min-h-[280px]">
                    <div className="h-full rounded-[2.5rem] bg-gradient-to-b from-[#1a1f35] to-[#0f1219] border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
                        {/* Progress Circle Visual */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[6px] border-purple-500/20 dashed" />

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Goal</h4>
                            <div className="text-4xl font-black text-white mb-1">2/3</div>
                            <div className="text-xs text-purple-400 font-medium">Sessions Complete</div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                                <span>Progress</span>
                                <span>66%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '66%' }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <Sparkles size={14} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">Daily Streak</div>
                                    <div className="text-[10px] text-gray-500">5 Days Playing</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 3. VISION STUDIO (Full Width) — Premium Redesign */}
            <div className="md:col-span-12 mt-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                            <div className="relative p-3.5 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl text-purple-400 shadow-2xl">
                                <Eye className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-0.5 bg-purple-500 rounded-full" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Optimization Suite</span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Vision <span className="text-purple-400">Studio</span></h2>
                        </div>
                    </div>

                    {/* Filter Dropdown — Refined HUD Style */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="px-5 py-2.5 rounded-2xl bg-white/5 dark:bg-slate-900/40 border border-white/10 flex items-center gap-4 hover:bg-white/10 dark:hover:bg-slate-800 transition-all group/btn"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Filter Mode</span>
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-tight">
                                    {colorBlindOptions.find(o => o.value === colorBlindMode)?.label || 'None'}
                                </span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 group-hover/btn:text-blue-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-30"
                                >
                                    {colorBlindOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => { setColorBlindMode(option.value); setDropdownOpen(false); }}
                                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between ${colorBlindMode === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                                        >
                                            {option.label}
                                            {colorBlindMode === option.value && <Check size={14} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <VisionStudioCards />
            </div>


            {/* PROGRESS SECTION */}
            <div className="mt-12 pt-12 border-t border-gray-200 dark:border-slate-800">
                <ProgressCharts />
            </div>
        </DashboardLayout >
    );
};

export default Dashboard;