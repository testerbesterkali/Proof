import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Plus, ArrowUpRight, Search, Bell, Settings, ChevronDown, BarChart3, Clock, CheckCircle2, Loader2, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
    const { user } = useAuth();
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

    const stats = [
        { label: 'Active Challenges', value: activeChallenges.length.toString(), icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Submissions', value: totalSubmissions.toString(), icon: Users, color: 'text-proof-accent', bg: 'bg-proof-accent/5' },
        { label: 'Total Challenges', value: challenges.length.toString(), icon: BarChart3, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Avg. Response', value: totalSubmissions > 0 ? `${Math.round(totalSubmissions / Math.max(challenges.length, 1))} avg` : '—', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="w-full min-h-screen flex text-[#1C1C1E] bg-[#E4E5E7] font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 fixed h-full bg-white border-r border-[#1C1C1E]/5 flex flex-col p-8 z-30">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-[#1C1C1E] text-white rounded-xl flex items-center justify-center text-xl font-black">P</div>
                    <span className="font-black tracking-tighter text-xl">PROOF</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1E]/5 text-[#1C1C1E] rounded-2xl font-bold text-sm">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/employer/challenges" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Briefcase size={18} /> Challenges
                    </Link>
                    <Link to="/employer/submissions" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Users size={18} /> Submissions
                    </Link>
                    <Link to="/employer/messages" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <MessageSquare size={18} /> Messages
                    </Link>
                </nav>

                <div className="mt-auto">
                    <div className="bg-[#1C1C1E]/5 rounded-[2rem] p-6 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-2">
                            {profile?.industry || 'Employer'}
                        </p>
                        <p className="font-bold text-xs mb-4">{profile?.companySize ? `${profile.companySize} employees` : 'Set up your profile'}</p>
                        <Link to="/settings/accounts" className="w-full py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all block text-center">
                            Settings
                        </Link>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">EMPLOYER DASHBOARD</h1>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest">
                            {loading ? 'Loading...' : `Welcome back, ${profile?.companyName || user?.email || 'Employer'}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30" size={16} />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="bg-white border border-transparent focus:border-[#1C1C1E]/10 rounded-full py-3 pl-12 pr-6 text-sm font-bold w-64 shadow-soft transition-all focus:outline-none"
                            />
                        </div>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] shadow-soft transition-all">
                            <Bell size={20} />
                        </button>
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
                ) : (
                    <>
                        {/* ANALYTICS GRID */}
                        <div className="grid grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-white relative overflow-hidden group"
                                >
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-1">{stat.label}</p>
                                    <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* ACTIVE CHALLENGES TABLE */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-white">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black tracking-tighter">YOUR CHALLENGES</h2>
                                <Link
                                    to="/employer/create-challenge"
                                    className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors flex items-center gap-2"
                                >
                                    Create New <Plus size={14} strokeWidth={3} />
                                </Link>
                            </div>

                            {challenges.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-[#E4E5E7]/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="w-8 h-8 text-[#1C1C1E]/20" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No challenges yet</h3>
                                    <p className="text-[#1C1C1E]/40 font-medium text-sm mb-8 max-w-sm mx-auto">
                                        Create your first challenge to start attracting top talent. Candidates will submit their proof of work for you to review.
                                    </p>
                                    <Link
                                        to="/employer/create-challenge"
                                        className="inline-flex items-center gap-2 bg-[#1C1C1E] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#1C1C1E]/80 transition-all"
                                    >
                                        <Plus size={16} /> Create Your First Challenge
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {challenges.map((challenge, i) => (
                                        <motion.div
                                            key={challenge.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.08) }}
                                            className="group flex items-center justify-between p-6 bg-[#E4E5E7]/30 rounded-[2rem] hover:bg-white hover:shadow-glass hover:scale-[1.01] transition-all cursor-pointer border border-transparent hover:border-white"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1C1C1E]/20 font-black text-xl group-hover:bg-[#1C1C1E] group-hover:text-white transition-all shadow-sm">
                                                    {challenge.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black tracking-tight text-lg mb-1">{challenge.title}</h4>
                                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/30">
                                                        <span className="flex items-center gap-1.5"><Users size={12} /> {challenge.submissionCount} Submissions</span>
                                                        <span className={`flex items-center gap-1.5 ${challenge.status === 'ACTIVE' || challenge.status === 'active' || challenge.status === 'OPEN' ? 'text-green-500' : 'text-[#1C1C1E]/20'}`}>
                                                            <CheckCircle2 size={12} /> {challenge.status}
                                                        </span>
                                                        <span className="text-[#1C1C1E]/20">{challenge.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link to={`/employer/review/${challenge.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] group-hover:translate-x-1 transition-all shadow-sm">
                                                <ArrowUpRight size={20} strokeWidth={2.5} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
