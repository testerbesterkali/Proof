import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, ChevronRight, Loader2, CheckCircle2, Clock, XCircle, FileText, LogOut, ArrowUpRight, Filter, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';

interface SubmissionData {
    id: string;
    candidateName: string;
    challengeTitle: string;
    status: string;
    createdAt: string;
    score: number | null;
    candidateId: string;
    challengeId: string;
}

export function EmployerSubmissions() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [submissions, setSubmissions] = React.useState<SubmissionData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        if (user) loadSubmissions();
    }, [user]);

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
                const { data: challenges } = await supabase
                    .from('Challenge')
                    .select('id, title')
                    .eq('employerId', profile.id);

                if (challenges && challenges.length > 0) {
                    const challengeIds = challenges.map(c => c.id);
                    const challengeMap = new Map(challenges.map(c => [c.id, c.title]));

                    // 3. Get submissions for those challenges
                    // FIXED: Using createdAt and candidateId instead of submittedAt and candidateProfileId
                    const { data: submissionData } = await supabase
                        .from('Submission')
                        .select('*')
                        .in('challengeId', challengeIds)
                        .order('createdAt', { ascending: false });

                    if (submissionData) {
                        const formatted = submissionData.map((s: any) => ({
                            id: s.id,
                            candidateName: `Candidate #${s.candidateId.substring(0, 6)}`, // Fallback name
                            challengeTitle: challengeMap.get(s.challengeId) || 'Unknown Challenge',
                            status: s.status,
                            score: s.score,
                            createdAt: s.createdAt,
                            candidateId: s.candidateId,
                            challengeId: s.challengeId,
                        }));
                        setSubmissions(formatted);
                    }
                }
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
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest w-max ${status === 'ACCEPTED' || status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' :
                            status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-proof-accent/10 text-proof-accent'
                        }`}>
                        {status}
                    </span>
                    {score !== null && (
                        <span className="text-[10px] font-black tracking-tighter text-[#1C1C1E]/40">{score}% Match</span>
                    )}
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
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                        <AnimatePresence>
                            {filtered.map((sub, i) => (
                                <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i, type: "spring" }}
                                    onClick={() => (window.location.href = `/employer/review/${sub.id}`)}
                                    className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass-soft border border-white/60 flex flex-col justify-between hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden"
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
                                        <p className="text-[11px] text-[#1C1C1E]/40 font-bold uppercase tracking-widest truncate">{sub.challengeTitle}</p>
                                        <p className="text-[9px] text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">
                                            Submitted {new Date(sub.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <StatusBadge status={sub.status} score={sub.score} />
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-[#F8F9FB] flex items-center justify-center overflow-hidden shadow-sm">
                                                    <img src={`https://i.pravatar.cc/100?u=${sub.candidateId}${j}`} alt="" className="w-full h-full object-cover opacity-60" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filtered.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-[#1C1C1E]/40 font-black uppercase tracking-widest text-sm">No submissions match your search</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}

