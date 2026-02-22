import React, { useState } from 'react';
import { Search, Filter, Clock, MapPin, Zap, ArrowRight, Share2, Bookmark, X, Users, DollarSign, Code, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';
import { ProctoringModal } from '../components/ProctoringModal';

interface Challenge {
    id: string;
    title: string;
    company: string;
    companyAbout: string;
    role: string;
    type: string;
    prize: string;
    match: number;
    fast: boolean;
    description: string;
    skills: string[];
    deadline: string;
    participants: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const challenges: Challenge[] = [
    {
        id: 'ch-1',
        title: 'High-Freq Crypto Exchange',
        company: 'Binance',
        companyAbout: 'The world\'s largest cryptocurrency exchange by trading volume, serving 150M+ users across 180 countries with cutting-edge blockchain infrastructure.',
        role: 'Senior Backend Engineer',
        type: 'Backend',
        prize: '$5,000',
        match: 98,
        fast: true,
        description: 'Build a high-performance order matching engine capable of processing 100k+ transactions per second. Focus on low-latency architecture, WebSocket streaming, and fault tolerance.',
        skills: ['Node.js', 'Redis', 'WebSocket', 'TypeScript', 'Docker'],
        deadline: '4 days left',
        participants: 84,
        difficulty: 'Hard',
    },
    {
        id: 'ch-2',
        title: 'Design System Overhaul',
        company: 'Figma',
        companyAbout: 'The collaborative interface design tool used by teams at Google, Microsoft, and Airbnb to design, prototype, and ship products faster.',
        role: 'Design Systems Lead',
        type: 'Design',
        prize: '$3,000',
        match: 91,
        fast: false,
        description: 'Redesign and document a comprehensive design system with tokens, components, and patterns. Include accessibility guidelines and dark mode support.',
        skills: ['Figma', 'Design Systems', 'CSS', 'Accessibility'],
        deadline: '12 days left',
        participants: 156,
        difficulty: 'Medium',
    },
    {
        id: 'ch-3',
        title: 'Web3 Wallet Extension',
        company: 'MetaMask',
        companyAbout: 'The leading self-custodial crypto wallet with 30M+ monthly active users, enabling secure access to blockchain apps and DeFi protocols.',
        role: 'Fullstack Web3 Engineer',
        type: 'Fullstack',
        prize: '$4,500',
        match: 86,
        fast: true,
        description: 'Create a browser extension wallet supporting multiple chains. Implement secure key management, transaction signing, and dApp connectivity.',
        skills: ['React', 'Ethers.js', 'Chrome Extensions', 'Solidity'],
        deadline: '7 days left',
        participants: 62,
        difficulty: 'Hard',
    },
    {
        id: 'ch-4',
        title: 'AI Search Optimizer',
        company: 'Perplexity',
        companyAbout: 'An AI-native search engine combining large language models with real-time web data to deliver accurate, cited answers instantly.',
        role: 'ML Engineer – Search',
        type: 'AI/ML',
        prize: '$6,000',
        match: 94,
        fast: true,
        description: 'Build a retrieval-augmented generation pipeline that improves search relevance by 40%+. Focus on embedding quality, reranking, and streaming responses.',
        skills: ['Python', 'LangChain', 'Vector DB', 'OpenAI', 'FastAPI'],
        deadline: '5 days left',
        participants: 203,
        difficulty: 'Hard',
    },
    {
        id: 'ch-5',
        title: 'Real-time Analytics Dashboard',
        company: 'Vercel',
        companyAbout: 'The platform for frontend developers, providing tools to build, deploy, and scale modern web applications with zero configuration.',
        role: 'Frontend Engineer',
        type: 'Frontend',
        prize: '$3,500',
        match: 89,
        fast: false,
        description: 'Build a real-time analytics dashboard with live-updating charts, filterable metrics, and sub-second data refresh using Server-Sent Events.',
        skills: ['React', 'D3.js', 'TypeScript', 'SSE', 'Tailwind'],
        deadline: '10 days left',
        participants: 118,
        difficulty: 'Medium',
    },
    {
        id: 'ch-6',
        title: 'Mobile Payment SDK',
        company: 'Stripe',
        companyAbout: 'Financial infrastructure for the internet, powering payments for millions of businesses from startups to Fortune 500 companies worldwide.',
        role: 'Mobile SDK Engineer',
        type: 'Mobile',
        prize: '$5,500',
        match: 82,
        fast: false,
        description: 'Create a cross-platform mobile payment SDK with support for cards, Apple Pay, and Google Pay. Include 3DS authentication and PCI compliance.',
        skills: ['React Native', 'Swift', 'Kotlin', 'Payments'],
        deadline: '14 days left',
        participants: 91,
        difficulty: 'Hard',
    },
];

const difficultyColor: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700',
};

export function ChallengeDiscovery() {
    const navigate = useNavigate();
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [proctoringChallenge, setProctoringChallenge] = useState<Challenge | null>(null);

    // Filter state
    const [filterType, setFilterType] = useState<string[]>([]);
    const [filterExperience, setFilterExperience] = useState<string[]>([]);
    const [filterWorkMode, setFilterWorkMode] = useState<string[]>([]);
    const [filterDifficulty, setFilterDifficulty] = useState<string[]>([]);
    const [filterSkills, setFilterSkills] = useState<string[]>([]);
    const [filterAvailability, setFilterAvailability] = useState<string[]>([]);
    const [salaryMin, setSalaryMin] = useState(0);
    const [salaryMax, setSalaryMax] = useState(300);

    // Typeahead state
    const [typeQuery, setTypeQuery] = useState('');
    const [skillQuery, setSkillQuery] = useState('');
    const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

    const allJobTypes = ['Backend', 'Frontend', 'Fullstack', 'Design', 'AI/ML', 'Mobile', 'DevOps', 'Data', 'QA', 'Security', 'Product', 'Cloud'];
    const allSkills = ['React', 'TypeScript', 'Python', 'Node.js', 'Docker', 'Figma', 'Swift', 'Kotlin', 'Solidity', 'AWS', 'Go', 'Rust', 'GraphQL', 'PostgreSQL', 'Redis', 'Kubernetes', 'TensorFlow', 'Vue.js', 'Angular', 'Java', 'C++', 'Ruby'];

    const filteredTypes = allJobTypes.filter(t => !filterType.includes(t) && t.toLowerCase().includes(typeQuery.toLowerCase()));
    const filteredSkills = allSkills.filter(s => !filterSkills.includes(s) && s.toLowerCase().includes(skillQuery.toLowerCase()));

    const toggleChip = (value: string, arr: string[], setter: (v: string[]) => void) => {
        setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
    };

    const activeFilterCount = filterType.length + filterExperience.length + filterWorkMode.length + filterDifficulty.length + filterSkills.length + filterAvailability.length + (salaryMin > 0 || salaryMax < 300 ? 1 : 0);

    const resetFilters = () => {
        setFilterType([]); setFilterExperience([]); setFilterWorkMode([]);
        setFilterDifficulty([]); setFilterSkills([]); setFilterAvailability([]);
        setSalaryMin(0); setSalaryMax(300);
        setTypeQuery(''); setSkillQuery('');
    };

    const chipClass = (active: boolean) =>
        `px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${active
            ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
            : 'bg-white/60 text-[#1C1C1E]/60 border-black/5 hover:border-black/20'}`;

    const formatSalary = (v: number) => v >= 300 ? '$300k+' : `$${v}k`;

    return (
        <ErrorBoundary>
            <Layout>
                <div className="flex-1 flex flex-col pb-20 relative">
                    {/* Header */}
                    <header className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Challenges</h1>
                            <p className="text-[#1C1C1E]/40 text-sm font-medium">Compete in real-world tasks from top companies.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/60 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 border border-white shadow-sm">
                                <Search size={16} className="text-[#1C1C1E]/30" />
                                <input type="text" placeholder="Search challenges..." className="bg-transparent border-none outline-none text-sm font-medium w-48 placeholder-[#1C1C1E]/30" />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`relative p-3 rounded-full shadow-lg transition-colors ${showFilters ? 'bg-proof-accent text-white' : 'bg-[#1C1C1E] text-white hover:bg-[#1C1C1E]/80'}`}
                            >
                                <Filter size={18} />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-proof-accent border-2 border-[#F8F9FB] rounded-full text-[9px] font-black text-white flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Filter Dropdown */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden mb-8"
                            >
                                <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass">
                                    <div className="grid grid-cols-2 gap-x-10 gap-y-5">

                                        {/* Job Type — Typeahead */}
                                        <div className="relative">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Job Type</p>
                                            {filterType.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {filterType.map(t => (
                                                        <span key={t} className="flex items-center gap-1 bg-[#1C1C1E] text-white pl-3 pr-1.5 py-1 rounded-full text-xs font-bold">
                                                            {t}
                                                            <button onClick={() => setFilterType(prev => prev.filter(x => x !== t))} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                                                                <X size={8} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                value={typeQuery}
                                                onChange={e => { setTypeQuery(e.target.value); setShowTypeSuggestions(true); }}
                                                onFocus={() => setShowTypeSuggestions(true)}
                                                placeholder="Type to search roles..."
                                                className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-medium placeholder-[#1C1C1E]/30 focus:outline-none focus:ring-2 focus:ring-[#1C1C1E]/10"
                                            />
                                            {showTypeSuggestions && filteredTypes.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/5 shadow-lg max-h-40 overflow-y-auto z-50">
                                                    {filteredTypes.map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => { setFilterType(prev => [...prev, t]); setTypeQuery(''); setShowTypeSuggestions(false); }}
                                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#1C1C1E]/70 hover:bg-[#F8F9FB] transition-colors"
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Experience Level */}
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Experience Level</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Intern', 'Junior', 'Mid-Level', 'Senior', 'Staff', 'Lead'].map(t => (
                                                    <span key={t} onClick={() => toggleChip(t, filterExperience, setFilterExperience)} className={chipClass(filterExperience.includes(t))}>{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Skills — Typeahead */}
                                        <div className="relative">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Skills</p>
                                            {filterSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {filterSkills.map(s => (
                                                        <span key={s} className="flex items-center gap-1 bg-[#1C1C1E] text-white pl-3 pr-1.5 py-1 rounded-full text-xs font-bold">
                                                            {s}
                                                            <button onClick={() => setFilterSkills(prev => prev.filter(x => x !== s))} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                                                                <X size={8} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                value={skillQuery}
                                                onChange={e => { setSkillQuery(e.target.value); setShowSkillSuggestions(true); }}
                                                onFocus={() => setShowSkillSuggestions(true)}
                                                placeholder="Type to search skills..."
                                                className="w-full bg-[#F8F9FB] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-medium placeholder-[#1C1C1E]/30 focus:outline-none focus:ring-2 focus:ring-[#1C1C1E]/10"
                                            />
                                            {showSkillSuggestions && filteredSkills.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/5 shadow-lg max-h-40 overflow-y-auto z-50">
                                                    {filteredSkills.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => { setFilterSkills(prev => [...prev, s]); setSkillQuery(''); setShowSkillSuggestions(false); }}
                                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#1C1C1E]/70 hover:bg-[#F8F9FB] transition-colors"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Work Mode */}
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Work Mode</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Remote', 'Hybrid', 'On-site', 'Flexible'].map(t => (
                                                    <span key={t} onClick={() => toggleChip(t, filterWorkMode, setFilterWorkMode)} className={chipClass(filterWorkMode.includes(t))}>{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Difficulty */}
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Difficulty</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Easy', 'Medium', 'Hard'].map(t => (
                                                    <span key={t} onClick={() => toggleChip(t, filterDifficulty, setFilterDifficulty)} className={chipClass(filterDifficulty.includes(t))}>{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Availability */}
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Availability</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Full-Time', 'Part-Time', 'Contract', 'Freelance'].map(t => (
                                                    <span key={t} onClick={() => toggleChip(t, filterAvailability, setFilterAvailability)} className={chipClass(filterAvailability.includes(t))}>{t}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Salary Range Slider */}
                                        <div className="col-span-2">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-2.5">Salary Range</p>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-[#1C1C1E]/60 w-16">{formatSalary(salaryMin)}</span>
                                                <div className="flex-1 relative h-10 flex items-center">
                                                    {/* Track background */}
                                                    <div className="absolute left-0 right-0 h-1.5 bg-[#F8F9FB] rounded-full border border-black/5" />
                                                    {/* Active range */}
                                                    <div
                                                        className="absolute h-1.5 bg-[#1C1C1E] rounded-full"
                                                        style={{ left: `${(salaryMin / 300) * 100}%`, right: `${100 - (salaryMax / 300) * 100}%` }}
                                                    />
                                                    {/* Min thumb */}
                                                    <input
                                                        type="range"
                                                        min={0} max={300} step={10}
                                                        value={salaryMin}
                                                        onChange={e => setSalaryMin(Math.min(Number(e.target.value), salaryMax - 10))}
                                                        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1C1C1E] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                        style={{ zIndex: salaryMin > 280 ? 5 : 3 }}
                                                    />
                                                    {/* Max thumb */}
                                                    <input
                                                        type="range"
                                                        min={0} max={300} step={10}
                                                        value={salaryMax}
                                                        onChange={e => setSalaryMax(Math.max(Number(e.target.value), salaryMin + 10))}
                                                        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1C1C1E] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                        style={{ zIndex: 4 }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-[#1C1C1E]/60 w-16 text-right">{formatSalary(salaryMax)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-black/5">
                                        <p className="text-xs text-[#1C1C1E]/30 font-medium">
                                            {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active` : 'No filters applied'}
                                        </p>
                                        <div className="flex gap-2">
                                            <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#1C1C1E]/50 hover:text-[#1C1C1E] hover:bg-black/5 transition-colors">
                                                Reset All
                                            </button>
                                            <button onClick={() => setShowFilters(false)} className="bg-[#1C1C1E] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C1C1E]/80 transition-colors">
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {challenges.map((challenge, i) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => setSelectedChallenge(challenge)}
                                className={`group bg-white/60 backdrop-blur-2xl rounded-2xl p-6 border border-white shadow-glass hover:shadow-xl hover:bg-white transition-all cursor-pointer relative overflow-hidden aspect-square flex flex-col ${selectedChallenge?.id === challenge.id ? 'ring-2 ring-[#1C1C1E]' : ''}`}
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-black/5 flex items-center justify-center font-bold text-lg">
                                        {challenge.company[0]}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {challenge.fast && (
                                            <span className="bg-proof-accent/10 text-proof-accent px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Zap size={9} fill="currentColor" /> Rapid
                                            </span>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${difficultyColor[challenge.difficulty]}`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col">
                                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-proof-accent mb-1">{challenge.type}</p>
                                    <h3 className="text-base font-bold tracking-tight leading-snug mb-1.5">{challenge.title}</h3>
                                    <p className="text-xs text-[#1C1C1E]/40 font-medium mb-0.5">{challenge.company} · {challenge.role}</p>

                                    {/* Short description */}
                                    <p className="text-xs text-[#1C1C1E]/50 leading-relaxed font-medium line-clamp-2 mt-2 mb-3">
                                        {challenge.description}
                                    </p>

                                    {/* About company snippet */}
                                    <div className="bg-[#F8F9FB] rounded-xl p-3 mb-3 border border-black/5">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-1">About {challenge.company}</p>
                                        <p className="text-[11px] text-[#1C1C1E]/40 leading-relaxed font-medium line-clamp-2">{challenge.companyAbout}</p>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {challenge.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="bg-[#F8F9FB] border border-black/5 px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#1C1C1E]/50">
                                                {skill}
                                            </span>
                                        ))}
                                        {challenge.skills.length > 3 && (
                                            <span className="bg-[#F8F9FB] border border-black/5 px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#1C1C1E]/30">
                                                +{challenge.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-3 text-[10px] text-[#1C1C1E]/30 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {challenge.deadline}</span>
                                        <span className="flex items-center gap-1"><Users size={10} /> {challenge.participants}</span>
                                    </div>
                                </div>

                                {/* Bottom */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                                            {challenge.match}% match
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setProctoringChallenge(challenge);
                                        }}
                                        className="bg-[#1C1C1E] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C1C1E]/80 transition-colors flex items-center gap-1.5"
                                    >
                                        Start <ArrowRight size={14} />
                                    </button>
                                </div>

                                {/* Hover decoration */}
                                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-[#F8F9FB] rounded-full opacity-0 group-hover:opacity-30 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SLIDE-IN DETAIL PANEL */}
                <AnimatePresence>
                    {selectedChallenge && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedChallenge(null)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            />

                            {/* Panel */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed top-0 right-0 w-1/2 h-full bg-[#F8F9FB] z-50 shadow-2xl overflow-y-auto"
                            >
                                <div className="p-10">
                                    {/* Close */}
                                    <div className="flex items-center justify-between mb-8">
                                        <button
                                            onClick={() => setSelectedChallenge(null)}
                                            className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                                        >
                                            <X className="w-5 h-5 text-[#1C1C1E]/50" />
                                        </button>
                                        <div className="flex gap-2">
                                            <button className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                                                <Share2 className="w-4 h-4 text-[#1C1C1E]/50" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                                                <Bookmark className="w-4 h-4 text-[#1C1C1E]/50" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Company & Type */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 flex items-center justify-center font-bold text-2xl shadow-sm">
                                            {selectedChallenge.company[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold tracking-[0.2em] uppercase text-proof-accent">{selectedChallenge.type}</p>
                                            <p className="text-sm text-[#1C1C1E]/40 font-medium">{selectedChallenge.company}</p>
                                        </div>
                                        <div className="ml-auto flex gap-2">
                                            {selectedChallenge.fast && (
                                                <span className="bg-proof-accent/10 text-proof-accent px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                                                    <Zap size={12} fill="currentColor" /> Rapid Hire
                                                </span>
                                            )}
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${difficultyColor[selectedChallenge.difficulty]}`}>
                                                {selectedChallenge.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-3xl font-bold tracking-tight mb-4">{selectedChallenge.title}</h1>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-4 text-sm text-[#1C1C1E]/40 font-medium mb-8">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> Remote</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedChallenge.deadline}</span>
                                        <span className="flex items-center gap-1.5"><Users size={14} /> {selectedChallenge.participants} participants</span>
                                    </div>

                                    {/* Stats cards */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-5 shadow-glass">
                                            <Users className="w-5 h-5 text-[#1C1C1E]/30 mb-2" />
                                            <p className="text-2xl font-bold">{selectedChallenge.participants}</p>
                                            <p className="text-xs text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">Participants</p>
                                        </div>
                                        <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-5 shadow-glass">
                                            <Zap className="w-5 h-5 text-[#1C1C1E]/30 mb-2" />
                                            <p className="text-2xl font-bold text-green-600">{selectedChallenge.match}%</p>
                                            <p className="text-xs text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">Match Score</p>
                                        </div>
                                        <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-5 shadow-glass">
                                            <Calendar className="w-5 h-5 text-[#1C1C1E]/30 mb-2" />
                                            <p className="text-2xl font-bold">{selectedChallenge.deadline.replace(' left', '')}</p>
                                            <p className="text-xs text-[#1C1C1E]/30 font-bold uppercase tracking-widest mt-1">Remaining</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass mb-6">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-3">Challenge Brief</h3>
                                        <p className="text-[#1C1C1E]/70 text-sm leading-relaxed font-medium">{selectedChallenge.description}</p>
                                    </div>

                                    {/* Role */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass mb-6">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-3">Role You're Applying For</h3>
                                        <p className="text-base font-bold text-[#1C1C1E] mb-1">{selectedChallenge.role}</p>
                                        <p className="text-sm text-[#1C1C1E]/50 font-medium">at {selectedChallenge.company} · Remote · {selectedChallenge.type}</p>
                                    </div>

                                    {/* About Company */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass mb-6">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-3">About {selectedChallenge.company}</h3>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] border border-black/5 flex items-center justify-center font-bold text-sm shrink-0">
                                                {selectedChallenge.company[0]}
                                            </div>
                                            <p className="text-[#1C1C1E]/70 text-sm leading-relaxed font-medium">{selectedChallenge.companyAbout}</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass mb-6">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-3">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedChallenge.skills.map(skill => (
                                                <span key={skill} className="flex items-center gap-1.5 bg-[#F8F9FB] border border-black/5 px-3.5 py-2 rounded-xl text-sm font-medium text-[#1C1C1E]/70">
                                                    <Code size={12} className="text-[#1C1C1E]/30" />{skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* What you'll deliver */}
                                    <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-2xl p-6 shadow-glass mb-10">
                                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#1C1C1E]/30 mb-3">What You'll Deliver</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm text-[#1C1C1E]/70 font-medium">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                Working prototype or deployed solution
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-[#1C1C1E]/70 font-medium">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                90-second video walkthrough of your approach
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-[#1C1C1E]/70 font-medium">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                Source code with documentation
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setProctoringChallenge(selectedChallenge); setSelectedChallenge(null); }}
                                            className="flex-1 bg-[#1C1C1E] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1C1C1E]/80 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Start Challenge <ArrowRight className="w-5 h-5" />
                                        </button>
                                        <button className="w-14 h-14 rounded-2xl bg-white/60 border border-white flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                                            <ExternalLink className="w-5 h-5 text-[#1C1C1E]/40" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Proctoring Modal */}
                <ProctoringModal
                    isOpen={!!proctoringChallenge}
                    onClose={() => setProctoringChallenge(null)}
                    onStart={() => {
                        if (proctoringChallenge) {
                            navigate(`/challenge/${proctoringChallenge.id}`);
                            setProctoringChallenge(null);
                        }
                    }}
                    challengeTitle={proctoringChallenge?.title || ''}
                />
            </Layout>
        </ErrorBoundary>
    );
}
