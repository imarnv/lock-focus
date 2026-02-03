import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Volume2, Shield, HelpCircle, LogOut, Sun, Moon, ChevronRight, Award, Zap, Calendar } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ProfileDropdown = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={onClose}
                    />

                    {/* Dropdown Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 right-12 z-50 w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {/* Header Section */}
                        <div className="p-6 bg-slate-950/50 border-b border-slate-800 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-teal-400 flex items-center justify-center text-slate-900 text-2xl font-bold border-4 border-slate-800/50 shadow-lg relative">
                                    A
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Alex Johnson</h3>
                                    <p className="text-xs text-slate-400">Vision training since Oct 2024</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar size={12} className="text-slate-500" />
                                        <span className="text-xs text-slate-500">Member for 4 months</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex justify-between mt-6 px-2">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">2,850</div>
                                    <div className="text-xs text-slate-400">Total XP</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">12</div>
                                    <div className="text-xs text-slate-400">Day Streak</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">15</div>
                                    <div className="text-xs text-slate-400">Badges</div>
                                </div>
                            </div>
                        </div>

                        {/* Settings & Preferences */}
                        <div className="p-4 space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">General</div>

                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                    </div>
                                    <div className="text-sm font-medium">Dark Mode</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={theme === 'dark'}
                                        onChange={toggleTheme}
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                </label>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-purple-400 transition-colors">
                                        <Bell size={18} />
                                    </div>
                                    <div className="text-sm font-medium">Push Notifications</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                </label>
                            </div>

                            {/* Sound */}
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-pink-400 transition-colors">
                                        <Volume2 size={18} />
                                    </div>
                                    <div className="text-sm font-medium">Sound Effects</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                </label>
                            </div>
                        </div>

                        <div className="p-4 pt-0 space-y-1">
                            {/* Privacy */}
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-green-400 transition-colors">
                                        <Shield size={18} />
                                    </div>
                                    <div className="text-sm font-medium">Privacy & Security</div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600" />
                            </button>

                            {/* Help */}
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-yellow-400 transition-colors">
                                        <HelpCircle size={18} />
                                    </div>
                                    <div className="text-sm font-medium">Help & Support</div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-950/30 border-t border-slate-800">
                            <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileDropdown;
