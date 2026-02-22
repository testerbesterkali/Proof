import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Palette, BarChart3, Megaphone, ArrowRight, ArrowLeft, Trophy, Users, Shield, Plus, X, Clock, Loader2, CheckCircle, Zap, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SuggestionInput } from '../components/SuggestionInput';

const challengeTypes = [
    { id: 'code', label: 'Technical / Code', icon: Code, desc: 'Debugging, systems design, or architecture tasks' },
    { id: 'design', label: 'Product Design', icon: Palette, desc: 'UX audits, UI design, or prototyping challenges' },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart3, desc: 'SQL challenges, dashboards, or data storytelling' },
    { id: 'sales', label: 'Sales / Pitch', icon: Megaphone, desc: 'Mock pitches, communication, or strategy tasks' },
];

const timeLimitOptions = ['30 mins', '60 mins', '90 mins', '2 hours', '4 hours', '24 hours', '48 hours', 'No Limit'];

const skillSuggestions = [
    'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Go', 'Rust', 'Java', 'C++',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
    'Figma', 'UI/UX', 'Product Design', 'User Research', 'Prototyping',
    'Machine Learning', 'Data Engineering', 'Statistics', 'Pandas', 'TensorFlow',
    'System Design', 'Microservices', 'Event-Driven Architecture',
    'Agile', 'Scrum', 'Product Management', 'Leadership',
    'Communication', 'Sales Strategy', 'Marketing', 'Growth',
];

const totalSteps = 3;

