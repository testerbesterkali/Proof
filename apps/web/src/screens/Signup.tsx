import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Linkedin, Chrome, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Role = 'candidate' | 'employer';

export function Signup() {
    const navigate = useNavigate();
    const { signUpWithEmail, signInWithGoogle, signInWithGitHub, signInWithLinkedIn } = useAuth();
    const [role, setRole] = useState<Role>('candidate');
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signUpError } = await signUpWithEmail(email, password, name);

        if (signUpError) {
            setError(signUpError);
            setLoading(false);
            return;
        }

        setLoading(false);
        setStep(3);
    };

    const handleOAuth = async (provider: 'google' | 'github' | 'linkedin') => {
        const redirect = window.location.origin + (role === 'employer' ? '/employer/onboarding' : '/onboarding/candidate');
        if (provider === 'google') await signInWithGoogle(redirect);
        if (provider === 'github') await signInWithGitHub(redirect);
        if (provider === 'linkedin') await signInWithLinkedIn(redirect);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#1C1C1E] flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-proof-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-200/20 rounded-full blur-[100px]" />
                </div>

                <Link to="/" className="text-3xl font-bold relative z-10">
                    proof<span className="text-proof-accent">.</span>
                </Link>
                <div className="relative z-10">
                    <h2 className="text-5xl font-bold tracking-tight leading-tight mb-4">
                        Get hired for what<br />you can <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/50">actually do</span>.
                    </h2>
                    <p className="text-[#1C1C1E]/50 text-lg max-w-md font-medium">
                        No resumes. No cover letters. Just demonstrate your skills and let employers see the real you.
                    </p>
                </div>
                <p className="text-[#1C1C1E]/30 text-sm font-medium relative z-10">© {new Date().getFullYear()} Proof</p>
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
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#1C1C1E]' : 'bg-black/5'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="text-3xl font-bold mb-2 tracking-tight">Join Proof</h1>
                            <p className="text-[#1C1C1E]/50 mb-8 font-medium">Choose how you'll use the platform.</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setRole('candidate')}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${role === 'candidate' ? 'border-[#1C1C1E] bg-[#1C1C1E]/5' : 'border-black/5 bg-white/60 hover:border-black/10'}`}
                                >
                                    <User className={`w-8 h-8 mb-3 ${role === 'candidate' ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/30'}`} />
                                    <p className="font-bold text-lg">Candidate</p>
                                    <p className="text-sm text-[#1C1C1E]/40 mt-1">Find your next role</p>
                                </button>
                                <button
                                    onClick={() => setRole('employer')}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${role === 'employer' ? 'border-[#1C1C1E] bg-[#1C1C1E]/5' : 'border-black/5 bg-white/60 hover:border-black/10'}`}
                                >
                                    <Zap className={`w-8 h-8 mb-3 ${role === 'employer' ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/30'}`} />
                                    <p className="font-bold text-lg">Employer</p>
                                    <p className="text-sm text-[#1C1C1E]/40 mt-1">Hire proven talent</p>
                                </button>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-[#1C1C1E] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-colors flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 className="text-3xl font-bold mb-2 tracking-tight">Create Your Account</h1>
                            <p className="text-[#1C1C1E]/50 mb-8 font-medium">Sign up with email or connect an account.</p>

                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={() => handleOAuth('google')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-white rounded-xl py-3.5 text-sm font-medium hover:bg-white transition-colors shadow-sm"
                                >
                                    <Chrome className="w-4 h-4" /> Google
                                </button>
                                <button
                                    onClick={() => handleOAuth('linkedin')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-white rounded-xl py-3.5 text-sm font-medium hover:bg-white transition-colors shadow-sm"
                                >
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </button>
                                <button
                                    onClick={() => handleOAuth('github')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-white rounded-xl py-3.5 text-sm font-medium hover:bg-white transition-colors shadow-sm"
                                >
                                    <Github className="w-4 h-4" /> GitHub
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-black/5" />
                                <span className="text-xs text-[#1C1C1E]/30 font-bold">OR</span>
                                <div className="flex-1 h-px bg-black/5" />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/30" />
                                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/60 backdrop-blur-md border border-white rounded-xl py-4 pl-12 pr-4 text-[#1C1C1E] placeholder-[#1C1C1E]/30 focus:outline-none focus:border-[#1C1C1E]/20 transition-colors shadow-sm" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/30" />
                                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/60 backdrop-blur-md border border-white rounded-xl py-4 pl-12 pr-4 text-[#1C1C1E] placeholder-[#1C1C1E]/30 focus:outline-none focus:border-[#1C1C1E]/20 transition-colors shadow-sm" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/30" />
                                    <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/60 backdrop-blur-md border border-white rounded-xl py-4 pl-12 pr-4 text-[#1C1C1E] placeholder-[#1C1C1E]/30 focus:outline-none focus:border-[#1C1C1E]/20 transition-colors shadow-sm" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1C1C1E] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 tracking-tight">You're All Set!</h1>
                            <p className="text-[#1C1C1E]/50 mb-2 font-medium">Your {role} account has been created.</p>
                            <p className="text-[#1C1C1E]/30 text-sm mb-8">Check your email to confirm your account, then continue below.</p>
                            <Link
                                to={role === 'employer' ? '/employer/onboarding' : '/onboarding/candidate'}
                                className="inline-flex items-center gap-2 bg-[#1C1C1E] text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-colors"
                            >
                                Go to {role === 'employer' ? 'Setup' : 'Dashboard'} <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    )}

                    {step > 1 && step < 3 && (
                        <button onClick={() => setStep(step - 1)} className="mt-6 text-sm text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors font-medium">
                            ← Back
                        </button>
                    )}

                    {step === 1 && (
                        <p className="mt-8 text-center text-sm text-[#1C1C1E]/40 font-medium">
                            Already have an account? <Link to="/login" className="text-[#1C1C1E] font-bold hover:underline">Log in</Link>
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
