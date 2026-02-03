import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import LockEyesAnimation from './LockEyesAnimation';

const ProjectNavbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-md border-b border-foreground/10 py-3 shadow-sm'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('/')}>
                    {/* Compact Icon */}
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <LockEyesAnimation className="w-full h-full" />
                    </div>
                    {/* Wordmark */}
                    <motion.span
                        layoutId="focus-text"
                        className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors pl-2"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        FOCUS
                    </motion.span>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-foreground/5 text-foreground transition-colors relative overflow-hidden group"
                        aria-label="Toggle Theme"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors py-2 px-4"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default ProjectNavbar;
