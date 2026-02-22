import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Plus, ArrowUpRight, Search, Bell, Settings, ChevronDown, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmployerDashboard() {
    const stats = [
        { label: 'Active Challenges', value: '12', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Submissions', value: '482', icon: Users, color: 'text-proof-accent', bg: 'bg-proof-accent/5' },
        { label: 'Hiring Pipeline', value: '28', icon: BarChart3, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Avg. Time to Hire', value: '14d', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const activeChallenges = [
        { title: 'Frontend Systems Engineer', submissions: 45, unread: 12, matchRate: 88 },
        { title: 'Senior Product Designer', submissions: 128, unread: 34, matchRate: 92 },
        { title: 'Fullstack AI Architect', submissions: 89, unread: 5, matchRate: 84 },
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 mb-2">Team Plan</p>
                        <p className="font-bold text-xs mb-4">Unlimited postings</p>
                        <button className="w-full py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Manage</button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">EMPLOYER DASHBOARD</h1>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest">Welcome back, Stripe Talent Team</p>
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
                            <div className="absolute top-8 right-8 text-green-500 font-black text-xs flex items-center gap-1">
                                +12% <ArrowUpRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ACTIVE CHALLENGES TABLE */}
                <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-white">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black tracking-tighter">ACTIVE CHALLENGES</h2>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors flex items-center gap-2">
                            View All <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {activeChallenges.map((challenge, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="group flex items-center justify-between p-6 bg-[#E4E5E7]/30 rounded-[2rem] hover:bg-white hover:shadow-glass hover:scale-[1.01] transition-all cursor-pointer border border-transparent hover:border-white"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1C1C1E]/20 font-black text-xl group-hover:bg-[#1C1C1E] group-hover:text-white transition-all shadow-sm">
                                        {challenge.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black tracking-tight text-lg mb-1">{challenge.title}</h4>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/30">
                                            <span className="flex items-center gap-1.5"><Users size={12} /> {challenge.submissions} Submissions</span>
                                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-proof-accent" /> {challenge.matchRate}% Match Rate</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    {challenge.unread > 0 && (
                                        <div className="bg-proof-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                            {challenge.unread} New
                                        </div>
                                    )}
                                    <Link to={`/employer/review/sub-${i}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E] group-hover:translate-x-1 transition-all shadow-sm">
                                        <ArrowUpRight size={20} strokeWidth={2.5} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
