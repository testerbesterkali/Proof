import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, ArrowRight, CheckCircle, Star, Users, Briefcase, ChevronRight } from 'lucide-react';

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

const companies = ['Stripe', 'Vercel', 'Linear', 'Figma', 'Notion', 'Supabase'];

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#1C1C1E] overflow-hidden">
            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-black/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tight">
                        proof<span className="text-proof-accent">.</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-[#1C1C1E]/60 font-medium">
                        <a href="#how-it-works" className="hover:text-[#1C1C1E] transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-[#1C1C1E] transition-colors">Testimonials</a>
                        <Link to="/signup" className="hover:text-[#1C1C1E] transition-colors">Sign Up</Link>
                        <Link to="/login" className="px-5 py-2.5 bg-[#1C1C1E] text-white rounded-full font-semibold hover:bg-[#1C1C1E]/80 transition-colors text-sm">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background gradient blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-proof-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-2xl mb-8 shadow-sm"
                            >
                                <Zap size={10} className="text-proof-accent fill-proof-accent" />
                                AI-Powered Talent Matching
                            </motion.div>
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">
                                Apply with{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/50">
                                    proof
                                </span>,
                                <br />not promises.
                            </h1>
                            <p className="text-[#1C1C1E]/50 text-base leading-relaxed font-medium max-w-lg mb-10">
                                The proof-first job marketplace where candidates demonstrate abilities through video explanations, live tasks, and verified endorsements.
                                <span className="text-[#1C1C1E] block mt-2">No resumes. No cover letters. Just real work.</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#1C1C1E]/80 transition-all hover:scale-[1.02] shadow-lg"
                                >
                                    I'm Job Seeking <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/employer/onboarding"
                                    className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white text-[#1C1C1E] px-8 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-sm"
                                >
                                    I'm Hiring <Briefcase className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right — Card Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white p-8 shadow-glass">
                                {/* Video proof card */}
                                <div className="bg-[#F8F9FB] rounded-2xl p-6 mb-4 border border-black/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-proof-accent/10 flex items-center justify-center">
                                            <Play className="w-5 h-5 text-proof-accent" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Video Proof</p>
                                            <p className="text-xs text-[#1C1C1E]/40">React Architecture Walkthrough</p>
                                        </div>
                                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Verified ✓</span>
                                    </div>
                                    <div className="w-full h-40 bg-gradient-to-br from-proof-accent/5 to-purple-100/30 rounded-xl flex items-center justify-center border border-black/5">
                                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg backdrop-blur">
                                            <Play className="w-8 h-8 text-[#1C1C1E]" />
                                        </div>
                                    </div>
                                </div>
                                {/* Match indicator */}
                                <div className="flex items-center gap-3 bg-[#1C1C1E] rounded-2xl p-4 text-white">
                                    <CheckCircle className="w-5 h-5 text-proof-accent" />
                                    <p className="text-sm font-semibold">94% Match · 3 employers interested</p>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-4 -left-4 bg-white rounded-2xl py-3 px-5 shadow-xl border border-black/5 flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Sarah hired at Stripe</p>
                                    <p className="text-[10px] text-[#1C1C1E]/40">via Proof · 3 days ago</p>
                                </div>
                            </motion.div>
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
                                <p className="text-3xl font-bold text-[#1C1C1E]">{s.value}</p>
                                <p className="text-sm text-[#1C1C1E]/40 mt-1 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Trusted by */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 flex items-center gap-6"
                    >
                        <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30">Trusted by</p>
                        <div className="flex items-center gap-6">
                            {companies.map(c => (
                                <span key={c} className="text-sm font-bold text-[#1C1C1E]/20">{c}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-xs font-black tracking-[0.2em] uppercase text-[#1C1C1E]/30 mb-3">HOW IT WORKS</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Three steps to your next role</h2>
                        <p className="text-[#1C1C1E]/50 max-w-md mx-auto font-medium">Get hired based on what you can actually do — not what's on paper.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass hover:shadow-xl transition-shadow"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mb-6">
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1C1C1E]/30 mb-2">STEP {i + 1}</p>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                                <p className="text-[#1C1C1E]/50 text-sm leading-relaxed font-medium">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimonials" className="py-24 px-6 bg-white/40">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-xs font-black tracking-[0.2em] uppercase text-[#1C1C1E]/30 mb-3">TESTIMONIALS</p>
                        <h2 className="text-4xl font-bold tracking-tight">Real people. Real hires.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-[#1C1C1E]/70 mb-6 leading-relaxed font-medium text-sm">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{t.name}</p>
                                        <p className="text-xs text-[#1C1C1E]/40 font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#1C1C1E] rounded-[2.5rem] p-12 md:p-16 text-white text-center shadow-2xl"
                    >
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Ready to prove yourself?</h2>
                        <p className="text-white/50 mb-10 max-w-lg mx-auto font-medium">
                            Join thousands of candidates getting hired for what they can do — not what's on paper.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 bg-white text-[#1C1C1E] px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-[1.02]"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-black/5 py-10 px-6 bg-white/40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#1C1C1E]/40">
                    <p className="font-bold text-[#1C1C1E]">proof<span className="text-proof-accent">.</span></p>
                    <div className="flex gap-6 font-medium">
                        <a href="#" className="hover:text-[#1C1C1E] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#1C1C1E] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#1C1C1E] transition-colors">Contact</a>
                    </div>
                    <p className="font-medium">© {new Date().getFullYear()} Proof. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
