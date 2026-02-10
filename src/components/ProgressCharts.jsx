import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Zap, Eye, MousePointer, Activity } from 'lucide-react';
import { storage } from '../utils/storage';

const Card = ({ children, className = "", title, headerAction }) => (
    <div className={`relative overflow-hidden bg-[#0a0f1e]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl transition-all duration-500 hover:border-blue-500/20 group/card ${className}`}>
        {/* Technical HUD Corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />

        <div className="flex justify-between items-center mb-8 relative z-10">
            {title && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-0.5 bg-blue-500 rounded-full" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Diagnostic</span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
                </div>
            )}
            {headerAction}
        </div>
        <div className="flex-1 min-h-0 relative z-10">
            {children}
        </div>
    </div>
);

const LineChart = () => {
    const [sessions, setSessions] = useState(storage.getSessions());

    const getChartPoints = (type) => {
        const base = type === 'reaction' ? [60, 65, 72] : type === 'tracking' ? [45, 55, 65] : [25, 35, 33];
        const realSessions = sessions.filter(s => {
            if (type === 'reaction') return s.type === 'letter-match';
            if (type === 'tracking') return s.type === 'focus-scan';
            if (type === 'peripheral') return s.type === 'syllable-slasher';
            return false;
        });

        const latestScore = realSessions.length > 0 ? realSessions[realSessions.length - 1].score : base[base.length - 1];
        return [...base, latestScore];
    };

    const trackingData = getChartPoints('tracking');
    const peripheralData = getChartPoints('peripheral');
    const reactionData = getChartPoints('reaction');

    const generateSmoothPath = (data) => {
        const points = data.map((y, i) => [i * 33.33, 100 - y]);
        let path = `M ${points[0][0]} ${points[0][1]}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0[0] + (p1[0] - p0[0]) / 2;
            const cp1y = p0[1];
            const cp2x = p1[0] - (p1[0] - p0[0]) / 2;
            const cp2y = p1[1];
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1[0]} ${p1[1]}`;
        }
        return path;
    };

    const generateAreaPath = (data) => `${generateSmoothPath(data)} V 100 H 0 Z`;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="relative h-64 w-full pl-8 pr-2 pt-6">

                {/* HUD Scanning Line */}
                <motion.div
                    className="absolute top-6 bottom-6 w-[2px] bg-blue-500/40 z-20"
                    animate={{ left: ['8%', '98%', '8%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute top-0 left-[-4px] w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </motion.div>

                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-6 bottom-0 flex flex-col justify-between text-[9px] text-gray-500 font-bold h-full pb-6 tracking-widest uppercase">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 pl-10 pb-6 flex flex-col justify-between pointer-events-none opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full border-t border-blue-500/20" />
                    ))}
                </div>

                <svg className="w-full h-full overflow-visible pb-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradientTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" /><stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" /></linearGradient>
                        <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" /><stop offset="100%" stopColor="#4ade80" stopOpacity="0" /></linearGradient>
                        <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /><stop offset="100%" stopColor="#60a5fa" stopOpacity="0" /></linearGradient>
                    </defs>

                    {[
                        { data: reactionData, color: "#60a5fa", grad: "url(#gradientBlue)", delay: 0 },
                        { data: peripheralData, color: "#4ade80", grad: "url(#gradientGreen)", delay: 0.2 },
                        { data: trackingData, color: "#2dd4bf", grad: "url(#gradientTeal)", delay: 0.4 },
                    ].map((chart, i) => (
                        <React.Fragment key={i}>
                            <motion.path d={generateAreaPath(chart.data)} fill={chart.grad} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: chart.delay }} />
                            <motion.path d={generateSmoothPath(chart.data)} fill="none" stroke={chart.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: chart.delay, ease: "easeInOut" }} />
                            {chart.data.map((val, idx) => (
                                <motion.circle
                                    key={idx}
                                    cx={idx * 33.33}
                                    cy={100 - val}
                                    r="2.5"
                                    fill={chart.color}
                                    className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5 + chart.delay + (idx * 0.1) }}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute bottom-[-4px] left-10 right-0 flex justify-between text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase">
                    <span>Alpha</span>
                    <span>Beta</span>
                    <span>Gamma</span>
                    <span>Delta</span>
                </div>
            </div>

            <div className="flex-1 mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                {[
                    { label: 'Avg. Reaction', value: '280ms', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Focus Score', value: '92%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Total XP', value: '17,080', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                ].map((stat, i) => (
                    <div key={i} className={`flex flex-col items-start p-4 ${stat.bg} rounded-2xl border border-white/5`}>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* NEURAL INSIGHTS - Telemetry Log (Fills space) */}
            <div className="mt-6 p-5 rounded-2xl bg-black/40 border border-white/5 font-mono overflow-hidden h-[120px] relative">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <Activity size={10} className="text-blue-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Neural Simulation Logs</span>
                    <div className="ml-auto flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-blue-500/30" />)}
                    </div>
                </div>
                <div className="space-y-1.5 overflow-hidden h-full">
                    {[
                        { time: '14:32:01', msg: 'Calibrating ocular sync latency...', status: 'OK' },
                        { time: '14:32:05', msg: 'Scanning synaptic pathways for Alpha 4...', status: 'SYNC' },
                        { time: '14:32:09', msg: 'Adjusting contrast sensitivity thresholds...', status: 'LOAD' },
                        { time: '14:32:14', msg: 'Optimizing peripheral field awareness...', status: 'READY' },
                        { time: '14:32:18', msg: 'Neural handshake established with OS.v4', status: 'LIVE' },
                    ].map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 + i * 0.5 }}
                            className="flex items-center gap-3 text-[10px]"
                        >
                            <span className="text-gray-600">[{log.time}]</span>
                            <span className="text-gray-400 truncate flex-1">{log.msg}</span>
                            <span className="text-blue-500 font-bold">[{log.status}]</span>
                        </motion.div>
                    ))}
                    {/* Simulated "scrolling" bottom log */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex items-center gap-3 text-[10px]"
                    >
                        <span className="text-gray-600">[{Date.now().toString().slice(-6)}]</span>
                        <span className="text-blue-400/60 break-all">Incoming data stream from Neural Core (S-72)...</span>
                        <div className="w-1.5 h-3 bg-blue-500/40 animate-pulse" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const BarChart = () => (
    <div className="h-56 relative w-full pt-8 group flex flex-col justify-end">
        {/* HUD Grid Lines */}
        {[0, 25, 50, 75, 100].map((val, i) => (
            <div key={i} className="absolute w-full border-t border-white/5 z-0" style={{ bottom: `${val}%`, left: 0 }}>
                <span className="absolute left-[-30px] top-[-6px] text-[8px] font-bold text-gray-600">{val}</span>
            </div>
        ))}

        <div className="flex items-end justify-between gap-3 z-10 h-full px-2">
            {[
                { d: 'Mon', v: 40 }, { d: 'Tue', v: 25 }, { d: 'Wed', v: 60 },
                { d: 'Thu', v: 45 }, { d: 'Fri', v: 80 }, { d: 'Sat', v: 20 }, { d: 'Sun', v: 50 }
            ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                    <div className="relative w-full h-full flex flex-col justify-end items-center">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${item.v}%` }}
                            transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                            className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 rounded-t-lg shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all relative overflow-hidden"
                        >
                            {/* Animated Bit-rate scan */}
                            <motion.div
                                className="absolute inset-0 bg-white/20 h-2 w-full"
                                animate={{ y: [-20, 200] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>

                        {/* Tooltip Overlay */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-[0_10px_20px_rgba(59,130,246,0.4)] z-20">
                            {item.v * 12} XP CORE
                        </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{item.d}</span>
                </div>
            ))}
        </div>

        {/* Space-filling Footer - HUD Metrics */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
            <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Weekly Delta</span>
                <span className="text-xs font-black text-emerald-400 tracking-tight">+2,450 XP</span>
            </div>
            <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`w-3 h-1 rounded-full ${i < 3 ? 'bg-blue-500' : 'bg-white/5'}`}
                        animate={i === 3 ? { opacity: [1, 0.4, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                ))}
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Projection</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white tracking-widest uppercase">Rank Up</span>
                    <TrendingUp size={10} className="text-blue-500" />
                </div>
            </div>
        </div>
    </div>
);

const HeatMap = () => (
    <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }).map((_, i) => {
            const isActive = Math.random() > 0.4;
            const level = Math.floor(Math.random() * 4) + 1; // 1 to 4 intensity

            return (
                <div key={i} className="relative group/node">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`aspect-square rounded-lg border border-white/5 relative overflow-hidden transition-all duration-300
                            ${isActive
                                ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                : 'bg-white/5 hover:bg-white/10'}`}
                        style={{ opacity: isActive ? 0.2 + (level * 0.2) : 0.4 }}
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                            />
                        )}
                    </motion.div>

                    {/* Hover Info */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1.5 bg-gray-900 text-[7px] font-bold text-white rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap border border-white/10 uppercase tracking-widest">
                        Day {i + 1}: {isActive ? '92% Sync' : 'Offline'}
                    </div>
                </div>
            );
        })}
        {/* Space-filling Progress Bar */}
        <div className="col-span-7 mt-8 bg-white/5 rounded-full h-4 relative overflow-hidden border border-white/5">
            <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 2, delay: 1 }}
            >
                <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: [-100, 400] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[7px] font-black text-white uppercase tracking-[0.3em]">Monthly Sync: 68%</span>
            </div>
        </div>
    </div>
);

const CircularProgress = ({ value = 77 }) => (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto scale-110">
        {/* Immersive HUD Perimeter */}
        <motion.div
            className="absolute inset-0 rounded-full border border-blue-500/10 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
            className="absolute inset-4 rounded-full border border-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <svg className="w-full h-full -rotate-90 scale-90 relative z-10">
            <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
            </defs>
            {/* Background Track */}
            <circle cx="96" cy="96" r="84" fill="none" className="stroke-white/5" strokeWidth="10" />
            <motion.circle
                cx="96" cy="96" r="84" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: storage.getStats().focusScore / 100 }}
                transition={{ duration: 2, ease: "circOut" }}
                strokeDasharray="1 1"
            />
        </svg>

        <div className="absolute text-center z-20 flex flex-col items-center">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Index</div>
            <div className="text-5xl font-black text-white tracking-tighter leading-none">{storage.getStats().focusScore}</div>
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Optimized</span>
            </div>
        </div>
    </div>
);

const QuickStat = ({ icon: Icon, value, label, colorClass, bgClass, trend }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between gap-4 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 group">
        <div>
            <div className={`w-10 h-10 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors tracking-tight">{value}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-1">{label}</div>
        </div>
        {trend && (
            <div className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.positive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {trend.value}
            </div>
        )}
    </div>
);

const ProgressCharts = () => {
    const stats = storage.getStats();
    const user = storage.getUser();

    return (
        <div id="progress" className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Your Progress</h2>
                    <p className="text-gray-500 dark:text-slate-400">Track your vision improvement journey over time</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option>Last 30 Days</option>
                        <option>This Week</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* NEURAL TELEMETRY DASHBOARD — Premium Redesign */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0f1e] border border-white/5 p-8 shadow-2xl group transition-all duration-500 hover:border-blue-500/30">
                {/* Background Scanning Animation */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent h-1/2 w-full"
                        animate={{ y: [-300, 600] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Main Performance DNA */}
                    <div className="flex items-center gap-8">
                        <div className="relative flex items-center justify-center">
                            <motion.div className="w-40 h-40 rounded-full border-2 border-blue-500/20 border-dashed" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                            <motion.div className="absolute w-32 h-32 rounded-full border border-blue-500/40" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Score</span>
                                <span className="text-4xl font-black text-white">{stats.focusScore}</span>
                                <div className="mt-1 flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                                    <TrendingUp size={8} />
                                    +5%
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Neural <span className="text-blue-400">Telemetry</span></h2>
                            <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed">
                                Real-time cognitive diagnostic & performance mapping.
                            </p>
                        </div>
                    </div>

                    {/* Telemetry Matrix */}
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                        {[
                            { icon: Calendar, label: 'Sessions', value: stats.sessionsThisMonth + storage.getSessions().length, color: 'text-teal-400' },
                            { icon: Clock, label: 'Uptime', value: stats.totalTrainingTime, color: 'text-purple-400' },
                            { icon: Zap, label: 'XP Core', value: user.xp.toLocaleString(), color: 'text-blue-400' },
                            { icon: MousePointer, label: 'Reaction', value: stats.avgReactionTime + 'ms', color: 'text-cyan-400' }
                        ].map((item, i) => (
                            <div key={i} className="relative pl-6 border-l border-white/5 group/item">
                                <div className={`absolute left-[-1px] top-0 h-4 w-0.5 bg-gradient-to-b from-blue-500 to-transparent group-hover/item:h-full transition-all duration-300`} />
                                <div className="flex items-center gap-2 mb-2">
                                    <item.icon className={`w-3 h-3 ${item.color} opacity-60`} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                                </div>
                                <div className="text-2xl font-black text-white tracking-tight">{item.value}</div>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Active Link</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Status Badge */}
                    <div className="hidden xl:flex flex-col items-end gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Stable Sync</span>
                        </div>
                        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-blue-500/50 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Main Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Monthly Progress (Line Chart) */}
                <div className="col-span-1 lg:col-span-8">
                    <Card title="Monthly Skill Progress" className="h-full min-h-[400px]">
                        <LineChart />
                    </Card>
                </div>

                {/* Right Column Mix */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
                    <Card title="Activity Heatmap" className="flex-1">
                        <HeatMap />
                        <div className="flex justify-between items-center mt-6 text-xs text-gray-400 dark:text-slate-500">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-gray-100 dark:bg-slate-800 rounded-sm"></div>
                                <div className="w-3 h-3 bg-teal-900/20 dark:bg-teal-900 rounded-sm"></div>
                                <div className="w-3 h-3 bg-teal-700/40 dark:bg-teal-700 rounded-sm"></div>
                                <div className="w-3 h-3 bg-teal-500/60 dark:bg-teal-500 rounded-sm"></div>
                                <div className="w-3 h-3 bg-teal-400 rounded-sm"></div>
                            </div>
                            <span>More</span>
                        </div>
                    </Card>

                    <Card title="Overall Score" className="flex-1">
                        <CircularProgress />
                        <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-4">You're in the top 25% of users!</p>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="col-span-1 lg:col-span-8">
                    <Card title="XP Earned This Week" className="h-full">
                        <BarChart />
                    </Card>
                </div>

                <div className="col-span-1 lg:col-span-4">
                    <Card title="Skill Breakdown" className="h-full">
                        <div className="space-y-6 pt-2">
                            {[
                                { l: 'Eye Tracking', v: 78, i: '12%', c: 'bg-teal-500', ic: Eye },
                                { l: 'Peripheral Vision', v: 73, i: '8%', c: 'bg-green-500', ic: Eye },
                                { l: 'Reaction Time', v: 82, i: '15%', c: 'bg-blue-500', ic: MousePointer },
                                { l: 'Cognitive Speed', v: 75, i: '10%', c: 'bg-indigo-500', ic: Zap },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-slate-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <s.ic size={14} className="text-gray-400 dark:text-slate-500" />
                                            {s.l}
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold text-gray-900 dark:text-white transition-colors">{s.v}</span>
                                            <span className="text-green-600 dark:text-green-400 text-xs">↗ {s.i}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.v}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full ${s.c} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default ProgressCharts;
