import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Zap, BarChart3, Camera, Play, Shield, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const PeripheralVisionGame = () => {
    const features = [
        { icon: Target, title: "Fixation Locking", desc: "MUST focus on center to play", color: "text-amber-400" },
        { icon: Eye, title: "Pupil Tracking", desc: "MediaPipe high-fidelity detection", color: "text-cyan-400" },
        { icon: BarChart3, title: "Spatial Heatmap", desc: "Detailed 8-zone ocular map", color: "text-purple-400" },
        { icon: Shield, title: "Validated Metrics", desc: "Clinically-inspired reaction data", color: "text-emerald-400" },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl w-full relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <Link to="/adhd-dashboard" className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Peripheral mastery</h1>
                            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Advanced Gaze-Locked Ocular Training</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl"
                        >
                            <h2 className="text-2xl font-black text-white mb-6 uppercase italic">Expert vision Training</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Unlike standard vision games, <span className="text-white font-bold">PeriQuest Enhanced</span> uses biometric gaze-locking.
                                By forcing fixation on a central hub, we stimulate the rod cells in your periphery,
                                helping you build faster spatial awareness and wider cognitive attention fields.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {features.map((f, i) => (
                                    <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                        <f.icon className={`w-5 h-5 ${f.color} mb-2`} />
                                        <div className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{f.title}</div>
                                        <div className="text-[9px] text-white/30 uppercase mt-1">{f.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex-1 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
                                <h3 className="text-xl font-black uppercase italic mb-4">Ready to start?</h3>
                                <p className="text-blue-100 text-sm mb-8 opacity-80">
                                    Ensure your camera is active and you are in a well-lit environment for best tracking results.
                                </p>
                                <Link to="/peripheral-vision" className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black text-center block transition-all hover:scale-105 shadow-xl shadow-blue-500/20 uppercase tracking-widest italic flex items-center justify-center gap-2">
                                    <Play size={20} fill="currentColor" /> Launch Enhanced Game
                                </Link>
                            </div>

                            <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/20 rounded-xl">
                                        <Camera className="text-amber-400" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white uppercase">Privacy Mode</div>
                                        <div className="text-[10px] text-white/30 uppercase">Local processing only</div>
                                    </div>
                                </div>
                                <Activity className="text-white/10" size={32} />
                            </div>
                        </motion.div>
                    </div>

                    <div className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
                        Validated Ocular Diagnostic System // 2026 Edition
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PeripheralVisionGame;
