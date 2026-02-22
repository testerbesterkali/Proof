import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Linkedin, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
    const navigate = useNavigate();
    const { signInWithEmail, signInWithGoogle, signInWithGitHub, signInWithLinkedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signInError } = await signInWithEmail(email, password);

        if (signInError) {
            setError(signInError);
            setLoading(false);
            return;
        }

        setLoading(false);
        navigate('/dashboard');
    };

    const handleOAuth = async (provider: 'google' | 'github' | 'linkedin') => {
        const redirect = window.location.origin + '/dashboard';
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
                        Welcome<br />back<span className="text-proof-accent">.</span>
                    </h2>
                    <p className="text-[#1C1C1E]/50 text-lg max-w-md font-medium">
                        Pick up where you left off. Your challenges, connections, and proof of work are waiting.
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
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Sign In</h1>
                    <p className="text-[#1C1C1E]/50 mb-8 font-medium">Enter your credentials or use a connected account.</p>

                    {/* Social sign‑in */}
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
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/30" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/60 backdrop-blur-md border border-white rounded-xl py-4 pl-12 pr-4 text-[#1C1C1E] placeholder-[#1C1C1E]/30 focus:outline-none focus:border-[#1C1C1E]/20 transition-colors shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C1C1E]/30" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/60 backdrop-blur-md border border-white rounded-xl py-4 pl-12 pr-4 text-[#1C1C1E] placeholder-[#1C1C1E]/30 focus:outline-none focus:border-[#1C1C1E]/20 transition-colors shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1C1C1E] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</>
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#1C1C1E]/40 font-medium">
                        Don't have an account? <Link to="/signup" className="text-[#1C1C1E] font-bold hover:underline">Sign up</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
