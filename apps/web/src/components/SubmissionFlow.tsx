import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Trophy, ShieldCheck } from 'lucide-react';

interface SubmissionFlowProps {
    challengeTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function SubmissionFlow({ challengeTitle, isOpen, onClose }: SubmissionFlowProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setStep(4);
            }, 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#D8D9DB]/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-2xl bg-white rounded-[3rem] shadow-glass border border-white overflow-hidden relative z-10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-[#1C1C1E]/20 hover:text-[#1C1C1E] transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-12">
                            {step < 4 ? (
                                <>
                                    <div className="flex gap-2 mb-10">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#FF6B52]' : 'bg-[#E4E5E7]'}`} />
                                        ))}
                                    </div>

                                    <header className="mb-10">
                                        <span className="text-[10px] font-bold text-[#FF6B52] uppercase tracking-[0.2em]">Application</span>
                                        <h2 className="text-3xl font-semibold mt-2">{challengeTitle}</h2>
                                    </header>

                                    <div className="min-h-[200px]">
                                        {step === 1 && (
                                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                                <p className="text-[#1C1C1E]/60 mb-6">Confirm the skills you're using for this challenge submission.</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {['React', 'TypeScript', 'Tailwind', 'System Design'].map(skill => (
                                                        <div key={skill} className="px-5 py-2 bg-[#E4E5E7] rounded-full text-sm font-semibold flex items-center gap-2">
                                                            <Check size={14} className="text-green-600" /> {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                                <p className="text-[#1C1C1E]/60 mb-6">Attach your solution link or upload relevant documentation.</p>
                                                <div className="border-2 border-dashed border-[#E4E5E7] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                                    <div className="w-12 h-12 bg-[#FF6B52]/10 rounded-full flex items-center justify-center text-[#FF6B52] mb-4">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                    <p className="font-bold text-sm">Drop your files here</p>
                                                    <p className="text-xs text-[#1C1C1E]/40 mt-1">or click to browse from computer</p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                                <p className="text-[#1C1C1E]/60 mb-6">Would you like to attach a personalized video proof (Recommended)?</p>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 border border-[#FF6B52] bg-[#FF6B52]/5 rounded-3xl p-6 cursor-pointer hover:bg-[#FF6B52]/10 transition-colors">
                                                        <h4 className="font-bold text-[#FF6B52]">Existing Proof</h4>
                                                        <p className="text-xs text-[#FF6B52]/60 mt-1">Found: 'React Performance Explainer'</p>
                                                    </div>
                                                    <div className="flex-1 border border-[#E4E5E7] rounded-3xl p-6 cursor-pointer hover:bg-[#EAEBEC] transition-colors">
                                                        <h4 className="font-bold">Skip Proof</h4>
                                                        <p className="text-xs text-[#1C1C1E]/40 mt-1">Submit without video</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="mt-12 flex justify-end">
                                        <button
                                            onClick={handleNext}
                                            disabled={isSubmitting}
                                            className="bg-[#1C1C1E] text-white px-10 py-5 rounded-full font-bold shadow-lg hover:translate-x-1 transition-all flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Submitting...' : step === 3 ? 'Finalize Submission' : 'Continue'}
                                            {!isSubmitting && <ArrowRight size={20} />}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/20"
                                    >
                                        <Check size={48} strokeWidth={3} />
                                    </motion.div>
                                    <h2 className="text-4xl font-semibold mb-4">Boom! Submitted.</h2>
                                    <p className="text-[#1C1C1E]/60 max-w-sm mx-auto mb-10">
                                        Your solution and video proof are now being evaluated by our <strong>Proof Analysis Engine</strong>.
                                    </p>

                                    <div className="bg-[#E4E5E7]/50 rounded-3xl p-6 flex items-center justify-between mb-8 max-w-md mx-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1C1C1E] w-8 h-8 rounded-full flex items-center justify-center text-white">
                                                <Zap size={16} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">Expected Result</p>
                                                <p className="text-sm font-bold">~15 minutes</p>
                                            </div>
                                        </div>
                                        <Trophy size={20} className="text-[#1C1C1E]/20" />
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="bg-white border border-[#E4E5E7] px-8 py-4 rounded-full font-bold shadow-soft hover:bg-[#EAEBEC] transition-all"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
