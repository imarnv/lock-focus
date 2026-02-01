import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import LockEyesAnimation from '../components/LockEyesAnimation';
import Footer from '../components/Footer';

const Navbar = () => {
    const location = useLocation();

    const navItemClass = (path, isLogout = false) => `
        text-sm font-medium transition-all duration-200 px-2 py-1 relative
        ${isLogout ? 'text-red-500 hover:text-red-600 ml-8' : 'text-gray-600 hover:text-blue-600'}
        ${!isLogout && location.pathname === path ? 'text-black font-semibold' : ''}
    `;

    return (
        <nav className="w-full h-20 border-b border-gray-100 flex items-center justify-between px-12 bg-white/90 backdrop-blur-md sticky top-0 z-50">
            {/* BRANDING - Left Aligned */}
            <div className="flex items-center gap-8"> {/* Increased parent gap */}
                <Link to="/dashboard" className="flex items-center gap-6 group"> {/* Increased gap between icon and text from gap-4 to gap-6 */}
                    {/* Compact Icon */}
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0"> {/* Added shrink-0 and ensuring width */}
                        <LockEyesAnimation className="w-full h-full" />
                    </div>
                    {/* Wordmark */}
                    <motion.span
                        layoutId="focus-text"
                        className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors pl-2" // Added pl-2 for extra safety
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        FOCUS
                    </motion.span>
                </Link>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* NAV ITEMS */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/dashboard" className={navItemClass('/dashboard')}>Dashboard</Link>
                    <Link to="/focus-scan" className={navItemClass('/focus-scan')}>Start Scan</Link>
                    <Link to="/reader" className={navItemClass('/reader')}>Reader</Link>
                </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-6">
                {/* Logout moved here for better balance or kept in main nav? User said "Logout (red accent, right-aligned)" */}
                <Link to="/" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">Logout</Link>

                <div className="h-6 w-px bg-gray-200"></div>

                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group">
                        <Bell className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-10 h-10 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-blue-100 transition-all cursor-pointer">
                        <User className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <main className="max-w-7xl mx-auto p-8 pb-32">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
