import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Plus, ArrowUpRight, Search, Bell, Settings, ChevronDown, BarChart3, Clock, CheckCircle2, Loader2, Building2, LogOut, ShieldCheck, Zap, TrendingUp, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { EmployerLayout } from '../components/EmployerLayout';

interface EmployerProfileData {
    id: string;
    companyName: string;
    industry: string | null;
    companySize: string | null;
    verifiedUrl: string | null;
}

interface ChallengeData {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    submissionCount: number;
}

export function EmployerDashboard() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<EmployerProfileData | null>(null);
    const [challenges, setChallenges] = React.useState<ChallengeData[]>([]);
    const [totalSubmissions, setTotalSubmissions] = React.useState(0);

    React.useEffect(() => {
        if (user) loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Get employer profile
            const { data: profileData } = await supabase
                .from('EmployerProfile')
                .select('id, companyName, industry, companySize, verifiedUrl')
                .eq('userId', user.id)
                .single();

            setProfile(profileData);

            if (profileData?.id) {
                // 2. Get challenges for this employer
                const { data: challengeData } = await supabase
                    .from('Challenge')
                    .select('id, title, type, status, createdAt')
                    .eq('employerId', profileData.id)
                    .order('createdAt', { ascending: false });

                // 3. For each challenge, count submissions
                const challengesWithCounts: ChallengeData[] = [];
                let totalSubs = 0;

                if (challengeData) {
                    for (const c of challengeData) {
                        const { count } = await supabase
                            .from('Submission')
                            .select('id', { count: 'exact', head: true })
                            .eq('challengeId', c.id);

                        const subCount = count || 0;
                        totalSubs += subCount;
                        challengesWithCounts.push({ ...c, submissionCount: subCount });
                    }
                }

                setChallenges(challengesWithCounts);
                setTotalSubmissions(totalSubs);
            }
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const activeChallenges = challenges.filter(c => c.status === 'ACTIVE' || c.status === 'active' || c.status === 'OPEN');

    if (loading) {
        return (
            <EmployerLayout>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-proof-accent" />
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout>
            <div className="flex-1 flex flex-col">
                {/* HERO AND CHART SECTION */}
                <section className="flex flex-col lg:flex-row justify-between mb-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md pt-4"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-7xl font-light tracking-tighter leading-none uppercase">Your</h1>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2 shadow-sm"
                            >
                                <Zap size={10} className="text-proof-accent fill-proof-accent" />
                                Talent Index
                            </motion.div>
                        </div>
                        <h1 className="text-7xl font-bold tracking-tighter leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/60 uppercase">
                            Employer Hub
                        </h1>

                        <p className="text-[#1C1C1E]/50 text-base leading-relaxed font-medium max-w-sm mb-12">
                            Welcome back, <span className="text-[#1C1C1E]">{profile?.companyName || 'Employer'}</span>.
                            Your active challenges are attracting top-tier verified talent from across the Proof network.
                            <span className="text-[#1C1C1E] block mt-2">Manage your pipeline and review submissions below.</span>
                        </p>

                        <div className="flex items-center gap-3 bg-white/40 p-2.5 rounded-[2rem] w-max border border-white shadow-soft">
                            <Link
                                to="/employer/create-challenge"
                                className="px-6 py-3 bg-[#1C1C1E] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md flex items-center gap-2"
                            >
                                <Plus size={14} /> Create Challenge
                            </Link>
                            <div className="w-10 h-10 rounded-full bg-proof-accent/10 flex items-center justify-center text-proof-accent font-black text-xl">
                                #
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 flex justify-end relative mt-16 lg:mt-0"
                    >
                        <motion.div
                            className="flex-1 flex flex-col items-center lg:items-end gap-6 mt-16 lg:mt-0 px-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[540px]">
                                {/* Verification Badge Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-glass border border-white flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-proof-accent/10 flex items-center justify-center text-proof-accent shadow-inner">
                                            <ShieldCheck size={28} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-1">Status</h4>
                                            <p className="text-lg font-black tracking-tight leading-none uppercase">Verified Employer</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Now
                                        </div>
                                        <p className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">Company Verified</p>
                                    </div>
                                </motion.div>

                                {/* Match Confidence Card -> Pipeline Efficiency */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-glass border border-white flex flex-col justify-between aspect-square"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#1C1C1E] flex items-center justify-center text-white">
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <ArrowUpRight size={20} className="text-[#1C1C1E]/20" />
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black tracking-tighter mb-1">
                                            {totalSubmissions > 0 ? '88%' : '-%'}
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">Pipeline Efficiency</h4>
                                    </div>
                                </motion.div>

                                {/* Hiring Velocity Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-glass border border-white flex flex-col justify-between aspect-square"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-xl bg-proof-accent flex items-center justify-center text-white">
                                            <TrendingUp size={20} strokeWidth={3} />
                                        </div>
                                        <div className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase">Active</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black tracking-tighter mb-1">
                                            {activeChallenges.length}
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">Active Challenges</h4>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Talent Flow Stats (Employer View) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="w-full max-w-[540px] bg-[#1C1C1E] text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between"
                            >
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Challenges</p>
                                        <p className="text-lg font-black tracking-tighter">{challenges.length}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Total Subs</p>
                                        <p className="text-lg font-black tracking-tighter">{totalSubmissions}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Under Review</p>
                                        <p className="text-lg font-black tracking-tighter text-proof-accent">{totalSubmissions}</p>
                                    </div>
                                </div>
                                <Link to="/employer/analytics" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all">
                                    Analytics <ChevronDown size={12} />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* CHALLENGES LIST - Candidate Style Grid */}
                <section className="mt-2 pt-1">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tighter uppercase px-1">Your Challenges</h2>
                        <div className="flex items-center gap-6 text-[11px] font-black tracking-widest uppercase">
                            <Link
                                to="/employer/create-challenge"
                                className="group flex items-center gap-2 px-5 py-2.5 bg-white shadow-soft rounded-full text-[10px] font-black tracking-wider uppercase text-[#1C1C1E] border border-black/5 hover:bg-[#1C1C1E] hover:text-white transition-all transition-all"
                            >
                                Create New <Plus size={14} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>

                    {challenges.length === 0 ? (
                        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-16 shadow-soft border border-white text-center">
                            <div className="w-24 h-24 bg-[#E4E5E7]/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="w-10 h-10 text-[#1C1C1E]/20" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">No Challenges Created</h2>
                            <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest mb-10">
                                Start by creating your first challenge to attract verified talent.
                            </p>
                            <Link
                                to="/employer/create-challenge"
                                className="bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-black text-xs tracking-widest uppercase inline-flex items-center gap-2 shadow-xl hover:translate-y-[-2px] transition-all"
                            >
                                Create Challenge <Plus size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                            {challenges.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (0.1 * i), type: "spring" }}
                                    onClick={() => (window.location.href = `/employer/submissions?challengeId=${c.id}`)}
                                    className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass-soft border border-white/60 flex flex-col justify-between min-w-[280px] hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-[-10px] left-[-10px] w-20 h-20 bg-proof-accent opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />

                                    <div className="absolute top-8 right-8 text-[#1C1C1E]/20 group-hover:text-proof-accent transition-colors">
                                        <ArrowUpRight size={22} strokeWidth={2.5} />
                                    </div>

                                    <div className="mb-10">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center overflow-hidden border border-[#1C1C1E]/5 text-xl font-black text-[#1C1C1E]">
                                            {c.title.charAt(0)}
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight mb-1 truncate">{c.title}</h3>
                                        <p className="text-[11px] text-[#1C1C1E]/40 font-bold uppercase tracking-widest truncate">{c.type} Challenge</p>
                                        <p className="text-[9px] text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black tracking-tighter">{c.submissionCount}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#1C1C1E]/40">Submissions</span>
                                        </div>

                                        <div className="flex flex-col gap-1.5 items-end">
                                            <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${c.status === 'ACTIVE' || c.status === 'active' || c.status === 'OPEN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {c.status}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </EmployerLayout>
    );
}

