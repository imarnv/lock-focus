import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Book, Target, Activity, Check, ArrowRight, Eye } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

const VisionCard = ({ title, description, icon: Icon, to, colorClass, active, onClick, delay, type }) => {
    // Unique Simulation Visuals for each card type
    const SimulationViewport = () => {
        if (type === 'adhd') {
            return (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-400 rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                    ))}
                    <motion.div className="absolute inset-0 border border-orange-500/20 rounded-full scale-150" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
                </div>
            );
        }
        if (type === 'dyslexia') {
            return (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity flex flex-col gap-2 p-6">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-1 bg-green-400 rounded-full"
                            style={{ width: `${60 + Math.random() * 40}%` }}
                            animate={{ x: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3 + i, repeat: Infinity }}
                        />
                    ))}
                </div>
            );
        }
        if (type === 'peripheral') {
            return (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                    <motion.div className="w-16 h-16 border border-red-500/30 rounded-full" animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                    <motion.div className="absolute w-2 h-2 bg-red-500 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                </div>
            );
        }
        return ( // stress
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"
                    animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        );
    };

    return (
        <Link to={to} onClick={onClick} className="block group h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay, ease: "easeOut" }}
                className={`
                    relative overflow-hidden rounded-[2.5rem] p-0 h-full border transition-all duration-500
                    ${active
                        ? 'bg-[#111a30] border-blue-500/50 shadow-[0_15px_45px_rgba(59,130,246,0.15)] shadow-blue-500/10'
                        : 'bg-white dark:bg-[#0f172a] border-gray-100 dark:border-slate-800/80 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1'}
                `}
            >
                {/* Simulation Viewport - Background Visual */}
                <div className="absolute inset-0 z-0">
                    <SimulationViewport />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]/90 dark:to-[#0f172a]/100" />
                </div>

                {/* Technical HUD Overlays */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-4 left-4 w-4 h-[1px] bg-white" />
                    <div className="absolute top-4 left-4 w-[1px] h-4 bg-white" />
                    <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white" />
                    <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between p-8">
                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                                ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : `bg-gray-50 dark:bg-slate-800/50 ${colorClass.replace('bg-', 'text-').replace('/10', '')} border border-gray-100 dark:border-slate-700/50 group-hover:border-blue-500/30`}
                            `}>
                                <Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-[0.2em] transition-colors
                                ${active ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                {active ? 'Active' : 'LOCKED'}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                            {title}
                        </h3>

                        <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
                            {description}
                        </p>
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400'}`}>
                                {active ? 'Diagnostic Sync' : 'Initiate Simulation'}
                            </span>
                            <ArrowRight size={14} className={active ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400'} />
                        </div>
                        <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                            ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border border-white/10 text-gray-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30 group-hover:border-transparent'}
                        `}>
                            {active ? <Check size={20} strokeWidth={3} /> : <Zap size={20} />}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const VisionStudioCards = () => {
    const { accessibilityMode } = useTheme();

    const features = [
        {
            id: 'adhd',
            type: 'adhd',
            title: 'ADHD Mode',
            description: 'Hyper-focused cognitive filter with motion-stabilized UI components.',
            icon: Zap,
            to: '/adhd-dashboard',
            colorClass: 'bg-orange-500',
            active: accessibilityMode === 'adhd'
        },
        {
            id: 'dyslexia',
            type: 'dyslexia',
            title: 'Dyslexia Mode',
            description: 'Advanced typography scaling & high-contrast line spacing system.',
            icon: Book,
            to: '/dyslexia-dashboard',
            colorClass: 'bg-green-500',
            active: accessibilityMode === 'dyslexia'
        },
        {
            id: 'peripheral',
            type: 'peripheral',
            title: 'Peripheral',
            description: 'Dynamic ocular expansion training with automated target generation.',
            icon: Target,
            to: '/peripheral-vision',
            colorClass: 'bg-red-500',
            active: false
        },
        {
            id: 'stress',
            type: 'stress',
            title: 'Stress Relief',
            description: 'Subliminal calming sequences to reduce neural oscillation stress.',
            icon: Activity,
            to: '/stress-dashboard',
            colorClass: 'bg-pink-500',
            active: accessibilityMode === 'stress'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
                <VisionCard
                    key={feature.id}
                    {...feature}
                    delay={0.1 * index}
                    onClick={() => { }}
                />
            ))}
        </div>
    );
};

export default VisionStudioCards;
