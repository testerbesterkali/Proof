import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Plus, ArrowUpRight, Search, Bell, Copy, CheckCircle2, ChevronRight, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
        <div className="w-full min-h-screen flex text-[#1C1C1E] bg-[#E4E5E7] font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 fixed h-full bg-white border-r border-[#1C1C1E]/5 flex flex-col p-8 z-30">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-[#1C1C1E] text-white rounded-xl flex items-center justify-center text-xl font-black">P</div>
                    <span className="font-black tracking-tighter text-xl">PROOF</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/employer/challenges" className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1E]/5 text-[#1C1C1E] rounded-2xl font-bold text-sm">
                        <Briefcase size={18} /> Challenges
                    </Link>
                    <Link to="/employer/submissions" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Users size={18} /> Submissions
                    </Link>
                    <Link to="/employer/messages" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <MessageSquare size={18} /> Messages
                    </Link>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">CHALLENGES</h1>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest">
                            Manage your hiring tests
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/employer/create-challenge"
                            className="bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all ml-4"
                        >
                            <Plus size={16} strokeWidth={3} /> NEW CHALLENGE
                        </Link>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1C1C1E]/30" />
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 shadow-soft border border-white text-center">
                        <div className="w-24 h-24 bg-[#E4E5E7]/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-[#1C1C1E]/20" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-4">NO CHALLENGES YET</h2>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest mb-10">
                            Create a challenge to start testing candidates
                        </p>
                        <Link
                            to="/employer/create-challenge"
                            className="inline-flex items-center gap-2 bg-[#1C1C1E] text-white px-10 py-5 rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:translate-y-[-2px] transition-all"
                        >
                            <Plus size={18} strokeWidth={3} /> Create Your First Challenge
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {challenges.map((challenge, i) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[2rem] p-8 shadow-soft border border-white flex items-center justify-between group hover:shadow-glass hover:scale-[1.01] transition-all"
                            >
                                <div className="flex items-center gap-8">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm text-2xl font-black ${challenge.status === 'ACTIVE'
                                            ? 'bg-blue-50 text-blue-500'
                                            : 'bg-[#E4E5E7]/50 text-[#1C1C1E]/30'
                                        }`}>
                                        {challenge.title.charAt(0)}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black tracking-tight">{challenge.title}</h3>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${challenge.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {challenge.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                                {challenge.status}
                                            </span>
                                            {!challenge.isPublic && (
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700">
                                                    Invite Only
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">
                                            <span className="flex items-center gap-1.5"><Users size={14} className="text-[#1C1C1E]/20" /> {challenge.submissionCount} Submissions</span>
                                            <span className="flex items-center gap-1.5"><AlertCircle size={14} className="text-[#1C1C1E]/20" /> {challenge.type}</span>
                                            {challenge.timeLimitMins && (
                                                <span className="flex items-center gap-1.5">⏱ {challenge.timeLimitMins} mins</span>
                                            )}
                                            <span>Created {new Date(challenge.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleStatus(challenge)}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors border-r border-[#1C1C1E]/10 pr-4 mr-1"
                                    >
                                        {challenge.status === 'ACTIVE' ? 'Close Challenge' : 'Reactivate'}
                                    </button>

                                    <button
                                        onClick={() => copyLink(challenge.id)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copiedId === challenge.id ? 'bg-green-50 text-green-500' : 'bg-[#1C1C1E]/5 text-[#1C1C1E]/40 hover:bg-[#1C1C1E]/10 hover:text-[#1C1C1E]'
                                            }`}
                                        title="Copy link to challenge"
                                    >
                                        {copiedId === challenge.id ? <CheckCircle2 size={18} /> : <LinkIcon size={18} />}
                                    </button>

                                    <Link
                                        to={`/employer/review/${challenge.id}`}
                                        className="w-12 h-12 rounded-xl bg-[#1C1C1E] text-white flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
                                    >
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
