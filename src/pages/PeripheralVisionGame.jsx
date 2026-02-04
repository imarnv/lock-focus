import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, Eye, Zap, BarChart3, FileText, Camera, Play, Copy, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const PeripheralVisionGame = () => {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const features = [
        { icon: Eye, title: "Real Eye Tracking", desc: "MediaPipe-powered gaze detection" },
        { icon: Camera, title: "Webcam Feed", desc: "Live camera with face mesh overlay" },
        { icon: BarChart3, title: "Performance Analytics", desc: "Visual field bias & reaction times" },
        { icon: FileText, title: "PDF Reports", desc: "Downloadable session reports" },
    ];

    const steps = [
        { cmd: "cd /Users/yashsrivastava32/Desktop/lock-focus", label: "Navigate to project" },
        { cmd: "pip install -r requirements.txt", label: "Install Python dependencies" },
        { cmd: "python periquest_enhanced.py", label: "Launch PeriQuest Game" },
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen py-8">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/dashboard" className="p-2 glass rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Peripheral Vision Therapy</h1>
                            <p className="text-muted-foreground">Advanced eye tracking game with comprehensive reports</p>
                        </div>
                    </div>

                    {/* Hero Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 overflow-hidden border border-slate-700"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl">
                                    <Eye className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Desktop Application</span>
                                    <h2 className="text-2xl font-bold text-white">PeriQuest Enhanced</h2>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6 max-w-xl">
                                This game uses Python with real-time eye tracking, PDF report generation,
                                and advanced peripheral vision analysis. Run it from your terminal for the full experience.
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                {features.map((f, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <f.icon className="w-5 h-5 text-blue-400 mb-2" />
                                        <div className="text-sm font-bold text-white">{f.title}</div>
                                        <div className="text-xs text-gray-500">{f.desc}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm font-bold text-amber-400">Requires Python 3.8+</div>
                                    <div className="text-xs text-amber-300/70">Make sure you have Python installed with pip.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Launch Instructions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold">Quick Launch</h3>
                        </div>

                        <div className="space-y-3">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{step.label}</div>
                                        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{step.cmd}</code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(step.cmd, i)}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        {copied === i ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Open a terminal window and run the commands above to start the game.
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        to="/dashboard"
                                        className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default PeripheralVisionGame;