export function ChallengeCreation() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = React.useState(1);

    // Step 1 — Type
    const [challengeType, setChallengeType] = React.useState('');

    // Step 2 — Details
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [requiredSkills, setRequiredSkills] = React.useState<string[]>([]);
    const [timeLimit, setTimeLimit] = React.useState('60 mins');

    // Step 3 — Finalize
    const [isPublic, setIsPublic] = React.useState(true);

    // Saving
    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState('');

    // AI Generation
    const [aiRole, setAiRole] = React.useState('');
    const [generating, setGenerating] = React.useState(false);
    const [aiError, setAiError] = React.useState('');

    const canProceed = () => {
        if (step === 1) return challengeType !== '';
        if (step === 2) return title.trim() !== '' && description.trim() !== '';
        return true;
    };

    const parseTimeLimit = (tl: string): number | null => {
        if (tl === 'No Limit') return null;
        if (tl.includes('hour')) return parseInt(tl) * 60;
        return parseInt(tl);
    };

    const handlePublish = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSaving(true);
        setSaveError('');

        try {
            // Get employer profile
            const { data: profile } = await supabase
                .from('EmployerProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            if (!profile?.id) {
                throw new Error('Please complete employer onboarding first.');
            }

            const challengeId = crypto.randomUUID();
            const { error } = await supabase
                .from('Challenge')
                .insert({
                    id: challengeId,
                    employerId: profile.id,
                    title,
                    description,
                    type: challengeType,
                    timeLimitMins: parseTimeLimit(timeLimit),
                    prizeAmount: 0,
                    isPublic,
                    status: 'ACTIVE',
                    requiredSkills,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });

            if (error) throw error;
            navigate('/employer/dashboard');
        } catch (err: any) {
            console.error('Publish error:', err);
            setSaveError(err.message || 'Failed to publish challenge.');
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!aiRole.trim()) return;
        setGenerating(true);
        setAiError('');

        try {
            const { data, error } = await supabase.functions.invoke('generate-challenge', {
                body: { role: aiRole, challengeType }
            });

            if (error) {
                console.error('Edge function error:', error);
                throw error;
            }

            if (data?.title) setTitle(data.title);
            if (data?.description) setDescription(data.description);
            if (data?.requiredSkills && Array.isArray(data.requiredSkills)) {
                setRequiredSkills(data.requiredSkills);
            }
            if (data?.timeLimit && timeLimitOptions.includes(data.timeLimit)) {
                setTimeLimit(data.timeLimit);
            }
            setAiRole(''); // Clear input after successful generation
        } catch (err: any) {
            console.error('AI generation error:', err);
            setAiError(err.message || 'Failed to generate challenge. Please check your API key.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-[#1C1C1E] flex flex-col">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <Link to="/employer/dashboard" className="text-2xl font-bold">proof<span className="text-proof-accent">.</span></Link>
                <button onClick={() => navigate('/employer/dashboard')} className="text-sm text-[#1C1C1E]/40 font-medium hover:text-[#1C1C1E] transition-colors">
                    Cancel →
                </button>
            </div>

            {/* Progress bar */}
            <div className="px-8 mb-8">
                <div className="flex items-center gap-2 max-w-2xl mx-auto">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-[#1C1C1E]' : 'bg-black/5'}`} />
                    ))}
                </div>
                <p className="text-center text-xs text-[#1C1C1E]/30 font-bold mt-3 tracking-widest uppercase">Step {step} of {totalSteps}</p>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-start justify-center px-8 pb-12">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: Challenge Type */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Zap className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">What kind of challenge?</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Select a category to get started.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {challengeTypes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setChallengeType(t.id)}
                                            className={`text-left p-6 rounded-2xl border-2 transition-all ${challengeType === t.id
                                                ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                                                : 'bg-white/60 backdrop-blur-2xl border-white hover:border-black/10 shadow-glass'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${challengeType === t.id ? 'bg-white/10' : 'bg-[#F8F9FB]'
                                                }`}>
                                                <t.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-base mb-1">{t.label}</h3>
                                            <p className={`text-sm font-medium ${challengeType === t.id ? 'text-white/60' : 'text-[#1C1C1E]/40'}`}>{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Details */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <FileText className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Challenge details</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Describe what candidates will need to do.</p>
                                </div>

                                {/* AI Generator Bar */}
                                <div className="bg-[#1C1C1E] rounded-3xl p-6 mb-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-proof-accent/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/3" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="w-5 h-5 text-proof-accent fill-proof-accent" />
                                            <h3 className="font-bold text-sm tracking-widest uppercase">AI Auto-Generate</h3>
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="What job role are you hiring for? (e.g. Senior Frontend)"
                                                value={aiRole}
                                                onChange={e => setAiRole(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleGenerateAI()}
                                                className="flex-1 bg-white/10 border border-white/20 focus:border-proof-accent transition-all rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/30"
                                            />
                                            <button
                                                onClick={handleGenerateAI}
                                                disabled={generating || !aiRole.trim()}
                                                className="bg-proof-accent text-[#1C1C1E] px-6 rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate'}
                                            </button>
                                        </div>
                                        {aiError && <p className="text-red-400 text-xs mt-3 font-medium">{aiError}</p>}
                                    </div>
                                </div>

                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-5">
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Challenge Title</label>
                                        <SuggestionInput
                                            value={title}
                                            onChange={setTitle}
                                            suggestions={[]}
                                            placeholder="e.g. Senior Backend Systems Audit"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Instructions</label>
                                        <textarea
                                            placeholder="Describe the task, expectations, and deliverables..."
                                            className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl p-4 min-h-[160px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1C1C1E]/10 transition-all resize-none"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-2">Required Skills</label>
                                        <SuggestionInput
                                            value=""
                                            onChange={(skill) => {
                                                if (skill.trim() && !requiredSkills.includes(skill)) {
                                                    setRequiredSkills(prev => [...prev, skill]);
                                                }
                                            }}
                                            suggestions={skillSuggestions.filter(s => !requiredSkills.includes(s))}
                                            placeholder="Type to add skills..."
                                            clearOnSelect
                                            maxSuggestions={6}
                                        />
                                        {requiredSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {requiredSkills.map(skill => (
                                                    <span key={skill} className="inline-flex items-center gap-1.5 bg-[#1C1C1E] text-white pl-3 pr-2 py-1.5 rounded-lg text-sm font-medium">
                                                        {skill}
                                                        <button onClick={() => setRequiredSkills(prev => prev.filter(s => s !== skill))} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                                                            <span className="text-[10px] leading-none">✕</span>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-3">Time Limit</label>
                                        <div className="flex flex-wrap gap-2">
                                            {timeLimitOptions.map(tl => (
                                                <button
                                                    key={tl}
                                                    onClick={() => setTimeLimit(tl)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${timeLimit === tl
                                                        ? 'bg-[#1C1C1E] text-white'
                                                        : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60 hover:border-black/10'
                                                        }`}
                                                >
                                                    {timeLimit === tl && <CheckCircle className="w-3.5 h-3.5" />}
                                                    {tl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Finalize & Publish */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-5">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">Finalize & publish</h1>
                                    <p className="text-[#1C1C1E]/50 font-medium">Set the reward and visibility for your challenge.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-5">
                                        <div>
                                            <label className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 block mb-3">Visibility</label>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setIsPublic(true)}
                                                    className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${isPublic ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60'
                                                        }`}
                                                >
                                                    <Shield className="w-4 h-4" /> Public Bounty
                                                </button>
                                                <button
                                                    onClick={() => setIsPublic(false)}
                                                    className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${!isPublic ? 'bg-[#1C1C1E] text-white' : 'bg-[#F8F9FB] border border-black/5 text-[#1C1C1E]/60'
                                                        }`}
                                                >
                                                    <Users className="w-4 h-4" /> Invite Only
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recap */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-glass space-y-3">
                                        <p className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-4">Challenge Summary</p>
                                        <div className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Zap className="w-4 h-4 text-[#1C1C1E]/30" />
                                            <p className="text-sm font-semibold">{title || 'Untitled'}</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                            <Clock className="w-4 h-4 text-[#1C1C1E]/30" />
                                            <p className="text-sm font-medium text-[#1C1C1E]/60">{timeLimit} • {challengeType}</p>
                                        </div>
                                        {requiredSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 p-3 bg-[#F8F9FB] rounded-xl border border-black/5">
                                                {requiredSkills.map(s => (
                                                    <span key={s} className="text-xs bg-[#1C1C1E] text-white px-2.5 py-1 rounded-lg font-medium">{s}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {saveError && (
                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium">
                                        {saveError}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10 max-w-2xl mx-auto">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div />}

                        {step < totalSteps ? (
                            <button
                                onClick={() => canProceed() && setStep(step + 1)}
                                disabled={!canProceed()}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all ${canProceed()
                                    ? 'bg-[#1C1C1E] text-white hover:bg-[#1C1C1E]/80'
                                    : 'bg-black/5 text-[#1C1C1E]/20 cursor-not-allowed'
                                    }`}
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handlePublish}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
                                ) : (
                                    <>Publish Challenge <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
