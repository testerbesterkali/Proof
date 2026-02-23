import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Star,
    MessageSquare,
    Check,
    X,
    ChevronLeft,
    Award,
    TrendingUp,
    ShieldCheck,
    Send,
    Loader2,
    Code,
    Terminal,
    MapPin,
    Briefcase,
    ArrowUpRight,
    Trophy
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SubmissionData {
    id: string;
    challengeId: string;
    candidateId: string;
    content: {
        code: string;
        language: string;
    };
    status: string;
    score: any;
    createdAt: string;
}

interface CandidateData {
    id: string;
    headline: string;
    location: string;
    experience: string;
    skills: string[];
    name: string;
}

interface ChallengeData {
    id: string;
    title: string;
    description: string;
}

export const SubmissionReview = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<SubmissionData | null>(null);
    const [candidate, setCandidate] = useState<CandidateData | null>(null);
    const [challenge, setChallenge] = useState<ChallengeData | null>(null);
    const [updating, setUpdating] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState<'code' | 'specs'>('code');

    useEffect(() => {
        if (submissionId) loadData();
    }, [submissionId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Fetch submission
            const { data: sub, error: subError } = await supabase
                .from('Submission')
                .select('*')
                .eq('id', submissionId)
                .single();

            if (subError) throw subError;
            setSubmission(sub);

            // 2. Fetch candidate info
            const { data: prof, error: profError } = await supabase
                .from('CandidateProfile')
                .select('*')
                .eq('id', sub.candidateId)
                .single();

            if (prof) {
                setCandidate({
                    id: prof.id,
                    headline: prof.headline || 'Software Engineer',
                    location: prof.location || 'Remote',
                    experience: prof.experience || 'Not specified',
                    skills: prof.skills || [],
                    name: `Candidate #${prof.id.substring(0, 6)}` // Fallback name
                });
            }

            // 3. Fetch challenge info
            const { data: chal, error: chalError } = await supabase
                .from('Challenge')
                .select('*')
                .eq('id', sub.challengeId)
                .single();

            if (chal) setChallenge(chal);

        } catch (err) {
            console.error('Failed to load submission review data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!submissionId) return;
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('Submission')
                .update({
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', submissionId);

            if (error) throw error;

            // Update local state or navigate back
            setSubmission(prev => prev ? { ...prev, status: newStatus } : null);

            // If advanced, maybe we want to stay, but usually after decision we go back
            // For now let's just update local state so they see the change
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F8F9FB]">
                <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
            </div>
        );
    }

    if (!submission || !candidate) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F8F9FB]">
                <h1 className="text-2xl font-bold mb-4">Submission Not Found</h1>
                <button onClick={() => navigate('/employer/submissions')} className="bg-[#1C1C1E] text-white px-6 py-2 rounded-xl text-sm font-bold">
                    Back to Submissions
                </button>
            </div>
        );
    }

    const { code, language } = submission.content || { code: '', language: 'javascript' };
    const aiScore = submission.score?.overall || 0;

    return (
        <div className="flex flex-col h-screen bg-[#F8F9FB] text-[#1C1C1E] overflow-hidden">
            {/* Header */}
            <header className="h-20 border-b border-black/5 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-3 hover:bg-black/5 rounded-2xl transition-all border border-transparent hover:border-black/5 group">
                        <ChevronLeft size={20} className="text-[#1C1C1E]/40 group-hover:text-[#1C1C1E]" />
                    </button>
                    <div className="h-10 w-px bg-black/5" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] flex items-center justify-center text-white font-black text-xl shadow-lg border-b-4 border-black/20">
                            {candidate.name.charAt(10)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black tracking-tight">{candidate.name}</h1>
                                {aiScore >= 80 && (
                                    <div className="px-3 py-1 rounded-full bg-proof-accent/10 text-proof-accent text-[10px] font-black uppercase tracking-widest border border-proof-accent/20 flex items-center gap-1.5 shadow-sm">
                                        <ShieldCheck size={11} className="fill-proof-accent/20" />
                                        High Fit
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                <span className="text-black/20 group-hover:text-proof-accent transition-colors">●</span> {candidate.headline}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        disabled={updating || submission.status === 'REJECTED'}
                        onClick={() => handleStatusUpdate('REJECTED')}
                        className={`px-6 py-3 rounded-2xl border border-red-200 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-30 ${submission.status === 'REJECTED' ? 'bg-red-50' : ''}`}
                    >
                        {submission.status === 'REJECTED' ? <X size={14} strokeWidth={3} /> : <X size={14} strokeWidth={2.5} />}
                        {submission.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                    </button>
                    <button
                        disabled={updating || submission.status === 'ACCEPTED' || submission.status === 'INTERVIEW'}
                        onClick={() => handleStatusUpdate('INTERVIEW')}
                        className={`px-6 py-3 rounded-2xl bg-[#1C1C1E] text-white text-[11px] font-black uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#1C1C1E]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0`}
                    >
                        {updating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                        {submission.status === 'ACCEPTED' || submission.status === 'INTERVIEW' ? 'Shortlisted' : 'Advance to Interview'}
                    </button>
                    <div className="h-10 w-px bg-black/5 mx-2" />
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-0.5">AI Match</p>
                            <p className={`text-2xl font-black ${aiScore >= 80 ? 'text-green-500' : aiScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                {aiScore}%
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-black/5 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-proof-accent border-t-transparent animate-spin opacity-20" />
                            <Trophy className={`absolute w-5 h-5 ${aiScore >= 80 ? 'text-amber-400 fill-amber-400' : 'text-black/10'}`} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left side nav tabs */}
                <aside className="w-20 bg-white border-r border-black/5 flex flex-col items-center py-8 gap-4 shadow-sm z-10">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`p-4 rounded-2xl transition-all ${activeTab === 'code' ? 'bg-[#1C1C1E] text-white shadow-lg' : 'text-[#1C1C1E]/30 hover:bg-black/5 hover:text-[#1C1C1E]'}`}
                    >
                        <Code size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`p-4 rounded-2xl transition-all ${activeTab === 'specs' ? 'bg-[#1C1C1E] text-white shadow-lg' : 'text-[#1C1C1E]/30 hover:bg-black/5 hover:text-[#1C1C1E]'}`}
                    >
                        <Terminal size={24} />
                    </button>
                </aside>

                {/* Left: Code Viewer */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="h-12 px-6 flex items-center justify-between border-b border-black/5 bg-[#F8F9FB]/50">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Proof of Work</span>
                            <div className="h-3 w-px bg-black/10" />
                            <span className="text-[10px] font-bold text-proof-accent uppercase tracking-widest">
                                {challenge?.title || 'Coding Challenge'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E]/5 text-[9px] font-black text-[#1C1C1E]/60 uppercase tracking-widest">
                            {language}
                        </div>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            options={{
                                readOnly: true,
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 20 },
                                theme: 'vs-light',
                                lineNumbers: 'on',
                                folding: true,
                                scrollbar: {
                                    vertical: 'hidden',
                                    horizontal: 'hidden'
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Right: Insights & Rubric */}
                <div className="w-[450px] flex flex-col bg-[#F8F9FB] border-l border-black/5 overflow-y-auto">
                    <div className="p-10 space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-black/5 pb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-black/30">AI Evaluation</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[9px] font-black tracking-widest text-[#1C1C1E]/40 uppercase">Verified Solution</span>
                                </div>
                            </div>

                            <div className="bg-[#1C1C1E] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-proof-accent/20 blur-[60px] group-hover:bg-proof-accent/30 transition-all" />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Award className="text-proof-accent" size={18} />
                                    </div>
                                    <h4 className="text-base font-black tracking-tight">Executive Summary</h4>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed italic mb-8">
                                    "{submission.score?.summary || 'No AI summary available for this submission yet.'}"
                                </p>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 rounded-lg bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                                        Idiomatic
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                                        Performant
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-black/30 border-b border-black/5 pb-4">Skill Assessment</h3>

                            <div className="grid grid-cols-1 gap-4">
                                {submission.score && Object.entries(submission.score).map(([key, value]: [string, any]) => {
                                    if (typeof value !== 'number' || key === 'overall') return null;
                                    return (
                                        <div key={key} className="bg-white/60 border border-white rounded-[1.5rem] p-6 shadow-soft flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${value >= 80 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {key === 'codeQuality' ? '💎' : key === 'efficiency' ? '⚡' : key === 'bestPractices' ? '🛡️' : '✓'}
                                                    </div>
                                                    <span className="text-xs font-black capitalize tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                </div>
                                                <span className={`text-sm font-black ${value >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#F8F9FB] rounded-full overflow-hidden border border-black/[0.02]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${value}%` }}
                                                    transition={{ duration: 1, type: "spring" }}
                                                    className={`h-full rounded-full ${value >= 80 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="space-y-6 pb-12">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-black/30 border-b border-black/5 pb-4">Candidate Context</h3>
                            <div className="bg-white/60 border border-white rounded-[2rem] p-8 shadow-soft">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center text-[#1C1C1E]/40">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold">{candidate.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center text-[#1C1C1E]/40">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Experience</p>
                                            <p className="text-sm font-bold">{candidate.experience}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex flex-wrap gap-2 border-t border-black/5">
                                        {candidate.skills.slice(0, 6).map(skill => (
                                            <span key={skill} className="px-3 py-1.5 rounded-lg bg-black/5 text-[10px] font-bold text-black/40 uppercase tracking-tight">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

