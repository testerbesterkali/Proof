import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, ChevronRight, Loader2, CheckCircle2, Clock, XCircle, FileText, LogOut, ArrowUpRight, Filter, Zap, ShieldCheck, Eye, CheckCircle, AlertCircle } from 'lucide-react';

import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';

interface SubmissionData {
    id: string;
    candidateName: string;
    candidateHeadline: string;
    challengeTitle: string;
    status: string;
    createdAt: string;
    score: number | null;
    candidateId: string;
    challengeId: string;
}

type Stage = 'pipeline' | 'shortlisted' | 'interview' | 'decision';

function mapStatusToStage(status: string): Stage {
    switch (status) {
        case 'SUBMITTED': return 'pipeline';
        case 'UNDER_REVIEW': return 'pipeline';
        case 'REVIEWED': return 'pipeline';
        case 'SHORTLISTED': return 'shortlisted';
        case 'INTERVIEW': return 'interview';
        case 'ACCEPTED': return 'decision';
        case 'REJECTED': return 'decision';
        default: return 'pipeline';
    }
}

const columns: { key: Stage; label: string; icon: React.ElementType; color: string }[] = [
    { key: 'pipeline', label: 'Pipeline', icon: Eye, color: 'text-blue-500 bg-blue-50' },
    { key: 'shortlisted', label: 'Shortlisted', icon: CheckCircle, color: 'text-purple-500 bg-purple-50' },
    { key: 'interview', label: 'Interview', icon: MessageSquare, color: 'text-cyan-500 bg-cyan-50' },
    { key: 'decision', label: 'Decision', icon: AlertCircle, color: 'text-green-500 bg-green-50' },
];

