import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Zap, Eye, MousePointer } from 'lucide-react';

const Card = ({ children, className = "", title }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm dark:shadow-none transition-colors duration-300 ${className}`}>
        {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{title}</h3>}
        {children}
    </div>
);

const LineChart = () => (
    <div className="h-48 relative w-full pt-4 group">
        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map((val, i) => (
            <div key={i} className="absolute w-full border-t border-gray-100 dark:border-slate-800 transition-colors" style={{ bottom: `${val}%` }}>
                <span className="absolute -left-8 -top-2 text-xs text-gray-400 dark:text-slate-500">{val}</span>
            </div>
        ))}

        {/* X Axis Labels */}
        <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-400 dark:text-slate-500 px-2 transition-opacity">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
        </div>

        <svg className="w-full h-full overflow-visible">
            {/* Tracking (Teal) */}
            <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M 0 50 Q 150 40 300 35 T 600 20"
                fill="none" stroke="#2dd4bf" strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-sm dark:drop-shadow-none"
            />
            {/* Dots */}
            {[0, 150, 300, 600].map((x, i) => (
                <circle key={i} cx={`${i * 33}%`} cy={i === 0 ? "50" : i === 1 ? "40" : i === 2 ? "35" : "20"} r="4"
                    className="fill-white dark:fill-slate-900 stroke-teal-400"
                    strokeWidth="3"
                />
            ))}

            {/* Peripheral (Green) */}
            <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                d="M 0 80 Q 150 70 300 75 T 600 50"
                fill="none" stroke="#4ade80" strokeWidth="3"
                vectorEffect="non-scaling-stroke"
            />
            {/* Reaction (Blue) */}
            <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                d="M 0 60 Q 150 65 300 55 T 600 40"
                fill="none" stroke="#60a5fa" strokeWidth="3"
                vectorEffect="non-scaling-stroke"
            />
        </svg>

        <div className="flex gap-4 mt-8 justify-center text-xs">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-400"></div><span className="text-gray-500 dark:text-slate-400">Tracking</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div><span className="text-gray-500 dark:text-slate-400">Peripheral</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div><span className="text-gray-500 dark:text-slate-400">Reaction</span></div>
        </div>
    </div>
);

const BarChart = () => (
    <div className="h-40 w-full flex items-end justify-between gap-2 pt-8">
        {[
            { d: 'Mon', v: 40 }, { d: 'Tue', v: 25 }, { d: 'Wed', v: 60 },
            { d: 'Thu', v: 45 }, { d: 'Fri', v: 80 }, { d: 'Sat', v: 20 }, { d: 'Sun', v: 50 }
        ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.v}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="w-full bg-teal-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        {item.v * 10} XP
                    </div>
                </motion.div>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">{item.d}</span>
            </div>
        ))}
    </div>
);

const HeatMap = () => (
    <div className="grid grid-cols-7 gap-1.5 ">
        {Array.from({ length: 28 }).map((_, i) => {
            const opacity = Math.random() > 0.3 ? `opacity-${[20, 40, 60, 80, 100][Math.floor(Math.random() * 5)]}` : 'opacity-10';
            // Simulating random activity shades
            const isActive = Math.random() > 0.5;

            return (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`aspect-square rounded-sm ${isActive ? 'bg-teal-400' : 'bg-gray-100 dark:bg-slate-800'} ${isActive ? `opacity-${Math.floor(Math.random() * 4 + 2) * 25}` : ''}`}
                />
            )
        })}
    </div>
);

const CircularProgress = ({ value = 77 }) => (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
        <svg className="w-full h-full -rotate-90">
            {/* Background Track */}
            <circle cx="64" cy="64" r="56" fill="none" className="stroke-gray-100 dark:stroke-slate-800 transition-colors" strokeWidth="12" />
            <motion.circle
                cx="64" cy="64" r="56" fill="none" stroke="#2dd4bf" strokeWidth="12" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: value / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeDasharray="1 1"
            />
        </svg>
        <div className="absolute text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{value}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-400 uppercase tracking-wider">out of 100</div>
        </div>
    </div>
);

const QuickStat = ({ icon: Icon, value, label, colorClass, bgClass }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-3xl flex items-center gap-4 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}><Icon size={20} /></div>
        <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{value}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);

const ProgressCharts = () => {
    return (
        <div id="progress" className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Your Progress</h2>
                <p className="text-gray-500 dark:text-slate-400">Track your vision improvement journey over time</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat icon={Calendar} value="22" label="Sessions This Month" colorClass="text-teal-600 dark:text-teal-400" bgClass="bg-teal-50 dark:bg-slate-800" />
                <QuickStat icon={Clock} value="5h 32m" label="Total Training Time" colorClass="text-green-600 dark:text-green-400" bgClass="bg-green-50 dark:bg-slate-800" />
                <QuickStat icon={TrendingUp} value="+18%" label="Overall Improvement" colorClass="text-blue-600 dark:text-blue-400" bgClass="bg-blue-50 dark:bg-slate-800" />
                <QuickStat icon={Zap} value="2,850" label="Total XP Earned" colorClass="text-yellow-600 dark:text-yellow-400" bgClass="bg-yellow-50 dark:bg-slate-800" />
            </div>

            {/* Main Grids */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Monthly Progress (Line Chart) */}
                <div className="col-span-12 md:col-span-8">
                    <Card title="Monthly Skill Progress" className="h-[400px]">
                        <LineChart />
                    </Card>
                </div>

                {/* Right Column Mix */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                    <Card title="Activity Heatmap">
                        <HeatMap />
                        <div className="flex justify-between items-center mt-4 text-xs text-gray-400 dark:text-slate-500">
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

                    <Card title="Overall Score">
                        <CircularProgress />
                        <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-4">You're in the top 25% of users!</p>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="col-span-12 md:col-span-8">
                    <Card title="XP Earned This Week">
                        <BarChart />
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-4">
                    <Card title="Skill Breakdown" className="h-full">
                        <div className="space-y-6">
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
