import * as React from 'react';
import { Search, Mail, Briefcase, Inbox, Users, ArrowRight, ArrowUpRight, ChevronDown, Check, Filter, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export function Dashboard() {
    const location = useLocation();

    const sidebarItems = [
        { icon: Briefcase, path: '/challenges', label: 'Challenges' },
        { icon: Search, path: '/', label: 'Overview' },
        { icon: Users, path: '/community', label: 'Community' },
        { icon: Mail, path: '/messages', label: 'Messages' },
        { icon: Inbox, path: '/upload', label: 'Record Proof' },
    ];

    return (
        <div className="w-full min-h-screen flex text-[#1C1C1E] overflow-hidden relative">

            {/* LEFT SIDEBAR (Floating Icons) */}
            <aside className="w-24 fixed h-full flex flex-col items-center py-10 z-30">
                <Link to="/" className="mb-16 flex items-center justify-center relative group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-2xl bg-[#1C1C1E] flex items-center justify-center text-white font-black text-xl relative z-10 shadow-lg group-hover:bg-proof-accent transition-colors"
                    >
                        P
                    </motion.div>
                    <div className="absolute w-8 h-8 -bottom-3 -right-3 rounded-full border-2 border-white overflow-hidden z-20 shadow-md">
                        <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
                    </div>
                </Link>

                <nav className="flex flex-col gap-6">
                    {sidebarItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${isActive
                                    ? 'bg-white text-[#1C1C1E] shadow-glass'
                                    : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-white/40'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2.5} />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActive"
                                            className="absolute left-[-16px] w-1.5 h-6 bg-proof-accent rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="absolute left-16 bg-[#1C1C1E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-24 pl-8 pr-12 pt-8 flex flex-col relative min-h-screen overflow-y-auto scroll-smooth">

                {/* HEADER BAR */}
                <header className="flex items-center justify-between mb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex bg-white/40 backdrop-blur-xl px-2 py-2 rounded-full gap-1 shadow-glass border border-white/40"
                    >
                        {['Overview', 'Challenges', 'Reviews', 'Community'].map((item, i) => {
                            const path = item === 'Challenges' ? '/challenges' : '/';
                            const isActive = (item === 'Overview' && location.pathname === '/') || (item === 'Challenges' && location.pathname === '/challenges');
                            return (
                                <Link
                                    key={item}
                                    to={path}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${isActive
                                        ? 'bg-[#1C1C1E] text-white shadow-lg'
                                        : 'text-[#1C1C1E]/50 hover:text-[#1C1C1E] hover:bg-white/50'
                                        }`}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <button className="text-xs font-bold text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors uppercase tracking-widest">
                            Support
                        </button>
                        <Link
                            to="/challenges"
                            className="bg-proof-accent text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center gap-2"
                        >
                            FIND A CHALLENGE <ArrowRight size={14} strokeWidth={3} />
                        </Link>
                    </div>
                </header>

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
                            {/* THE ARC SVG GRAPH */}
                            <div className="relative w-full max-w-[600px] h-[340px]">
                                <svg viewBox="0 0 500 250" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
                                            <stop offset="60%" stopColor="#FF9B8A" />
                                            <stop offset="100%" stopColor="#FF6B52" />
                                        </linearGradient>
                                        <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                            <line x1="0" y1="0" x2="0" y2="8" stroke="#000000" strokeOpacity="0.05" strokeWidth="1" />
                                        </pattern>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Left hatched slice */}
                                    <motion.path
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        d="M 50 220 A 170 170 0 0 1 148 81 L 180 126 A 115 115 0 0 0 115 220 Z"
                                        fill="url(#diagonalHatch)"
                                    />

                                    {/* Right colored arc */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                        d="M 148 81 A 170 170 0 0 1 390 220 L 325 220 A 115 115 0 0 0 180 126 Z"
                                        fill="url(#arcGradient)"
                                        filter="url(#glow)"
                                    />

                                    {/* Base dashed line */}
                                    <path d="M 30 220 L 410 220" fill="none" stroke="#1C1C1E" strokeOpacity="0.05" strokeWidth="2" strokeDasharray="8 8" />

                                    {/* Interactive Dots */}
                                    {[
                                        { cx: 180, cy: 126, label: "10k+", delay: 1.2 },
                                        { cx: 270, cy: 55, label: "60k+", delay: 1.4 },
                                        { cx: 370, cy: 160, label: "100k+", delay: 1.6, hollow: true }
                                    ].map((dot, i) => (
                                        <g key={i}>
                                            <motion.circle
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: dot.delay, type: "spring" }}
                                                cx={dot.cx} cy={dot.cy} r="6"
                                                fill={dot.hollow ? "#FFF" : "#FF6B52"}
                                                stroke="#FF6B52" strokeWidth={dot.hollow ? 2 : 0}
                                            />
                                            <motion.text
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: dot.delay + 0.2 }}
                                                x={dot.cx} y={dot.cy - 15} fontSize="14" fill="#1C1C1E" fontWeight="900" textAnchor="middle" fontFamily="Outfit"
                                            >
                                                {dot.label}
                                            </motion.text>
                                        </g>
                                    ))}

                                    <text x="220" y="245" fontSize="11" fill="#1C1C1E" opacity="0.3" fontWeight="800" textAnchor="middle" fontFamily="Outfit" className="uppercase tracking-[0.2em]">
                                        candidate proofs evaluated
                                    </text>
                                </svg>

                                {/* FLOATING DATA CARDS - Moved inside the relative container for better placement */}
                                <div className="absolute right-[-20px] top-4 flex flex-col gap-4 z-20">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.8 }}
                                        className="bg-white/80 backdrop-blur-2xl px-6 py-5 rounded-[2rem] shadow-glass border border-white flex flex-col gap-4 min-w-[240px]"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-proof-accent">TALENT FLOW</span>
                                            <ChevronDown size={14} className="text-[#1C1C1E]/30" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <div className="flex items-center gap-2 text-[#1C1C1E]/60"><Briefcase size={12} /> Companies</div>
                                                <span>2,234</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <div className="flex items-center gap-2 text-[#1C1C1E]/60"><Inbox size={12} /> Challenges</div>
                                                <span>815,871</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <div className="flex items-center gap-2 text-[#1C1C1E]/60"><Check size={12} /> Hired</div>
                                                <span className="text-proof-accent">102k</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 2.0 }}
                                        className="bg-white/80 backdrop-blur-2xl px-6 py-4 rounded-full shadow-glass border border-white flex justify-between items-center group cursor-pointer"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/40 group-hover:text-[#1C1C1E] transition-colors">Proof Index</span>
                                        <div className="w-5 h-5 rounded-full bg-[#1C1C1E]/5 flex items-center justify-center">
                                            <ChevronDown size={12} strokeWidth={3} />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* FILTERS & LIST */}
                    <section className="mt-auto pt-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
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
                                <span>02 <span className="text-[#1C1C1E]/30 mx-2">/</span> 153</span>
                                <button className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">&rarr;</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 overflow-x-auto snap-x no-scrollbar">
                            {[
                                { company: "Wise", role: "Frontend Challenge", time: "2 h ago", match: 92, traits: ["Deep React", "Perf Audit", "Scalability"] },
                                { company: "Amazon", role: "System Design", time: "7 h ago", match: 84, traits: ["Kafka/SQS", "Distributed", "Security"] },
                                { company: "Slack", role: "React Performance", time: "9 h ago", match: 63, traits: ["Profiling", "React 19", "WebWorkers"], status: "Core Skill" },
                                { company: "Google", role: "UX Engine", time: "11 h ago", match: 81, traits: ["Motion", "Typescript", "A11y"] }
                            ].map((card, i) => (
                                <motion.div
                                    key={card.company}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.5 + (0.1 * i), type: "spring" }}
                                    className="group bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass-soft border border-white/60 flex flex-col justify-between min-w-[280px] snap-center hover:shadow-glass hover:bg-white/80 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-[-10px] left-[-10px] w-20 h-20 bg-proof-accent opacity-0 group-hover:opacity-5 blur-[40px] transition-all" />

                                    <button className="absolute top-8 right-8 text-[#1C1C1E]/20 group-hover:text-proof-accent transition-colors">
                                        <ArrowUpRight size={22} strokeWidth={2.5} />
                                    </button>

                                    <div className="mb-10">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center overflow-hidden border border-[#1C1C1E]/5">
                                            <div className="w-6 h-6 bg-[#1C1C1E] rounded-md opacity-10" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight mb-1">{card.company}</h3>
                                        <p className="text-[11px] text-[#1C1C1E]/40 font-bold uppercase tracking-widest">{card.role} &middot; {card.time}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="32" cy="32" r="28" fill="none" stroke="#1C1C1E" strokeOpacity="0.05" strokeWidth="5" />
                                                <motion.circle
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: card.match / 100 }}
                                                    transition={{ duration: 1.5, delay: 3.0 + (i * 0.1), ease: "easeOut" }}
                                                    cx="32" cy="32" r="28" fill="none"
                                                    stroke={card.match >= 80 ? "#FF6B52" : "#1C1C1E"}
                                                    strokeWidth="5"
                                                    strokeLinecap="round"
                                                    filter="url(#glow)"
                                                />
                                            </svg>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-black tracking-tighter">{card.match}%</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 items-end">
                                            {card.traits.map(trait => (
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
            </main>
        </div>
    );
}
