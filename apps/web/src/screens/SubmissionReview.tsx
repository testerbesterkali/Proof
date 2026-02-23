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
    const [rightPanelTab, setRightPanelTab] = useState<'evaluation' | 'discussion'>('evaluation');
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const [lastAction, setLastAction] = useState('');

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

            if (subError) {
                console.error('Submission fetch error:', subError);
                throw subError;
            }
            if (!sub) {
                console.error('No submission found for ID:', submissionId);
                return;
            }
            setSubmission(sub);
            console.log('Submission loaded:', sub.id);

            // 2. Fetch candidate info
            // First try by profile ID
            let { data: prof } = await supabase
                .from('CandidateProfile')
                .select('*')
                .eq('id', sub.candidateId)
                .single();

            // If not found, try by userId (candidateId might be aliased to userId in some contexts)
            if (!prof) {
                console.log('Profile not found by ID, trying by userId...');
                const { data: profByUserId } = await supabase
                    .from('CandidateProfile')
                    .select('*')
                    .eq('userId', sub.candidateId)
                    .single();
                prof = profByUserId;
            }

            if (prof) {
                console.log('Candidate profile loaded:', prof.id);
                setCandidate({
                    id: prof.id,
                    headline: prof.headline || 'Software Engineer',
                    location: prof.location || 'Remote',
                    experience: prof.experience || 'Not specified',
                    skills: prof.skills || [],
                    name: `Candidate #${prof.id.substring(0, 6)}` // Fallback name
                });
            } else {
                console.warn('No candidate profile found for submission:', sub.id);
                // Set an anonymous candidate state so UI doesn't break
                setCandidate({
                    id: sub.candidateId,
                    headline: 'Talent Pool Candidate',
                    location: 'Remote',
                    experience: 'Confidential',
                    skills: [],
                    name: `Candidate #${sub.candidateId.substring(0, 6)}`
                });
            }

            // 3. Fetch challenge info
            const { data: chal } = await supabase
                .from('Challenge')
                .select('*')
                .eq('id', sub.challengeId)
                .single();

            if (chal) {
                setChallenge(chal);
                console.log('Challenge loaded:', chal.title);
            }

            // 4. Fetch comments
            const { data: comms, error: commsError } = await supabase
                .from('SubmissionComment')
                .select(`
                    *,
                    author:User(id, user_metadata)
                `)
                .eq('submissionId', submissionId)
                .order('createdAt', { ascending: true });

            if (commsError) console.warn('Comments fetch error (non-blocking):', commsError);
            if (comms) setComments(comms);

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
            const { data, error } = await supabase
                .from('Submission')
                .update({
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', submissionId)
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error("Update failed. Row might be protected by RLS or doesn't exist.");

            setSubmission(prev => prev ? { ...prev, status: newStatus } : null);
            setLastAction(newStatus);
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            // Optionally, show an error toast here if you want to alert the user it failed
            alert(`Failed to save: ${err.message || 'Unknown error'}`);
        } finally {
            setUpdating(false);
        }
    };

    const handlePostComment = async () => {
        if (!user || !submissionId || !newComment.trim()) return;
        setIsPostingComment(true);
        try {
            const { data, error } = await supabase
                .from('SubmissionComment')
                .insert({
                    submissionId,
                    authorId: user.id,
                    content: newComment.trim()
                })
                .select(`
                    *,
                    author:User(id, user_metadata)
                `)
                .single();

            if (error) throw error;
            if (data) {
                setComments(prev => [...prev, data]);
                setNewComment('');
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setIsPostingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F8F9FB]">
                <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F8F9FB]">
                <h1 className="text-2xl font-bold mb-4">Submission Not Found</h1>
                <p className="text-black/40 mb-8 max-w-xs text-center">We couldn't retrieve this submission. It may have been removed or the link is invalid.</p>
                <button onClick={() => navigate('/employer/submissions')} className="bg-[#1C1C1E] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
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
                            {candidate?.name?.charAt(10) || 'C'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black tracking-tight">{candidate?.name || 'Anonymous Candidate'}</h1>
                                {aiScore >= 80 && (
                                    <div className="px-3 py-1 rounded-full bg-proof-accent/10 text-proof-accent text-[10px] font-black uppercase tracking-widest border border-proof-accent/20 flex items-center gap-1.5 shadow-sm">
                                        <ShieldCheck size={11} className="fill-proof-accent/20" />
                                        High Fit
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                <span className="text-black/20 group-hover:text-proof-accent transition-colors">●</span> {candidate?.headline || 'Talent Profile'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative">
                    <button
                        disabled={updating || submission.status === 'REJECTED'}
                        onClick={() => handleStatusUpdate('REJECTED')}
                        className={`px-6 py-3 rounded-2xl border border-red-200 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-30 ${submission.status === 'REJECTED' ? 'bg-red-50' : ''}`}
                    >
                        {submission.status === 'REJECTED' ? <X size={14} strokeWidth={3} /> : <X size={14} strokeWidth={2.5} />}
                        {submission.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                    </button>

                    <button
                        disabled={updating || submission.status === 'SHORTLISTED'}
                        onClick={() => handleStatusUpdate('SHORTLISTED')}
                        className={`px-6 py-3 rounded-2xl border border-amber-200 text-amber-600 text-[11px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-30 ${submission.status === 'SHORTLISTED' ? 'bg-amber-50 border-amber-400' : ''}`}
                    >
                        <Star size={14} className={submission.status === 'SHORTLISTED' ? 'fill-amber-600' : ''} />
                        {submission.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist'}
                    </button>

                    <button
                        disabled={updating || submission.status === 'INTERVIEW'}
                        onClick={() => handleStatusUpdate('INTERVIEW')}
                        className={`px-6 py-3 rounded-2xl bg-[#1C1C1E] text-white text-[11px] font-black uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#1C1C1E]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0 ${submission.status === 'INTERVIEW' ? 'bg-proof-accent' : ''}`}
                    >
                        {updating ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} strokeWidth={3} />}
                        {submission.status === 'INTERVIEW' ? 'In Interview' : 'Advance to Interview'}
                    </button>

                    {/* Toast Notification (Scoped to buttons area) */}
                    <AnimatePresence>
                        {showSavedToast && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 px-6 py-3 bg-[#1C1C1E] text-white rounded-2xl shadow-xl z-50 flex items-center gap-3 border border-white/10"
                            >
                                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    Status Saved: {lastAction}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex items-center gap-4 ml-4 pl-6 border-l border-black/5">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-1">Match Score</p>
                        <p className={`text-5xl font-black tracking-tighter leading-none ${aiScore >= 80 ? 'text-green-500' : aiScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                            {aiScore}%
                        </p>
                    </div>
                </div>
            </header >

            {/* Main Content */}
            < main className="flex-1 flex overflow-hidden" >
                {/* Left side nav tabs */}
                < aside className="w-20 bg-white border-r border-black/5 flex flex-col items-center py-8 gap-4 shadow-sm z-10" >
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
                </aside >

                {/* Left: Code Viewer */}
                < div className="flex-1 flex flex-col bg-white" >
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
                </div >

                {/* Right: Insights & Rubric */}
                < div className="w-[450px] flex flex-col bg-[#F8F9FB] border-l border-black/5" >
                    {/* Tabs for Right Panel */}
                    < div className="flex border-b border-black/5 bg-white/50 backdrop-blur-sm" >
                        <button
                            onClick={() => setRightPanelTab('evaluation')}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${rightPanelTab === 'evaluation' ? 'text-proof-accent' : 'text-black/30 hover:text-black/60'}`}
                        >
                            Evaluation
                            {rightPanelTab === 'evaluation' && (
                                <motion.div layoutId="rightTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-proof-accent" />
                            )}
                        </button>
                        <button
                            onClick={() => setRightPanelTab('discussion')}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${rightPanelTab === 'discussion' ? 'text-proof-accent' : 'text-black/30 hover:text-black/60'}`}
                        >
                            Team Discussion
                            {rightPanelTab === 'discussion' && (
                                <motion.div layoutId="rightTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-proof-accent" />
                            )}
                        </button>
                    </div >

                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {rightPanelTab === 'evaluation' ? (
                                <motion.div
                                    key="evaluation"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-10 space-y-10"
                                >
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
                                                        <p className="text-sm font-bold">{candidate?.location || 'Remote'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center text-[#1C1C1E]/40">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Experience</p>
                                                        <p className="text-sm font-bold">{candidate?.experience || 'Confidential'}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-4 flex flex-wrap gap-2 border-t border-black/5">
                                                    {(candidate?.skills || []).slice(0, 6).map(skill => (
                                                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-black/5 text-[10px] font-bold text-black/40 uppercase tracking-tight">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="discussion"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-10 flex flex-col h-full"
                                >
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-black/30 border-b border-black/5 pb-4 mb-8">Internal Discussion</h3>

                                    <div className="flex-1 space-y-6 overflow-y-auto mb-8 pr-2">
                                        {comments.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-black/[0.02] flex items-center justify-center mb-6 text-black/10 shadow-inner">
                                                    <MessageSquare size={32} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-black/20">No team notes yet</p>
                                                <p className="text-xs text-black/30 mt-2">Start the conversation by adding a note below.</p>
                                            </div>
                                        ) : (
                                            comments.map((comment, i) => (
                                                <div key={comment.id} className="flex gap-4 group">
                                                    <div className="w-8 h-8 rounded-xl bg-white shadow-soft border border-black/5 flex items-center justify-center font-black text-[10px] shrink-0">
                                                        {comment.author?.user_metadata?.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] font-black uppercase tracking-tight text-black/40">
                                                                {comment.author?.user_metadata?.full_name || 'Team Member'}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-black/20 uppercase">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white/60 border border-white rounded-2xl rounded-tl-none p-4 shadow-glass-soft text-xs leading-relaxed text-black/70">
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="mt-auto relative">
                                        <textarea
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="Add an internal note..."
                                            className="w-full bg-white border border-white focus:border-proof-accent/40 rounded-3xl p-6 text-xs font-bold leading-relaxed shadow-glass focus:outline-none transition-all placeholder:text-black/20 pr-16 resize-none min-h-[120px]"
                                        />
                                        <button
                                            onClick={handlePostComment}
                                            disabled={isPostingComment || !newComment.trim()}
                                            className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl bg-[#1C1C1E] text-white flex items-center justify-center hover:bg-proof-accent transition-all shadow-xl disabled:opacity-20 disabled:hover:bg-[#1C1C1E] group"
                                        >
                                            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div >
            </main >
        </div >
    );
};

