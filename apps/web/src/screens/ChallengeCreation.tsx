import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Palette, BarChart3, Megaphone, ArrowRight, ArrowLeft, Trophy, Users, Shield, Plus, X, Info, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ChallengeCreation() {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        type: '',
        title: '',
        description: '',
        timeLimit: '60',
        prize: '0',
        rubric: [
            { criterion: 'Technical Accuracy', weight: 40 },
            { criterion: 'Communication', weight: 30 },
            { criterion: 'Implementation Speed', weight: 30 }
        ]
    });
    const navigate = useNavigate();

    const types = [
        { id: 'code', label: 'Technical/Code', icon: Code, desc: 'Debugging, systems, or architecture tasks.' },
        { id: 'design', label: 'Product Design', icon: Palette, desc: 'UX audits, UI design, or prototyping.' },
        { id: 'analysis', label: 'Data Analysis', icon: BarChart3, desc: 'SQL challenges or data storytelling.' },
        { id: 'sales', label: 'Sales/Pitch', icon: Megaphone, desc: 'Mock pitches or communication tasks.' },
    ];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handlePublish = () => navigate('/employer/dashboard');

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-[#E4E5E7] text-[#1C1C1E] flex flex-col font-sans">
            {/* Header */}
            <header className="p-8 border-b border-[#1C1C1E]/5 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/employer/dashboard')} className="w-10 h-10 rounded-full hover:bg-[#1C1C1E]/5 flex items-center justify-center transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="font-black tracking-tighter text-xl uppercase">Create Challenge</h2>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-12 bg-[#1C1C1E]' : s < step ? 'w-6 bg-proof-accent' : 'w-6 bg-[#1C1C1E]/10'}`} />
                    ))}
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto py-20 px-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h1 className="text-5xl font-black tracking-tighter mb-4">WHAT KIND OF<br />CHALLENGE IS IT?</h1>
                            <p className="text-[#1C1C1E]/40 font-bold mb-12 uppercase tracking-widest text-sm">Select a template to get started</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {types.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setFormData({ ...formData, type: t.id }); handleNext(); }}
                                        className={`group p-8 rounded-[3rem] border-2 transition-all text-left flex flex-col items-start gap-6 ${formData.type === t.id ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]' : 'bg-white border-transparent hover:border-[#1C1C1E]/10 hover:shadow-glass'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-2xl ${formData.type === t.id ? 'bg-white/10 text-white' : 'bg-[#1C1C1E]/5 text-[#1C1C1E]'} transition-colors`}>
                                            <t.icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight mb-2">{t.label}</h3>
                                            <p className={`text-sm font-medium ${formData.type === t.id ? 'text-white/60' : 'text-[#1C1C1E]/40'}`}>{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-12">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1C1C1E]/30 mb-8">Basic Information</h2>
                                <input
                                    type="text"
                                    placeholder="Challenge Title (e.g. Senior Backend Systems Audit)"
                                    className="w-full bg-transparent border-b-4 border-[#1C1C1E]/5 focus:border-proof-accent py-6 text-4xl font-black tracking-tighter focus:outline-none transition-all placeholder:text-[#1C1C1E]/10"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <div className="mt-8 relative">
                                    <textarea
                                        placeholder="Instructions for the candidate..."
                                        className="w-full bg-white rounded-[2.5rem] p-10 min-h-[300px] font-bold text-lg focus:outline-none shadow-soft border border-white"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                    <div className="absolute top-8 right-8 text-[#1C1C1E]/20 hover:text-proof-accent cursor-pointer transition-colors"><Info size={20} /></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1C1C1E]/30">Scoring Rubric</h2>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-proof-accent hover:text-[#1C1C1E] transition-colors">
                                        <Plus size={14} strokeWidth={3} /> Add Criteria
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.rubric.map((r, i) => (
                                        <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#1C1C1E] text-white rounded-xl flex items-center justify-center font-black text-xs">{r.weight}%</div>
                                                <span className="font-black uppercase tracking-widest text-xs">{r.criterion}</span>
                                            </div>
                                            <button className="text-[#1C1C1E]/20 hover:text-red-500 transition-colors"><X size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-12">
                                <button onClick={handleBack} className="px-10 py-6 bg-white rounded-3xl font-black text-xs tracking-widest uppercase shadow-soft hover:shadow-lg transition-all">Back</button>
                                <button onClick={handleNext} className="flex-1 bg-[#1C1C1E] text-white py-6 rounded-3xl font-black text-xs tracking-widest uppercase shadow-xl hover:bg-proof-accent transition-all flex items-center justify-center gap-2">
                                    Next Stage <ArrowRight size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                            <h1 className="text-5xl font-black tracking-tighter mb-4 text-center">FINALIZE &<br />PUBLISH</h1>
                            <p className="text-[#1C1C1E]/40 font-bold mb-12 uppercase tracking-widest text-sm text-center">Set the rewards and visibility for your challenge</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center"><Trophy size={24} /></div>
                                        <h3 className="font-black tracking-tight text-xl">Prize Pool</h3>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="$0 (Exposure/Unpaid)"
                                        className="w-full bg-[#E4E5E7]/30 border border-transparent rounded-2xl py-5 px-6 font-black text-2xl focus:outline-none focus:border-proof-accent transition-all"
                                        value={formData.prize}
                                        onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                    />
                                    <p className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest mt-4 leading-relaxed">Prizes attract 400% more qualified submissions on average.</p>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Shield size={24} /></div>
                                        <h3 className="font-black tracking-tight text-xl">Visibility</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <button className="w-full p-4 rounded-2xl bg-[#1C1C1E] text-white flex items-center justify-between font-black text-xs tracking-widest uppercase">
                                            Public Bounty <Check size={16} />
                                        </button>
                                        <button className="w-full p-4 rounded-2xl bg-[#1C1C1E]/5 text-[#1C1C1E]/40 flex items-center justify-between font-black text-xs tracking-widest uppercase">
                                            Invite Only <Users size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handlePublish} className="w-full bg-proof-accent text-white py-10 rounded-[3rem] font-black text-xl tracking-[0.1em] uppercase shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                                PUBLISH CHALLENGE NOW <ArrowRight size={24} strokeWidth={3} />
                            </button>
                            <button onClick={handleBack} className="w-full mt-6 py-4 font-black text-[10px] tracking-[0.3em] text-[#1C1C1E]/20 uppercase hover:text-[#1C1C1E] transition-colors">Change Details</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
