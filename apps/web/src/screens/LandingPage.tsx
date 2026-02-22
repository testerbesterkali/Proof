import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, ArrowRight, CheckCircle, Star, Users, Briefcase } from 'lucide-react';

const stats = [
    { label: 'Candidates Hired', value: '2,400+' },
    { label: 'Challenges Completed', value: '18,000+' },
    { label: 'Companies Trust Us', value: '350+' },
];

const steps = [
    { icon: Play, title: 'Upload Your Proof', desc: 'Record a 90-second video showcasing your real skills — no resumes required.' },
    { icon: Shield, title: 'Complete a Challenge', desc: 'Solve real-world tasks from top employers and demonstrate your abilities.' },
    { icon: Zap, title: 'Get Hired', desc: 'Employers see your work first. Get matched and hired based on proof, not promises.' },
];

const testimonials = [
    { name: 'Sarah K.', role: 'Frontend Engineer at Stripe', quote: 'I uploaded one proof and got 3 interview requests within a week.' },
    { name: 'Marcus T.', role: 'Product Designer at Figma', quote: 'Proof let me show my actual design thinking instead of listing tools on a resume.' },
    { name: 'Priya R.', role: 'Data Scientist at Spotify', quote: 'The challenge format was fun and showed employers what I could really do.' },
];

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A192F] text-white overflow-hidden">
            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A192F]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tight">
                        <span className="text-[#64FFDA]">Proof</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                        <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                        <Link to="/dashboard" className="px-5 py-2.5 bg-[#64FFDA] text-[#0A192F] rounded-full font-semibold hover:bg-[#5ae6c6] transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#64FFDA]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-[#64FFDA]/10 text-[#64FFDA] text-sm font-medium px-4 py-2 rounded-full mb-6">
                                <Star className="w-4 h-4" />
                                No resumes. No cover letters. Just proof.
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                                Apply with <span className="text-[#64FFDA]">proof</span>,
                                <br />not promises.
                            </h1>
                            <p className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed">
                                The proof-first job marketplace where candidates demonstrate abilities through video explanations, live tasks, and verified endorsements.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center gap-2 bg-[#64FFDA] text-[#0A192F] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#5ae6c6] transition-all hover:scale-105"
                                >
                                    I'm Job Seeking <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/employer/onboarding"
                                    className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-[#64FFDA] hover:text-[#64FFDA] transition-all"
                                >
                                    I'm Hiring <Briefcase className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right — Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
                                <div className="bg-[#1a2744] rounded-2xl p-6 mb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#64FFDA]/20 flex items-center justify-center">
                                            <Play className="w-5 h-5 text-[#64FFDA]" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Video Proof</p>
                                            <p className="text-xs text-gray-400">React Architecture Walkthrough</p>
                                        </div>
                                        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Verified ✓</span>
                                    </div>
                                    <div className="w-full h-40 bg-gradient-to-br from-[#64FFDA]/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
                                            <Play className="w-8 h-8 text-[#64FFDA]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#64FFDA]/10 rounded-xl p-4">
                                    <CheckCircle className="w-5 h-5 text-[#64FFDA]" />
                                    <p className="text-sm text-[#64FFDA] font-medium">94% Match with 3 employers</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-20 grid grid-cols-3 gap-8 max-w-2xl"
                    >
                        {stats.map((s) => (
                            <div key={s.label}>
                                <p className="text-3xl font-bold text-[#64FFDA]">{s.value}</p>
                                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-24 px-6 bg-[#0d1f3c]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">How Proof Works</h2>
                        <p className="text-gray-400 max-w-md mx-auto">Three simple steps to get hired based on what you can actually do.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#64FFDA]/30 transition-colors"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#64FFDA]/10 flex items-center justify-center mb-6">
                                    <step.icon className="w-7 h-7 text-[#64FFDA]" />
                                </div>
                                <p className="text-xs text-[#64FFDA] font-bold mb-2">STEP {i + 1}</p>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center mb-16"
                    >
                        Real People. Real Hires.
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8"
                            >
                                <p className="text-gray-300 mb-6 leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#64FFDA]/20 flex items-center justify-center text-[#64FFDA] font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to prove yourself?</h2>
                        <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                            Join thousands of candidates who are getting hired for what they can do — not what's on paper.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 bg-[#64FFDA] text-[#0A192F] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#5ae6c6] transition-all hover:scale-105"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
                    <p className="font-bold text-white">Proof</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <p>© {new Date().getFullYear()} Proof. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
