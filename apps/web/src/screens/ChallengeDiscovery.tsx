import React from 'react';
import { Search, Mail, Briefcase, Inbox, Users, Filter, Clock, MapPin, Zap, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SubmissionFlow } from '../components/SubmissionFlow';

export function ChallengeDiscovery() {
    const [selectedChallenge, setSelectedChallenge] = React.useState<string | null>(null);
    const challenges = [
        { title: "High-Freq Crypto Exchange", company: "Binance", type: "Backend", prize: "$5k", match: 98, fast: true },
        { title: "Design System Overhaul", company: "Figma", type: "Design", prize: "$3k", match: 91, fast: false },
        { title: "Web3 Wallet Extension", company: "MetaMask", type: "Fullstack", prize: "$4.5k", match: 86, fast: true },
        { title: "AI Search Optimizer", company: "Perplexity", type: "AI/ML", prize: "$6k", match: 94, fast: true },
    ];

    return (
        <ErrorBoundary>
            <div className="w-full min-h-screen flex text-[#1C1C1E] bg-[#E4E5E7]">

                {/* SIDEBAR */}
                <aside className="w-24 fixed h-full flex flex-col items-center py-8 z-20">
                    <div className="mb-16">
                        <div className="w-12 h-12 rounded-full bg-[#FF6B52] flex items-center justify-center text-white font-bold text-xl">P</div>
                    </div>
                    <nav className="flex flex-col gap-8">
                        {[Search, Mail, Briefcase, Inbox, Users].map((Icon, i) => (
                            <button key={i} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${i === 2 ? 'text-[#FF6B52] bg-white' : 'text-[#1C1C1E]/30 hover:text-[#1C1C1E]'}`}>
                                <Icon size={20} />
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 ml-24 pl-8 pr-12 pt-8">
                    <header className="flex items-center justify-between mb-16">
                        <div>
                            <h1 className="text-4xl font-medium tracking-tight mb-2">Challenge Feed</h1>
                            <p className="text-[#1C1C1E]/40 text-sm">Competitive challenges that replace the standard job interview.</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white px-5 py-3 rounded-full flex items-center gap-3 shadow-soft">
                                <Search size={18} className="text-[#1C1C1E]/30" />
                                <input type="text" placeholder="Search roles, skills..." className="bg-transparent border-none outline-none text-sm font-medium w-48" />
                            </div>
                            <button className="bg-[#1C1C1E] text-white p-3 rounded-full shadow-lg">
                                <Filter size={20} />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                        {challenges.map((challenge, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white/50 backdrop-blur-md rounded-[3rem] p-8 border border-white shadow-soft hover:shadow-glass hover:bg-white transition-all cursor-pointer relative overflow-hidden"
                            >
                                {challenge.fast && (
                                    <div className="absolute top-8 right-8 bg-[#FF6B52]/10 text-[#FF6B52] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Zap size={10} fill="currentColor" /> Rapid Hire
                                    </div>
                                )}

                                <div className="flex items-start gap-6 mb-10">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#E4E5E7] flex items-center justify-center font-bold text-xl shadow-inner uppercase">
                                        {challenge.company[0]}
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#FF6B52] uppercase tracking-[0.2em]">{challenge.type}</span>
                                        <h2 className="text-2xl font-semibold mt-1">{challenge.title}</h2>
                                        <div className="flex items-center gap-4 mt-2 text-[#1C1C1E]/40 text-sm font-medium">
                                            <span className="flex items-center gap-1"><Briefcase size={14} /> {challenge.company}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> Remote</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> 4 days left</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">Prize Pool</span>
                                            <span className="text-xl font-bold">{challenge.prize}</span>
                                        </div>
                                        <div className="h-8 w-px bg-[#1C1C1E]/10" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#1C1C1E]/30 uppercase tracking-widest">Match Score</span>
                                            <span className="text-xl font-bold flex items-center gap-1">
                                                {challenge.match}%
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="p-3 bg-[#E4E5E7]/50 rounded-full text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"><Share2 size={18} /></button>
                                        <button className="p-3 bg-[#E4E5E7]/50 rounded-full text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors"><Bookmark size={18} /></button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedChallenge(challenge.title); }}
                                            className="bg-[#1C1C1E] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:translate-x-1 transition-all flex items-center gap-2"
                                        >
                                            Apply Now <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* BACKGROUND DECOR */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E4E5E7] rounded-full opacity-20 group-hover:scale-150 transition-transform" />
                            </motion.div>
                        ))}
                    </div>

                    <SubmissionFlow
                        isOpen={!!selectedChallenge}
                        challengeTitle={selectedChallenge || ''}
                        onClose={() => setSelectedChallenge(null)}
                    />

                </main>
            </div>
        </ErrorBoundary>
    );
}
