import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Linkedin, Chrome } from 'lucide-react';

type Role = 'candidate' | 'employer';

export function Signup() {
    const [role, setRole] = useState<Role>('candidate');
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) setStep(step + 1);
    };

    return (
        <div className="min-h-screen bg-[#0A192F] text-white flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0A192F] to-[#112240]">
                <Link to="/" className="text-3xl font-bold text-[#64FFDA]">Proof</Link>
                <div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Get hired for what<br />you can <span className="text-[#64FFDA]">actually do</span>.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md">
                        No resumes. No cover letters. Just demonstrate your skills and let employers see the real you.
                    </p>
                </div>
                <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Proof</p>
            </div>

            {/* Right Panel — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-10">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#64FFDA]' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="text-3xl font-bold mb-2">Join Proof</h1>
                            <p className="text-gray-400 mb-8">Choose how you'll use the platform.</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setRole('candidate')}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${role === 'candidate' ? 'border-[#64FFDA] bg-[#64FFDA]/5' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <User className={`w-8 h-8 mb-3 ${role === 'candidate' ? 'text-[#64FFDA]' : 'text-gray-400'}`} />
                                    <p className="font-bold text-lg">Candidate</p>
                                    <p className="text-sm text-gray-400 mt-1">Find your next role</p>
                                </button>
                                <button
                                    onClick={() => setRole('employer')}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${role === 'employer' ? 'border-[#64FFDA] bg-[#64FFDA]/5' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <User className={`w-8 h-8 mb-3 ${role === 'employer' ? 'text-[#64FFDA]' : 'text-gray-400'}`} />
                                    <p className="font-bold text-lg">Employer</p>
                                    <p className="text-sm text-gray-400 mt-1">Hire proven talent</p>
                                </button>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-[#64FFDA] text-[#0A192F] py-4 rounded-xl font-bold text-lg hover:bg-[#5ae6c6] transition-colors flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                            <p className="text-gray-400 mb-8">Sign up with email or connect an account.</p>

                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-sm hover:bg-white/10 transition-colors">
                                    <Chrome className="w-4 h-4" /> Google
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-sm hover:bg-white/10 transition-colors">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-sm hover:bg-white/10 transition-colors">
                                    <Github className="w-4 h-4" /> GitHub
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs text-gray-500">OR</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA] transition-colors" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA] transition-colors" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA] transition-colors" />
                                </div>
                                <button type="submit" className="w-full bg-[#64FFDA] text-[#0A192F] py-4 rounded-xl font-bold text-lg hover:bg-[#5ae6c6] transition-colors flex items-center justify-center gap-2">
                                    Create Account <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                            <div className="w-20 h-20 rounded-full bg-[#64FFDA]/20 flex items-center justify-center mx-auto mb-6">
                                <User className="w-10 h-10 text-[#64FFDA]" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">You're All Set!</h1>
                            <p className="text-gray-400 mb-8">Your {role} account is ready. Let's get started.</p>
                            <Link
                                to={role === 'employer' ? '/employer/onboarding' : '/dashboard'}
                                className="inline-flex items-center gap-2 bg-[#64FFDA] text-[#0A192F] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#5ae6c6] transition-colors"
                            >
                                Go to {role === 'employer' ? 'Setup' : 'Dashboard'} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    )}

                    {step > 1 && step < 3 && (
                        <button onClick={() => setStep(step - 1)} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors">
                            ← Back
                        </button>
                    )}

                    {step === 1 && (
                        <p className="mt-8 text-center text-sm text-gray-500">
                            Already have an account? <Link to="/dashboard" className="text-[#64FFDA] hover:underline">Log in</Link>
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
