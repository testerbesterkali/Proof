import React from 'react';
import { Search, Mail, Briefcase, Inbox, Users, ArrowRight, ArrowUpRight, ChevronDown, Check, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
    return (
        <div className="w-full min-h-screen flex text-[#1C1C1E] overflow-hidden">

            {/* LEFT SIDEBAR (Floating Icons) */}
            <aside className="w-24 fixed h-full flex flex-col items-center py-8 z-20">
                <div className="mb-16 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-proof-accent flex items-center justify-center text-white font-bold text-xl relative z-10">
                        P
                    </div>
                    <div className="absolute w-8 h-8 -bottom-2 -right-2 rounded-full border-2 border-[#EAEBEC] overflow-hidden z-20">
                        <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>

                <nav className="flex flex-col gap-8">
                    {[Search, Mail, Briefcase, Inbox, Users].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 flex items-center justify-center rounded-2xl text-[#1C1C1E]/50 hover:text-[#1C1C1E] hover:bg-white/50 transition-all">
                            <Icon size={20} strokeWidth={2} />
                        </button>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-24 pl-8 pr-12 pt-8 flex flex-col relative min-h-screen overflow-y-auto">

                {/* HEADER BAR */}
                <header className="flex items-center justify-between mb-16 relative z-10">
                    <div className="flex bg-[#D8D9DB]/50 backdrop-blur-md px-6 py-3 rounded-full gap-8 shadow-inner-soft border border-white/20">
                        {['Overview', 'Challenges', 'Company reviews', 'Community'].map((item, i) => (
                            <button key={item} className={`text-sm font-medium transition-colors ${i === 0 ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/50 hover:text-[#1C1C1E]'}`}>
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-sm font-medium text-[#1C1C1E]/60 hover:text-[#1C1C1E]">
                            Post challenge
                        </button>
                        <button className="bg-white px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:scale-105 transition-transform">
                            Find a challenge
                        </button>
                    </div>
                </header>

                {/* HERO AND CHART SECTION */}
                <section className="flex flex-col lg:flex-row justify-between mb-16 relative z-10">

                    <div className="max-w-md pt-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-6xl font-light tracking-tight">YOUR</h1>
                            <span className="px-4 py-1.5 border border-[#1C1C1E]/10 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center">
                                AI - Powered
                            </span>
                        </div>
                        <h1 className="text-6xl font-medium tracking-tight mb-6">PROOF MATCH</h1>

                        <p className="text-[#1C1C1E]/60 text-sm leading-relaxed max-w-sm mb-10">
                            AI has carefully looked at your video proofs and found the best technical challenges that match your demonstrated skills.
                        </p>

                        <div className="flex items-center gap-2 bg-[#D8D9DB]/30 p-2 rounded-full w-max">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <span className="text-xs font-bold font-mono">Re</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shadow-sm">
                                <span className="text-xs font-bold font-mono">Ts</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <span className="text-xl font-bold font-mono text-proof-accent">#</span>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center text-[#1C1C1E]/50 hover:text-[#1C1C1E]">
                                <div className="w-1 h-1 bg-current rounded-full mx-[1px]" />
                                <div className="w-1 h-1 bg-current rounded-full mx-[1px]" />
                                <div className="w-1 h-1 bg-current rounded-full mx-[1px]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 right-0 flex justify-end relative mt-12 lg:mt-0">
                        {/* THE ARC SVG GRAPH */}
                        <div className="relative w-full max-w-[600px] h-[300px]">
                            <svg viewBox="0 0 500 250" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                                        <stop offset="60%" stopColor="#FF9B8A" />
                                        <stop offset="100%" stopColor="#FF6B52" />
                                    </linearGradient>
                                    <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                        <line x1="0" y1="0" x2="0" y2="8" stroke="#000000" strokeOpacity="0.05" strokeWidth="1" />
                                    </pattern>
                                </defs>

                                {/* Left hatched slice */}
                                <path d="M 50 220 A 170 170 0 0 1 148 81 L 180 126 A 115 115 0 0 0 115 220 Z" fill="url(#diagonalHatch)" />

                                {/* Right colored arc */}
                                <path d="M 148 81 A 170 170 0 0 1 390 220 L 325 220 A 115 115 0 0 0 180 126 Z" fill="url(#arcGradient)" />

                                {/* Base dashed line */}
                                <path d="M 30 220 L 410 220" fill="none" stroke="#000000" strokeOpacity="0.1" strokeDasharray="4 4" />

                                {/* Data points */}
                                <circle cx="180" cy="126" r="4" fill="#FF6B52" />
                                <circle cx="270" cy="55" r="4" fill="#FF6B52" />
                                <circle cx="370" cy="160" r="4" fill="#FFFFFF" stroke="#FF6B52" strokeWidth="2" />

                                {/* Labels */}
                                <text x="50" y="240" fontSize="10" fill="#1C1C1E" opacity="0.5" fontFamily="Outfit">2023</text>
                                <text x="375" y="240" fontSize="10" fill="#1C1C1E" opacity="0.5" fontFamily="Outfit">2024</text>
                                <text x="220" y="240" fontSize="10" fill="#1C1C1E" opacity="0.8" fontWeight="500" textAnchor="middle" fontFamily="Outfit">Growth of candidate proofs evaluated</text>

                                <text x="160" y="115" fontSize="12" fill="#1C1C1E" fontWeight="600" fontFamily="Outfit">10k+</text>
                                <text x="260" y="45" fontSize="12" fill="#1C1C1E" fontWeight="600" fontFamily="Outfit">60k+</text>
                                <text x="350" y="30" fontSize="12" fill="#1C1C1E" fontWeight="600" fontFamily="Outfit">100k+</text>
                            </svg>
                        </div>

                        {/* FLOATING ACTION CARDS */}
                        <div className="absolute right-0 top-10 flex flex-col gap-3 z-20">
                            <div className="bg-white/70 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-glass border border-white flex flex-col gap-3 min-w-[220px]">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span>Talent recruitment</span>
                                    <ChevronDown size={14} className="text-[#1C1C1E]/50" />
                                </div>
                                <div className="flex flex-col gap-2 text-[11px] text-[#1C1C1E]/70 font-medium">
                                    <div className="flex items-center gap-2"><Briefcase size={12} /> Companies (2 234)</div>
                                    <div className="flex items-center gap-2"><Inbox size={12} /> Challenges (815 871)</div>
                                    <div className="flex items-center gap-2"><Check size={12} /> Offers (102 339)</div>
                                </div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-glass border border-white flex justify-between items-center text-sm font-semibold">
                                <span>Proof Index</span>
                                <ChevronDown size={14} className="text-[#1C1C1E]/50" />
                            </div>

                            <div className="bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-glass border border-white flex justify-between items-center text-sm font-semibold">
                                <span>Salary growth</span>
                                <ChevronDown size={14} className="text-[#1C1C1E]/50" />
                            </div>
                        </div>

                    </div>
                </section>

                {/* FILTERS & LIST */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="text-[#1C1C1E]/40"><Filter size={20} /></div>
                            {['Remote', 'Senior', '$160k - $220k', 'Full time'].map(filter => (
                                <div key={filter} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D8D9DB]/50 rounded-full text-xs font-medium text-[#1C1C1E]/80 border border-[#1C1C1E]/5">
                                    {filter}
                                    <button className="w-3 h-3 rounded-full bg-[#1C1C1E]/10 flex items-center justify-center text-[8px] hover:bg-[#1C1C1E]/20 text-[#1C1C1E]/60 ml-1">x</button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <button className="w-6 h-6 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#1C1C1E]">&larr;</button>
                            <span>02 <span className="text-[#1C1C1E]/40 font-medium">/ 153</span></span>
                            <button className="w-6 h-6 flex items-center justify-center hover:text-[#1C1C1E]">&rarr;</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 overflow-x-auto snap-x">

                        {[
                            { company: "Wise", role: "Frontend Challenge", time: "2 h ago", match: 92, traits: ["Skills", "Salary", "Experience"] },
                            { company: "Amazon", role: "System Design", time: "7 h ago", match: 84, traits: ["Benefits", "Salary", "Benefits"] },
                            { company: "Slack", role: "React Performance", time: "9 h ago", match: 63, traits: ["Experience", "Salary", "Opportunities"], status: "Good Match" },
                            { company: "Google", role: "UX/UI Challenge", time: "11 h ago", match: 81, traits: ["Skills", "Salary", "Experience"] }
                        ].map((card, i) => (
                            <motion.div
                                key={card.company}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-proof-card rounded-[2rem] p-6 shadow-soft flex flex-col justify-between min-w-[260px] snap-center hover:shadow-glass cursor-pointer transition-shadow relative"
                            >
                                <button className="absolute top-6 right-6 text-[#1C1C1E]/40 hover:text-[#1C1C1E]">
                                    <ArrowUpRight size={18} />
                                </button>
                                <div className="mb-8">
                                    <h3 className="text-xl font-medium mb-1">{card.company}</h3>
                                    <p className="text-xs text-[#1C1C1E]/40 font-medium">{card.role} &middot; {card.time}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="48" cy="48" r="44" fill="none" stroke="#EAEBEC" strokeWidth="4" />
                                            <circle
                                                cx="48" cy="48" r="44" fill="none"
                                                stroke={card.match >= 80 ? "#FF6B52" : "#1C1C1E"}
                                                strokeWidth="4"
                                                strokeDasharray="276"
                                                strokeDashoffset={276 - (276 * card.match) / 100}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            {/* Dashed outer indicator like in UI */}
                                            <circle cx="48" cy="48" r="50" fill="none" stroke="#1C1C1E" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 4" />
                                        </svg>
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-semibold tracking-tight">{card.match}%</span>
                                            <span className="text-[9px] font-medium text-[#1C1C1E]/40 mt-0.5">{card.status || "Strong Match"}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5 flex-1">
                                        {card.traits.map(trait => (
                                            <div key={trait} className="flex items-center gap-2 text-[11px] font-medium text-[#1C1C1E]/80">
                                                <Check size={10} className="text-[#1C1C1E]/40" />
                                                {trait}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </section>

            </main>
        </div>
    );
}
