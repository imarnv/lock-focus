import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Brain, Trash2, Mic, Settings, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi. I'm your cognitive support partner. I'm here to help you think clearly, organize your thoughts, or just find a way through the overwhelm. What's on your mind right now?",
            mental_state: 'calm'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mentalState, setMentalState] = useState('calm');
    const [activeTasks, setActiveTasks] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const assistantMessage = {
                role: 'assistant',
                content: data.response,
                mental_state: data.mental_state,
                tasks: data.tasks,
                next_step: data.next_step
            };

            setMessages(prev => [...prev, assistantMessage]);
            setMentalState(data.mental_state);
            if (data.tasks) setActiveTasks(data.tasks);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Connection Error: ${error.message}. Please check if 'python main.py' is running and healthy.`,
                mental_state: 'error'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getStyleForState = (state) => {
        switch (state) {
            case 'panic':
            case 'frustration':
                return "bg-amber-50 border-amber-200 text-amber-900";
            case 'fatigue':
                return "bg-blue-50 border-blue-200 text-blue-900";
            default:
                return "bg-slate-50 border-slate-200 text-slate-900";
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
            {/* Header */}
            <header className="p-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Focus AI</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{isLoading ? 'Thinking...' : 'Active Context'}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (confirm("Clear memory and start fresh?")) {
                            await fetch('http://localhost:8000/history', { method: 'DELETE' });
                            setMessages([{
                                role: 'assistant',
                                content: "I've cleared my memory. We can start fresh. What's on your mind?",
                                mental_state: 'calm'
                            }]);
                            setActiveTasks([]);
                        }
                    }}
                    className="text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors px-4 py-2 rounded-full flex items-center gap-2 mr-2"
                >
                    <Trash2 size={16} />
                    <span>Reset</span>
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-full hover:bg-indigo-50"
                >
                    Exit Assistant
                </button>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-5 md:p-6 shadow-sm border ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                                        : `${getStyleForState(msg.mental_state)} rounded-tl-none`
                                        }`}>
                                        {/* Mental State Label Removed for lower cognitive load */}
                                        <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                            {msg.content}
                                        </div>

                                        {msg.next_step && (
                                            <div className="mt-6 pt-6 border-t border-current border-opacity-10">
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3">Suggested Next Step</p>
                                                <div className="flex items-center gap-3 bg-white/20 p-4 rounded-2xl border border-white/30">
                                                    <ArrowRight size={18} className="shrink-0" />
                                                    <span className="font-bold">{msg.next_step}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                        <div className="max-w-4xl mx-auto flex gap-3">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Tell me what's overwhelming you..."
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-200 focus:bg-white rounded-2xl py-4 pl-6 pr-14 text-lg font-medium transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <button className="hidden md:flex w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl items-center justify-center hover:bg-slate-200 transition-colors">
                                <Mic size={24} />
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                            Local AI Engine • Private & Secure • ADHD/Dyslexia Optimized
                        </p>
                    </div>
                </div>

                {/* Sidebar - Task Structure (Visible on Desktop) */}
                <aside className="hidden lg:block w-96 bg-slate-50 border-l border-slate-200 p-8 overflow-y-auto">
                    <div className="mb-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-indigo-500" />
                            Active Task Structure
                        </h2>

                        <div className="space-y-4">
                            {activeTasks.length > 0 ? (
                                [...activeTasks]
                                    .sort((a, b) => {
                                        const weights = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                                        return (weights[b.priority?.toUpperCase()] || 0) - (weights[a.priority?.toUpperCase()] || 0);
                                    })
                                    .map((task, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${task.priority?.toUpperCase() === 'URGENT' ? 'bg-rose-100 text-rose-600' :
                                                        task.priority?.toUpperCase() === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                            task.priority?.toUpperCase() === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                                                                'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {task.priority || 'Normal'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">{task.time || '5m'}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {task.description}
                                            </p>
                                        </motion.div>
                                    ))
                            ) : (
                                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl">
                                    <Brain size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                        No active tasks reconstructed yet. Share your thoughts and I'll help organize them.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default AIAssistant;
