import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, isUser, timestamp }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}

            <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-card border border-white/10'
                        }`}
                >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message}
                    </div>
                </div>

                {timestamp && (
                    <div className={`text-xs text-muted-foreground mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>

            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
