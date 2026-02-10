import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            setMessages(prev => [...prev, { role: 'assistant', content: data.response, mental_state: data.mental_state }]);
        } catch (error) {
            console.error("Bubble Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Connection Failed: ${error.message}. Is 'python main.py' running?`,
                mental_state: 'error'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Brain size={20} />
                                <span className="font-bold text-sm tracking-tight">Quick Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => navigate('/ai-assistant')} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <Maximize2 size={16} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">How can I help you focus?</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm border ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white border-slate-200 text-slate-700'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3 rounded-2xl">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask anything..."
                                className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2 text-sm font-medium outline-none"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-colors border-2 border-white/20"
            >
                <Brain size={32} />
            </motion.button>
        </div>
    );
};

export default AIChatBubble;
