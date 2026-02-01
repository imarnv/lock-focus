import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-12 text-center pointer-events-none">
                    <motion.div
                        layoutId="focus-text"
                        className="text-4xl font-bold tracking-tighter mb-2"
                    >
                        FOCUS
                    </motion.div>
                    <p className="text-gray-400">Sign in to your focused workspace</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="font-medium text-primary hover:text-primary/80">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white rounded-xl py-4 font-bold tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account? <a href="#" className="font-bold text-gray-900 hover:underline">Get started</a>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
