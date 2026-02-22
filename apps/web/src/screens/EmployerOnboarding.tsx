import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, Users, ArrowRight, Check, ShieldCheck, Mail, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EmployerOnboarding() {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        companyName: '',
        industry: '',
        website: '',
        email: ''
    });
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // In a real app, we'd save the profile here
            navigate('/employer/dashboard');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } }
    };

    return (
        <div className="min-h-screen bg-[#E4E5E7] text-[#1C1C1E] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Mesh Gradient Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-proof-accent/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 blur-[100px] rounded-full" />

            <div className="w-full max-w-xl relative z-10">
                {/* Logo & Progress */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-[#1C1C1E] text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                        P
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 bg-[#1C1C1E]' : s < step ? 'w-4 bg-[#1C1C1E]/40' : 'w-4 bg-[#1C1C1E]/10'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white/60 backdrop-blur-2xl border border-white p-12 rounded-[3.5rem] shadow-glass"
                        >
                            <h2 className="text-4xl font-black tracking-tighter mb-4 text-center">TELL US ABOUT<br />YOUR COMPANY</h2>
                            <p className="text-[#1C1C1E]/50 text-center mb-10 font-medium">Let's set up your employer profile for Proof.</p>

                            <div className="space-y-6">
                                <div className="relative group">
                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30 group-focus-within:text-proof-accent transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full bg-white/80 border border-white rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-proof-accent/20 transition-all font-bold tracking-tight placeholder:text-[#1C1C1E]/20"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30 group-focus-within:text-proof-accent transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Industry (e.g. Fintech, AI)"
                                        className="w-full bg-white/80 border border-white rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-proof-accent/20 transition-all font-bold tracking-tight placeholder:text-[#1C1C1E]/20"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white/60 backdrop-blur-2xl border border-white p-12 rounded-[3.5rem] shadow-glass"
                        >
                            <h2 className="text-4xl font-black tracking-tighter mb-4 text-center">VERIFY<br />YOUR DOMAIN</h2>
                            <p className="text-[#1C1C1E]/50 text-center mb-10 font-medium">We only allow verified company representatives.</p>

                            <div className="space-y-6">
                                <div className="relative group">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30 group-focus-within:text-proof-accent transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Company Website"
                                        className="w-full bg-white/80 border border-white rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-proof-accent/20 transition-all font-bold tracking-tight placeholder:text-[#1C1C1E]/20"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30 group-focus-within:text-proof-accent transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Work Email"
                                        className="w-full bg-white/80 border border-white rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-proof-accent/20 transition-all font-bold tracking-tight placeholder:text-[#1C1C1E]/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white/60 backdrop-blur-2xl border border-white p-12 rounded-[3.5rem] shadow-glass text-center"
                        >
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <ShieldCheck size={48} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-4">YOU'RE ALL SET!</h2>
                            <p className="text-[#1C1C1E]/50 mb-10 font-medium px-4">Your company profile is active. You can now start posting challenges and reviewing proofs.</p>

                            <div className="bg-[#1C1C1E]/5 border border-[#1C1C1E]/10 rounded-[2rem] p-6 text-left mb-8">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-3">Next Action</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1C1C1E] shadow-sm">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Create your first challenge</p>
                                        <p className="text-xs text-[#1C1C1E]/40">Attract top talent with work samples.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    onClick={handleNext}
                    className="w-full bg-[#1C1C1E] text-white py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase mt-8 shadow-xl flex items-center justify-center gap-3 transition-colors hover:bg-proof-accent"
                >
                    {step === 3 ? "Enter Dashboard" : "Continue"}
                    <ArrowRight size={16} strokeWidth={3} />
                </motion.button>

                <p className="text-center mt-8 text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-[0.3em]">
                    Proof for Business &middot; Secure & Verified
                </p>
            </div>
        </div>
    );
}
