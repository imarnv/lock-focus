import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Activity, Users, Star, Play } from 'lucide-react';
import ProjectNavbar from '../components/ProjectNavbar';
import { useNavigate } from 'react-router-dom';

const ProjectPage = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative">

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Dark Mode: Deep Navy/Teal Glows */}
                <div className="dark:block hidden absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="dark:block hidden absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-blob"></div>

                {/* Light Mode: Soft Blue Glows */}
                <div className="dark:hidden block absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[100px]"></div>
                <div className="dark:hidden block absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-teal-100/40 rounded-full blur-[100px]"></div>

                {/* Neural Pattern Overlay (Optional SVG or CSS Pattern could go here) */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="neural-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#neural-pattern)" />
                </svg>
            </div>

            <ProjectNavbar />

            {/* Hero Section */}
            <header className="relative z-10 container mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-secondary mb-8">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground/80">The Future of Vision Therapy is Here</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Train Your Eyes. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Unlock Your Vision.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        NeuroVision combines gamified therapy with clinical expertise to help you improve eye coordination, visual processing, and cognitive performance—one fun session at a time.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Free Trial
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-background border border-foreground/10 hover:border-foreground/30 text-foreground rounded-full font-semibold transition-all hover:bg-secondary/50 flex items-center justify-center gap-2 group">
                            Take Free Assessment
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl border-t border-foreground/5 pt-12"
                >
                    {[
                        { label: 'Active Users', value: '50K+' },
                        { label: 'Improvement Rate', value: '92%' },
                        { label: 'Sessions Completed', value: '1M+' },
                        { label: 'User Rating', value: '4.9' },
                    ].map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</span>
                            <span className="text-sm text-foreground/50 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </header>

            {/* How It Works */}
            <section className="py-20 md:py-32 relative z-10 bg-secondary/30 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It <span className="text-primary">Works</span></h2>
                        <p className="text-foreground/60 max-w-xl mx-auto">Getting started with NeuroVision is simple. Begin your vision improvement journey in just three steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            { step: '01', title: 'Take Assessment', desc: 'Complete a quick visual assessment to understand your starting point and identify areas for improvement.' },
                            { step: '02', title: 'Get Your Plan', desc: 'Receive a personalized therapy plan with games and exercises tailored to your specific needs.' },
                            { step: '03', title: 'Train & Track', desc: 'Complete daily sessions, earn rewards, and watch your vision and cognitive abilities improve.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                className="relative p-8 rounded-2xl bg-background/50 border border-foreground/5 hover:border-primary/30 transition-colors group"
                            >
                                <div className="text-6xl font-bold text-foreground/5 absolute top-4 right-6 select-none opacity-50 group-hover:text-primary/10 transition-colors">
                                    {item.step}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 md:py-32 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by <span className="text-primary">Thousands</span></h2>
                        <p className="text-foreground/60 max-w-xl mx-auto">See what our users have to say about their NeuroVision journey.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: 'Sarah M.', role: 'Parent', quote: "After 3 months, my child's reading speed improved by 40%. The games make therapy something they look forward to!" },
                            { name: 'Dr. James Wilson', role: 'Optometrist', quote: "As an optometrist, I recommend NeuroVision to all my patients. The progress tracking is invaluable." },
                            { name: 'Michael R.', role: 'Software Developer', quote: "I was skeptical at first, but the streak system kept me motivated. My eye strain has reduced significantly." },
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-secondary/40 border border-foreground/5 shadow-sm"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                </div>
                                <p className="text-foreground/80 italic mb-6">"{review.quote}"</p>
                                <div>
                                    <div className="font-bold">{review.name}</div>
                                    <div className="text-sm text-foreground/50">{review.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-secondary to-background p-12 md:p-16 rounded-3xl border border-foreground/10 text-center relative overflow-hidden shadow-2xl">
                        {/* Glow effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to Transform Your Vision?</h2>
                        <p className="text-foreground/70 mb-10 max-w-lg mx-auto relative z-10">
                            Join thousands of users who have improved their visual and cognitive abilities with NeuroVision.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="relative z-10 px-10 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
                        >
                            Start Free Trial
                        </button>
                        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-foreground/50 relative z-10">
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> No credit card required</span>
                            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> 7-day free trial</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-10 border-t border-foreground/5 text-center text-foreground/40 text-sm relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-bold text-foreground">NeuroVision</span>
                </div>
                <p>&copy; 2026 NeuroVision. All rights reserved.</p>
            </footer>

        </div>
    );
};

export default ProjectPage;
