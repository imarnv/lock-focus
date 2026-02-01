import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

// Using simple Lock icon here, but in real app could reuse the Logo component
const SignUp = () => {
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        // Logic would go here
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500">Unlock your focus potential today.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="hello@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/" className="text-primary font-bold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