export function EmployerSubmissions() {
    const { user, signOut } = useAuth();
    const [searchParams] = useSearchParams();
    const challengeIdFilter = searchParams.get('challengeId');
    const [loading, setLoading] = React.useState(true);
    const [submissions, setSubmissions] = React.useState<SubmissionData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [view, setView] = React.useState<'grid' | 'kanban'>('kanban');

    React.useEffect(() => {
        if (user) loadSubmissions();
    }, [user, challengeIdFilter]);

    const loadSubmissions = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Get employer profile
            const { data: profile } = await supabase
                .from('EmployerProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            if (profile?.id) {
                // 2. Get challenges owned by this employer
                let challengeQuery = supabase
                    .from('Challenge')
                    .select('id, title')
                    .eq('employerId', profile.id);

                if (challengeIdFilter) {
                    challengeQuery = challengeQuery.eq('id', challengeIdFilter);
                }

                const { data: challenges, error: chalError } = await challengeQuery;

                if (chalError) throw chalError;

                if (challenges && challenges.length > 0) {
                    const challengeIds = challenges.map(c => c.id);
                    const challengeMap = new Map(challenges.map(c => [c.id, c.title]));

                    // 3. Get submissions for those challenges
                    const { data: submissionData, error: subError } = await supabase
                        .from('Submission')
                        .select('*')
                        .in('challengeId', challengeIds)
                        .order('createdAt', { ascending: false });

                    if (subError) throw subError;

                    if (submissionData && submissionData.length > 0) {
                        // 4. Fetch candidate profile details for these submissions
                        const candidateIds = Array.from(new Set(submissionData.map((s: any) => s.candidateId).filter(Boolean)));

                        const { data: candidateProfiles } = await supabase
                            .from('CandidateProfile')
                            .select('id, headline')
                            .in('id', candidateIds);

                        const profileMap = new Map(candidateProfiles?.map(cp => [cp.id, cp]) || []);

                        const formatted = submissionData.map((s: any) => ({
                            id: s.id,
                            candidateName: `Candidate #${(s.candidateId || '').substring(0, 6) || 'Unknown'}`,
                            candidateHeadline: profileMap.get(s.candidateId)?.headline || 'Software Engineer',
                            challengeTitle: challengeMap.get(s.challengeId) || 'Unknown Challenge',
                            status: s.status,
                            score: typeof s.score === 'object' && s.score !== null ? s.score.overall : s.score,
                            createdAt: s.createdAt,
                            candidateId: s.candidateId,
                            challengeId: s.challengeId,
                        }));
                        setSubmissions(formatted);
                    } else {
                        setSubmissions([]);
                    }
                } else {
                    setSubmissions([]);
                }
            } else {
                console.warn('No employer profile found for user:', user.id);
                setSubmissions([]);
            }
        } catch (err) {
            console.error('Failed to load submissions:', err);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status, score }: { status: string, score: number | null }) => {
        const isCompleted = ['REVIEWED', 'ACCEPTED', 'REJECTED', 'SHORTLISTED', 'INTERVIEW'].includes(status);

        if (isCompleted) {
            return (
                <div className="flex flex-col gap-1">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest w-max ${status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-700' :
                            status === 'INTERVIEW' ? 'bg-cyan-100 text-cyan-700' :
                                status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-proof-accent/10 text-proof-accent'
                        }`}>
                        {status === 'INTERVIEW' ? 'IN INTERVIEW' : status}
                    </span>
                </div>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 flex items-center gap-1.5 w-max">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                NEEDS REVIEW
            </span>
        );
    };

    const filtered = submissions.filter(s =>
        s.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <EmployerLayout>
            <div className="flex-1 flex flex-col">
                <header className="flex flex-col mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-6xl font-light tracking-tighter leading-none uppercase">Talent</h1>
                        <div className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2 shadow-sm">
                            <Users size={10} className="text-proof-accent fill-proof-accent" />
                            Pipeline
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-6xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/60 uppercase">
                            Submissions
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-white/40 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/60">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${view === 'grid' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E]'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setView('kanban')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${view === 'kanban' ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E]'}`}
                                >
                                    Board
                                </button>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/20 group-focus-within:text-proof-accent transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by candidate or challenge..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="bg-white/40 backdrop-blur-xl border border-white/60 focus:border-proof-accent/40 rounded-full py-3.5 pl-12 pr-6 text-xs font-bold w-80 shadow-soft transition-all focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
                    </div>
                ) : submissions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-20 shadow-soft border border-white text-center"
                    >
                        <div className="w-24 h-24 bg-[#E4E5E7]/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FileText className="w-10 h-10 text-[#1C1C1E]/10" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">No Submissions Yet</h2>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest mb-10 max-w-sm mx-auto leading-relaxed">
                            Complete challenges to see candidate proof of work here. Top talent is just one challenge away.
                        </p>
                        <Link
                            to="/employer/create-challenge"
                            className="bg-[#1C1C1E] text-white px-10 py-4 rounded-full font-black text-xs tracking-[0.1em] uppercase shadow-2xl hover:translate-y-[-2px] transition-all"
                        >
                            Launch a Challenge
                        </Link>
                    </motion.div>
                ) : view === 'kanban' ? (
                    <div className="flex-1 overflow-x-auto pb-8">
                        <div className="flex gap-6 min-w-max h-full">
                            {columns.map((col) => {
                                const colApps = filtered.filter(s => mapStatusToStage(s.status) === col.key);
                                return (
                                    <div key={col.key} className="flex flex-col w-[320px] shrink-0">
                                        <div className="flex items-center gap-3 mb-6 px-1">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${col.color}`}>
                                                <col.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-widest text-[#1C1C1E]">{col.label}</span>
                                            <span className="ml-auto text-xs font-black text-[#1C1C1E]/40 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white">{colApps.length}</span>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <AnimatePresence>
                                                {colApps.map((sub, i) => (
                                                    <motion.div
                                                        key={sub.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        onClick={() => (window.location.href = `/employer/review/${sub.id}`)}
                                                        className="group bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass-soft border border-white/60 flex flex-col hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-6 right-6 text-[#1C1C1E]/20 group-hover:text-proof-accent transition-colors">
                                                            <ArrowUpRight size={18} strokeWidth={2.5} />
                                                        </div>
                                                        <div className="flex items-start gap-4 mb-6">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-[#1C1C1E]/5 text-lg font-black text-[#1C1C1E] group-hover:bg-[#1C1C1E] group-hover:text-white transition-all">
                                                                {sub.candidateName.charAt(10) || sub.candidateName.charAt(0)}
                                                            </div>
                                                            <div className="overflow-hidden pr-6">
                                                                <h3 className="text-lg font-black tracking-tight truncate border-b-2 border-transparent">{sub.candidateName}</h3>
                                                                <p className="text-[10px] text-proof-accent font-bold uppercase tracking-widest truncate">{sub.challengeTitle}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-end justify-between mt-auto px-1">
                                                            <div className="flex flex-col gap-1.5">
                                                                <StatusBadge status={sub.status} score={null} />
                                                                <div className="text-[9px] text-[#1C1C1E]/30 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                    <Clock size={10} /> {new Date(sub.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                            {sub.score !== null && (
                                                                <div className="text-right">
                                                                    <div className="text-3xl font-black tracking-tighter text-[#1C1C1E] leading-none mb-1">
                                                                        {sub.score}%
                                                                    </div>
                                                                    <div className="text-[9px] font-black text-proof-accent uppercase tracking-widest leading-none">Match</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            {colApps.length === 0 && (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/20 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-white/40">
                                                    <p className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">No candidates</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16 pb-20">
                        {Array.from(new Set(filtered.map(s => s.challengeId))).map(chid => {
                            const challengeSubmissions = filtered.filter(s => s.challengeId === chid);
                            const challengeTitle = challengeSubmissions[0]?.challengeTitle || 'Unknown Challenge';

                            return (
                                <section key={chid} className="flex flex-col">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="px-6 py-3 bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-glass-soft">
                                            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                                {challengeTitle}
                                                <span className="text-proof-accent bg-proof-accent/10 px-2 py-0.5 rounded-lg text-[10px] tracking-normal">
                                                    {challengeSubmissions.length} Candidate{challengeSubmissions.length !== 1 ? 's' : ''}
                                                </span>
                                            </h2>
                                        </div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-[#1C1C1E]/10 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        <AnimatePresence>
                                            {challengeSubmissions.map((sub, i) => (
                                                <motion.div
                                                    key={sub.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.05 * i, type: "spring" }}
                                                    onClick={() => (window.location.href = `/employer/review/${sub.id}`)}
                                                    className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass-soft border border-white/60 flex flex-col justify-between hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden h-full"
                                                >
                                                    <div className="absolute top-[-10px] left-[-10px] w-20 h-20 bg-proof-accent opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />

                                                    <div className="absolute top-8 right-8 text-[#1C1C1E]/20 group-hover:text-proof-accent transition-colors">
                                                        <ArrowUpRight size={22} strokeWidth={2.5} />
                                                    </div>

                                                    <div className="mb-10">
                                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center overflow-hidden border border-[#1C1C1E]/5 text-xl font-black text-[#1C1C1E] group-hover:bg-[#1C1C1E] group-hover:text-white transition-all">
                                                            {sub.candidateName.charAt(10) || sub.candidateName.charAt(0)}
                                                        </div>
                                                        <h3 className="text-2xl font-black tracking-tight mb-1 truncate">{sub.candidateName}</h3>
                                                        <p className="text-[11px] text-proof-accent font-bold uppercase tracking-widest truncate">{sub.candidateHeadline}</p>
                                                        <p className="text-[9px] text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">
                                                            Submitted {new Date(sub.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-end justify-between mt-auto pt-6 border-t border-black/5">
                                                        <StatusBadge status={sub.status} score={null} />
                                                        {sub.score !== null && (
                                                            <div className="text-right">
                                                                <div className="text-4xl font-black tracking-tighter text-[#1C1C1E] leading-none mb-1">
                                                                    {sub.score}%
                                                                </div>
                                                                <div className="text-[10px] font-black text-proof-accent uppercase tracking-widest leading-none">Match</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="py-20 text-center bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white">
                                <p className="text-[#1C1C1E]/40 font-black uppercase tracking-widest text-sm text-center">No submissions match your search</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}

