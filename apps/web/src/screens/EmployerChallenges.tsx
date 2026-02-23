import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, Search, Copy, CheckCircle2, ChevronRight, Loader2, Link as LinkIcon, AlertCircle, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';

interface ChallengeData {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    requiredSkills: string[];
    timeLimitMins: number | null;
    isPublic: boolean;
    submissionCount: number;
}

export function EmployerChallenges() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [challenges, setChallenges] = React.useState<ChallengeData[]>([]);
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (user) loadChallenges();
    }, [user]);

    const loadChallenges = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const { data: profile } = await supabase
                .from('EmployerProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            if (profile?.id) {
                const { data: challengeData, error } = await supabase
                    .from('Challenge')
                    .select('*, Submission(id)')
                    .eq('employerId', profile.id)
                    .order('createdAt', { ascending: false });

                if (error) throw error;

                const formatted = (challengeData || []).map((c: any) => ({
                    ...c,
                    submissionCount: c.Submission?.length || 0
                }));

                setChallenges(formatted);
            }
        } catch (err) {
            console.error('Failed to load challenges:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/challenge/${id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleStatus = async (challenge: ChallengeData) => {
        const newStatus = challenge.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
        setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, status: newStatus } : c));

        try {
            await supabase
                .from('Challenge')
                .update({ status: newStatus })
                .eq('id', challenge.id);
        } catch (err) {
            console.error('Failed to update status', err);
            // Revert back if it fails
            setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, status: challenge.status } : c));
        }
    };

    return (
        <EmployerLayout>
            <div className="flex-1 flex flex-col">
                <header className="flex flex-col mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-6xl font-light tracking-tighter leading-none uppercase">Manage</h1>
                        <div className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2 shadow-sm">
                            <Briefcase size={10} className="text-proof-accent fill-proof-accent" />
                            Challenges
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-6xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/60 uppercase">
                            Hiring Tests
                        </h1>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/employer/create-challenge"
                                className="bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-black text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-xl hover:translate-y-[-2px] transition-all"
                            >
                                <Plus size={16} strokeWidth={3} /> New Challenge
                            </Link>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
                    </div>
                ) : challenges.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-20 shadow-soft border border-white text-center"
                    >
                        <div className="w-24 h-24 bg-[#E4E5E7]/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Briefcase className="w-10 h-10 text-[#1C1C1E]/10" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">No Challenges Created</h2>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest mb-10 max-w-sm mx-auto leading-relaxed">
                            Start creating challenges to attract and verify top-tier talent.
                        </p>
                        <Link
                            to="/employer/create-challenge"
                            className="bg-[#1C1C1E] text-white px-10 py-4 rounded-full font-black text-xs tracking-[0.1em] uppercase shadow-2xl hover:translate-y-[-2px] transition-all"
                        >
                            Create Your First Challenge
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 pb-20">
                        {challenges.map((challenge, i) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => (window.location.href = `/employer/submissions?challengeId=${challenge.id}`)}
                                className="group bg-white/40 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass-soft border border-white/60 flex items-center justify-between cursor-pointer hover:shadow-glass hover:bg-white/80 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-[-10px] left-[-10px] w-20 h-20 bg-proof-accent opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />

                                <div className="flex items-center gap-8 relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm text-2xl font-black ${challenge.status === 'ACTIVE'
                                        ? 'bg-[#1C1C1E] text-white'
                                        : 'bg-[#E4E5E7]/50 text-[#1C1C1E]/30'
                                        }`}>
                                        {challenge.title.charAt(0)}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black tracking-tight">{challenge.title}</h3>
                                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${challenge.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {challenge.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                                {challenge.status}
                                            </span>
                                            {!challenge.isPublic && (
                                                <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700">
                                                    Invite Only
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 text-[9px] font-black uppercase tracking-widest text-[#1C1C1E]/40">
                                            <span className="flex items-center gap-1.5"><Users size={14} className="text-[#1C1C1E]/20" /> {challenge.submissionCount} Submissions</span>
                                            <span className="flex items-center gap-1.5 text-proof-accent">{challenge.type} Challenge</span>
                                            {challenge.timeLimitMins && (
                                                <span className="flex items-center gap-1.5">⏱ {challenge.timeLimitMins} mins</span>
                                            )}
                                            <span>Created {new Date(challenge.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStatus(challenge);
                                        }}
                                        className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white border border-black/5 hover:bg-[#1C1C1E] hover:text-white transition-all shadow-sm"
                                    >
                                        {challenge.status === 'ACTIVE' ? 'Close' : 'Activate'}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyLink(challenge.id);
                                        }}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copiedId === challenge.id ? 'bg-green-50 text-green-500' : 'bg-white border border-black/5 text-[#1C1C1E]/40 hover:text-proof-accent shadow-sm'
                                            }`}
                                    >
                                        {copiedId === challenge.id ? <CheckCircle2 size={16} /> : <LinkIcon size={16} />}
                                    </button>

                                    <div className="w-10 h-10 rounded-xl bg-[#1C1C1E] text-white flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-all">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}
