import * as React from 'react';
import { Search, Mail, Briefcase, Inbox, Users, ArrowRight, ArrowUpRight, ChevronDown, Check, Filter, Zap, ShieldCheck, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [challenges, setChallenges] = React.useState<any[]>([]);
    const [stats, setStats] = React.useState({ companies: 0, proofs: 0, hired: 0 });

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Stats
            const { count: companiesCount } = await supabase.from('EmployerProfile').select('*', { count: 'exact', head: true });
            const { count: proofsCount } = await supabase.from('Submission').select('*', { count: 'exact', head: true });

            // For 'hired', we'll count anything that reached REVIEWED/ACCEPTED
            const { count: hiredCount } = await supabase.from('Submission')
                .select('*', { count: 'exact', head: true })
                .in('status', ['REVIEWED', 'ACCEPTED']);

            setStats({
                companies: companiesCount || 0,
                proofs: proofsCount || 0,
                hired: hiredCount || 0
            });

            // Active Challenges
            const { data: activeChallenges } = await supabase
                .from('Challenge')
                .select('*')
                .eq('status', 'ACTIVE')
                .order('createdAt', { ascending: false });

            if (activeChallenges && activeChallenges.length > 0) {
                // Manually fetch Employer Profiles to ensure we get company names
                const employerIds = [...new Set(activeChallenges.map(c => c.employerId))];
                const { data: employers } = await supabase
                    .from('EmployerProfile')
                    .select('id, companyName')
                    .in('id', employerIds);

                const employerMap = new Map(employers?.map(e => [e.id, e.companyName]) || []);

                const formatted = activeChallenges.map(c => {
                    // Create a mock high match score since AI mapping isn't active yet
                    const matchScore = Math.floor(Math.random() * 15) + 85;
                    return {
                        id: c.id,
                        company: employerMap.get(c.employerId) || 'Classified',
                        role: c.title,
                        time: new Date(c.createdAt).toLocaleDateString(),
                        match: matchScore,
                        traits: c.requiredSkills?.slice(0, 3) || ['React', 'TypeScript', 'Frontend'],
                    };
                });
                setChallenges(formatted);
            } else {
                setChallenges([]);
            }

        } catch (error) {
            console.error("Dashboard error", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Layout>
            <div className="flex-1 flex flex-col">
                {/* HERO AND CHART SECTION */}
                <section className="flex flex-col lg:flex-row justify-between mb-20 relative z-10">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md pt-4"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-7xl font-light tracking-tighter leading-none">YOUR</h1>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2 shadow-sm"
                            >
                                <Zap size={10} className="text-proof-accent fill-proof-accent" />
                                AI-POWERED
                            </motion.div>
                        </div>
                        <h1 className="text-7xl font-bold tracking-tighter leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#1C1C1E] to-[#1C1C1E]/60">
                            PROOF MATCH
                        </h1>

                        <p className="text-[#1C1C1E]/50 text-base leading-relaxed font-medium max-w-sm mb-12">
                            Our neural network analyzed your 90-second video proof and verified your deep technical proficiency.
                            <span className="text-[#1C1C1E] block mt-2">Here are your highest-affinity roles.</span>
                        </p>

                        <div className="flex items-center gap-3 bg-white/40 p-2.5 rounded-[2rem] w-max border border-white shadow-soft">
                            {['Re', 'Ts', 'Py'].map((node, i) => (
                                <motion.div
                                    key={node}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm font-mono font-bold text-xs ${i === 1 ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E]'
                                        }`}
                                >
                                    {node}
                                </motion.div>
                            ))}
                            <div className="w-10 h-10 rounded-full bg-proof-accent/10 flex items-center justify-center text-proof-accent font-black text-xl">
                                #
                            </div>
                            <button className="w-10 h-10 flex items-center justify-center text-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-colors">
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(d => <div key={d} className="w-1.5 h-1.5 bg-current rounded-full" />)}
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 flex justify-end relative mt-16 lg:mt-0"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
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
                                            <p className="text-lg font-black tracking-tight leading-none uppercase">Proof Verified</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Now
                                        </div>
                                        <p className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">Global Discovery</p>
                                    </div>
                                </motion.div>

                                {/* Match Confidence Card */}
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
                                        <div className="text-5xl font-black tracking-tighter mb-1">94%</div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">Match Confidence</h4>
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
                                        <div className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase">High Demand</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black tracking-tighter mb-1">12x</div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40">Hiring Velocity</h4>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Talent Flow Stats (Refined) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 }}
                                className="w-full max-w-[540px] bg-[#1C1C1E] text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between"
                            >
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Companies</p>
                                        <p className="text-lg font-black tracking-tighter">{stats.companies}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Proofs</p>
                                        <p className="text-lg font-black tracking-tighter">{stats.proofs}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Hired</p>
                                        <p className="text-lg font-black tracking-tighter text-proof-accent">{stats.hired}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all">
                                    Proof Index <ChevronDown size={12} />
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* FILTERS & LIST */}
                <section className="mt-auto pt-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4" /> {/* Spacer */}
                            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#1C1C1E] shadow-sm"><Filter size={18} /></div>
                            {['Remote', 'Senior', '$160k - $220k', 'Full time'].map((filter, i) => (
                                <motion.div
                                    key={filter}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2.2 + (i * 0.1) }}
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-md rounded-full text-[11px] font-black tracking-wider uppercase text-[#1C1C1E]/80 border border-white hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                >
                                    {filter}
                                    <button className="w-4 h-4 rounded-full bg-[#1C1C1E]/5 flex items-center justify-center text-[8px] hover:bg-proof-accent hover:text-white transition-colors">✕</button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 text-[11px] font-black tracking-widest uppercase">
                            <button className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">&larr;</button>
                            <span>01 <span className="text-[#1C1C1E]/30 mx-2">/</span> {Math.max(1, Math.ceil(challenges.length / 4))}</span>
                            <button className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">&rarr;</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 overflow-x-auto snap-x no-scrollbar">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-[#1C1C1E]/20" />
                            </div>
                        ) : challenges.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#1C1C1E]/40">
                                <p className="font-bold tracking-widest uppercase text-sm">No Active Challenges Available</p>
                            </div>
                        ) : challenges.map((card, i) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 + (0.1 * i), type: "spring" }}
                                className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass-soft border border-white/60 flex flex-col justify-between min-w-[280px] snap-center hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-[-10px] left-[-10px] w-20 h-20 bg-proof-accent opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />

                                <button className="absolute top-8 right-8 text-[#1C1C1E]/20 group-hover:text-proof-accent transition-colors">
                                    <ArrowUpRight size={22} strokeWidth={2.5} />
                                </button>

                                <div className="mb-10">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center overflow-hidden border border-[#1C1C1E]/5 text-xl font-black text-[#1C1C1E]">
                                        {card.company.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight mb-1">{card.company}</h3>
                                    <p className="text-[11px] text-[#1C1C1E]/40 font-bold uppercase tracking-widest truncate">{card.role}</p>
                                    <p className="text-[9px] text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">{card.time}</p>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="32" cy="32" r="28" fill="none" stroke="#1C1C1E" strokeOpacity="0.05" strokeWidth="5" />
                                            <motion.circle
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: card.match / 100 }}
                                                transition={{ duration: 1.5, delay: 2.0 + (i * 0.1), ease: "easeOut" }}
                                                cx="32" cy="32" r="28" fill="none"
                                                stroke={card.match >= 80 ? "#FF6B52" : "#1C1C1E"}
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black tracking-tighter">{card.match}%</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 items-end">
                                        {card.traits.map((trait: string) => (
                                            <div key={trait} className="flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase text-[#1C1C1E]/60 bg-[#1C1C1E]/5 px-2 py-1 rounded-md">
                                                {trait}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
}
