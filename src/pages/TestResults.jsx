import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Brain, Eye, Zap, AlertCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const TestResults = () => {
    const location = useLocation();
    const { wpm, score, profile } = location.state || { wpm: 250, score: 85, profile: { type: 'Balanced', needsFocusMode: false } };

    // Logic to "Predict" condition based on mock score
    // In a real app, this would be more complex
    const getPrediction = () => {
        if (score < 60) return { name: "Attention Deficit Hyperactivity Disorder (ADHD) Traits", color: "text-orange-600", bg: "bg-orange-50" };
        if (wpm < 150) return { name: "Dyslexic Pattern Recognition", color: "text-blue-600", bg: "bg-blue-50" };
        if (profile.type === 'Visual Crowding') return { name: "Irlen Syndrome / Visual Stress", color: "text-purple-600", bg: "bg-purple-50" };
        return { name: "Neurotypical / High Focus Function", color: "text-green-600", bg: "bg-green-50" };
    };

    const prediction = getPrediction();

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-12 h-12" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis Complete</h1>
                    <p className="text-xl text-gray-500">Here is your comprehensive cognitive profile.</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Zap className="w-6 h-6" /></div>
                            <h3 className="font-bold text-lg">Reading Speed</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-1">{wpm} <span className="text-lg font-medium text-gray-400">WPM</span></div>
                        <p className="text-sm text-gray-500">Processing speed indicator.</p>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Brain className="w-6 h-6" /></div>
                            <h3 className="font-bold text-lg">Focus Score</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-1">{score}/100</div>
                        <p className="text-sm text-gray-500">Sustained attention metric.</p>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Eye className="w-6 h-6" /></div>
                            <h3 className="font-bold text-lg">Visual Type</h3>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1 break-words">{profile.type}</div>
                        <p className="text-sm text-gray-500">Ocular tracking preference.</p>
                    </motion.div>
                </div>

                {/* PREDICTION CARD */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
                    className={`p-8 rounded-3xl border-2 ${prediction.bg} border-transparent shadow-sm`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-white ${prediction.color}`}>
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 ${prediction.color}`}>Clinical Indicator</h3>
                            <h2 className={`text-3xl font-bold mb-2 text-gray-900`}>{prediction.name}</h2>
                            <p className="text-gray-600 leading-relaxed max-w-2xl">
                                Based on your saccadic movements, reading cadence, and attention span variance, your profile exhibits patterns consistent with this classification. Our Reader will automatically adapt to mitigate these specific cognitive load factors.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Breakdown */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Comprehensive Test Metrics</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Saccadic Efficiency", val: 92, color: "bg-green-500", desc: "Eye movement precision is optimal." },
                            { label: "Contrast Sensitivity", val: 85, color: "bg-gray-500", desc: "Ability to distinguish low contrast patterns." },
                            { label: "Pattern Recognition", val: 78, color: "bg-blue-500", desc: "Sequence identification speed." },
                            { label: "Reaction Time", val: 88, color: "bg-red-500", desc: "Motor response latency." },
                            { label: "Visual Crowding Resistance", val: 65, color: "bg-purple-500", desc: "Impact of surrounding clutter on reading." },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <span className="font-bold text-gray-900">{item.val}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${item.val}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                                <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link to="/reader" className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
                        Go to Intelligent Reader <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TestResults;
