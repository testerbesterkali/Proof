import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPin, Zap, ArrowRight, Share2, Bookmark, X, Users, DollarSign, Code, CheckCircle, ExternalLink, Calendar, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';
import { ProctoringModal } from '../components/ProctoringModal';
import { supabase } from '../lib/supabase';

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

const difficultyColor: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700',
};

function getDifficulty(timeLimitMins: number | null): 'Easy' | 'Medium' | 'Hard' {
    if (!timeLimitMins || timeLimitMins <= 30) return 'Easy';
    if (timeLimitMins <= 90) return 'Medium';
    return 'Hard';
}

function getDeadline(createdAt: string): string {
    const created = new Date(createdAt);
    const deadline = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days after creation
    const now = new Date();
    const diffDays = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    if (diffDays === 0) return 'Closing today';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
}

export function ChallengeDiscovery() {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [proctoringChallenge, setProctoringChallenge] = useState<Challenge | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [challengeTab, setChallengeTab] = useState<'active' | 'completed'>('active');
    const [selectedCompleted, setSelectedCompleted] = useState<any | null>(null);

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        setLoading(true);
        try {
            const { data: rawChallenges } = await supabase
                .from('Challenge')
                .select('*')
                .eq('status', 'ACTIVE')
                .eq('isPublic', true)
                .order('createdAt', { ascending: false });

            if (!rawChallenges || rawChallenges.length === 0) {
                setChallenges([]);
                return;
            }

            // Fetch employer names
            const employerIds = [...new Set(rawChallenges.map(c => c.employerId))];
            const { data: employers } = await supabase
                .from('EmployerProfile')
                .select('id, companyName, industry, about')
                .in('id', employerIds);

            const empMap = new Map(employers?.map(e => [e.id, e]) || []);

            // Count submissions per challenge
            const challengeIds = rawChallenges.map(c => c.id);
            const { data: submissions } = await supabase
                .from('Submission')
                .select('challengeId')
                .in('challengeId', challengeIds);

            const subCounts = new Map<string, number>();
            submissions?.forEach(s => {
                subCounts.set(s.challengeId, (subCounts.get(s.challengeId) || 0) + 1);
            });

            const formatted: Challenge[] = rawChallenges.map(c => {
                const emp = empMap.get(c.employerId);
                return {
                    id: c.id,
                    title: c.title,
                    company: emp?.companyName || 'Unknown Company',
                    companyAbout: emp?.about || (emp?.industry ? `A company in the ${emp.industry} industry.` : 'An innovative company hiring through Proof.'),
                    role: c.jobRole || c.type || 'Engineer',
                    type: c.type || 'Code',
                    prize: c.prizeAmount > 0 ? `$${c.prizeAmount.toLocaleString()}` : 'Experience',
                    match: 85 + (c.id.charCodeAt(0) + c.id.charCodeAt(1)) % 15,
                    fast: (c.timeLimitMins || 0) <= 60,
                    description: c.description,
                    skills: c.requiredSkills || [],
                    deadline: getDeadline(c.createdAt),
                    participants: subCounts.get(c.id) || 0,
                    difficulty: getDifficulty(c.timeLimitMins),
                };
            });

            // Fetch completed challenges (user's submissions)
            let completedChallengeIds = new Set<string>();
            try {
                const { data: profiles } = await supabase
                    .from('CandidateProfile')
                    .select('id')
                    .eq('userId', (await supabase.auth.getUser()).data.user?.id || '');
                const candidateId = profiles?.[0]?.id;
                if (candidateId) {
                    const { data: submissions } = await supabase
                        .from('Submission')
                        .select('*')
                        .eq('candidateId', candidateId)
                        .order('createdAt', { ascending: false });

                    if (submissions && submissions.length > 0) {
                        completedChallengeIds = new Set(submissions.map(s => s.challengeId));
                        const subChallengeIds = [...completedChallengeIds];
                        const { data: subChallenges } = await supabase
                            .from('Challenge')
                            .select('*')
                            .in('id', subChallengeIds);

                        const chalMap = new Map(subChallenges?.map(c => [c.id, c]) || []);

                        const completed = submissions.map(sub => {
                            const ch = chalMap.get(sub.challengeId);
                            const emp = empMap.get(ch?.employerId || '');
                            return {
                                id: sub.id,
                                challengeId: sub.challengeId,
                                title: ch?.title || 'Challenge',
                                company: emp?.companyName || 'Company',
                                description: ch?.description || '',
                                score: sub.score || null,
                                status: sub.status,
                                submittedAt: sub.createdAt,
                                skills: ch?.requiredSkills || [],
                                difficulty: getDifficulty(ch?.timeLimitMins),
                                language: sub.content?.language || 'javascript',
                            };
                        });
                        setCompletedChallenges(completed);
                    }
                }
            } catch (compErr) {
                console.error('Failed to load completed:', compErr);
            }

            // Filter out completed challenges from active list
            setChallenges(formatted.filter(c => !completedChallengeIds.has(c.id)));
        } catch (err) {
            console.error('Failed to load challenges:', err);
        } finally {
            setLoading(false);
        }
    };

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
                                <input type="text" placeholder="Search challenges..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm font-medium w-48 placeholder-[#1C1C1E]/30" />
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

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-black/5 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setChallengeTab('active')}
                            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${challengeTab === 'active' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E]/60'}`}
                        >
                            Active Challenges
                        </button>
                        <button
                            onClick={() => setChallengeTab('completed')}
                            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${challengeTab === 'completed' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#1C1C1E]/40 hover:text-[#1C1C1E]/60'}`}
                        >
                            <Trophy size={12} />
                            Completed
                            {completedChallenges.length > 0 && (
                                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md text-[9px] font-black">{completedChallenges.length}</span>
                            )}
                        </button>
                    </div>

                    {challengeTab === 'active' ? (
                        <>
                            {/* Grid */}
                            {loading ? (
                                <div className="flex items-center justify-center py-24">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#1C1C1E]/20" />
                                </div>
                            ) : challenges.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-[#1C1C1E]/40">
                                    <Code className="w-16 h-16 mb-4 opacity-20" />
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">No Challenges Yet</h2>
                                    <p className="text-sm font-medium">Check back soon — employers are creating new challenges.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {challenges.filter(c => {
                                        const q = searchQuery.toLowerCase();
                                        if (q && !c.title.toLowerCase().includes(q) && !c.company.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q)) return false;
                                        if (filterType.length > 0 && !filterType.some(ft => c.type.toLowerCase().includes(ft.toLowerCase()))) return false;
                                        if (filterDifficulty.length > 0 && !filterDifficulty.includes(c.difficulty)) return false;
                                        if (filterSkills.length > 0 && !filterSkills.some(fs => c.skills.some(sk => sk.toLowerCase().includes(fs.toLowerCase())))) return false;
                                        return true;
                                    }).map((challenge, i) => (
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
                                                <p className="text-xs text-[#1C1C1E]/50 leading-relaxed font-medium line-clamp-3 mt-2 mb-3 whitespace-pre-line">
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
                            )}
                        </>
                    ) : (
                        /* Completed Challenges Tab */
                        completedChallenges.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-[#1C1C1E]/40">
                                <Trophy className="w-16 h-16 mb-4 opacity-20" />
                                <h2 className="text-2xl font-bold tracking-tight mb-2">No Completed Challenges</h2>
                                <p className="text-sm font-medium">Complete challenges to see them here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {completedChallenges.map((c, i) => (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => setSelectedCompleted(c)}
                                        className={`group bg-white/60 backdrop-blur-2xl rounded-2xl p-6 border border-white shadow-glass hover:shadow-xl hover:bg-white transition-all cursor-pointer relative overflow-hidden ${selectedCompleted?.id === c.id ? 'ring-2 ring-[#1C1C1E]' : ''}`}
                                    >
                                        {/* Completed badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle size={10} /> Completed
                                            </span>
                                        </div>

                                        <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-black/5 flex items-center justify-center font-bold text-lg mb-4">
                                            {c.company[0]}
                                        </div>

                                        <h3 className="text-base font-bold tracking-tight leading-snug mb-1">{c.title}</h3>
                                        <p className="text-xs text-[#1C1C1E]/40 font-medium mb-4">{c.company}</p>

                                        {/* Score */}
                                        {c.score?.overall != null && (
                                            <div className="bg-[#F8F9FB] rounded-xl p-4 mb-4 border border-black/5 text-center">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-1">AI Score</p>
                                                <p className={`text-3xl font-black ${c.score.overall >= 80 ? 'text-green-600' : c.score.overall >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {c.score.overall}
                                                </p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {c.skills.slice(0, 3).map((skill: string) => (
                                                <span key={skill} className="bg-[#F8F9FB] border border-black/5 px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#1C1C1E]/50">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Status & date */}
                                        <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${['UNDER_REVIEW', 'SUBMITTED', 'REVIEWED'].includes(c.status) ? 'bg-blue-50 text-blue-600' :
                                                c.status === 'SHORTLISTED' ? 'bg-purple-50 text-purple-600' :
                                                    c.status === 'INTERVIEW' ? 'bg-cyan-50 text-cyan-600' :
                                                        c.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                                                            c.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                                                'bg-gray-50 text-gray-600'
                                                }`}>
                                                {['UNDER_REVIEW', 'SUBMITTED', 'REVIEWED'].includes(c.status) ? 'Under Review' :
                                                    c.status === 'SHORTLISTED' ? 'Shortlisted' :
                                                        c.status === 'INTERVIEW' ? 'Interview' :
                                                            c.status === 'ACCEPTED' ? 'Accepted' :
                                                                c.status === 'REJECTED' ? 'Rejected' : c.status}
                                            </span>
                                            <span className="text-[10px] text-[#1C1C1E]/30 font-medium">
                                                {new Date(c.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* COMPLETED CHALLENGE DETAIL PANEL */}
                <AnimatePresence>
                    {selectedCompleted && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedCompleted(null)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
                            >
                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-proof-accent mb-1">Completed Challenge</p>
                                            <h2 className="text-2xl font-bold tracking-tight">{selectedCompleted.title}</h2>
                                            <p className="text-sm text-[#1C1C1E]/40 font-medium mt-1">{selectedCompleted.company} · {selectedCompleted.language}</p>
                                        </div>
                                        <button onClick={() => setSelectedCompleted(null)} className="p-2 rounded-xl hover:bg-black/5 text-[#1C1C1E]/30 hover:text-[#1C1C1E]">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Overall Score */}
                                    {selectedCompleted.score?.overall != null && (
                                        <div className="bg-gradient-to-br from-[#F8F9FB] to-white rounded-2xl p-8 border border-black/5 text-center mb-8">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]/25 mb-3">Overall AI Score</p>
                                            <p className={`text-6xl font-black ${selectedCompleted.score.overall >= 80 ? 'text-green-600' : selectedCompleted.score.overall >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {selectedCompleted.score.overall}
                                                <span className="text-xl text-[#1C1C1E]/20 font-bold">/100</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Score Breakdown */}
                                    {selectedCompleted.score && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold tracking-tight mb-4">Score Breakdown</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Correctness', key: 'correctness', icon: '✓' },
                                                    { label: 'Completeness', key: 'completeness', icon: '📋' },
                                                    { label: 'Code Quality', key: 'codeQuality', icon: '💎' },
                                                    { label: 'Efficiency', key: 'efficiency', icon: '⚡' },
                                                    { label: 'Best Practices', key: 'bestPractices', icon: '🛡️' },
                                                ].map(({ label, key, icon }) => {
                                                    const val = selectedCompleted.score?.[key];
                                                    if (val == null) return null;
                                                    return (
                                                        <div key={key} className="flex items-center gap-3">
                                                            <span className="text-sm w-6 text-center">{icon}</span>
                                                            <span className="text-xs font-bold text-[#1C1C1E]/60 w-28">{label}</span>
                                                            <div className="flex-1 h-2.5 bg-[#F8F9FB] rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${val}%` }}
                                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                                    className={`h-full rounded-full ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-black w-10 text-right ${val >= 80 ? 'text-green-600' : val >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                {val}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary */}
                                    {selectedCompleted.score?.summary && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold tracking-tight mb-3">AI Summary</h3>
                                            <p className="text-sm text-[#1C1C1E]/60 leading-relaxed bg-[#F8F9FB] rounded-xl p-5 border border-black/5">
                                                {selectedCompleted.score.summary}
                                            </p>
                                        </div>
                                    )}

                                    {/* Strengths */}
                                    {selectedCompleted.score?.strengths && selectedCompleted.score.strengths.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
                                                <span className="text-green-500">✦</span> Strengths
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedCompleted.score.strengths.map((s: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                                                        <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                        <p className="text-xs text-green-800 leading-relaxed font-medium">{s}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Areas for Improvement */}
                                    {selectedCompleted.score?.improvements && selectedCompleted.score.improvements.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold tracking-tight mb-3 flex items-center gap-2">
                                                <span className="text-amber-500">▲</span> Areas for Improvement
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedCompleted.score.improvements.map((s: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                                                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                        <p className="text-xs text-amber-800 leading-relaxed font-medium">{s}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-bold tracking-tight mb-3">Skills Tested</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCompleted.skills.map((skill: string) => (
                                                <span key={skill} className="bg-[#F8F9FB] border border-black/5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1C1C1E]/60">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-black/5">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${['UNDER_REVIEW', 'SUBMITTED', 'REVIEWED'].includes(selectedCompleted.status) ? 'bg-blue-50 text-blue-600' :
                                            selectedCompleted.status === 'SHORTLISTED' ? 'bg-purple-50 text-purple-600' :
                                                selectedCompleted.status === 'INTERVIEW' ? 'bg-cyan-50 text-cyan-600' :
                                                    selectedCompleted.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                                                        selectedCompleted.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                                            'bg-gray-50 text-gray-600'
                                            }`}>
                                            {['UNDER_REVIEW', 'SUBMITTED', 'REVIEWED'].includes(selectedCompleted.status) ? 'Under Review' :
                                                selectedCompleted.status === 'SHORTLISTED' ? 'Shortlisted' :
                                                    selectedCompleted.status === 'INTERVIEW' ? 'Interview' :
                                                        selectedCompleted.status === 'ACCEPTED' ? 'Accepted' :
                                                            selectedCompleted.status === 'REJECTED' ? 'Rejected' : selectedCompleted.status}
                                        </span>
                                        <span className="text-xs text-[#1C1C1E]/30">
                                            Submitted {new Date(selectedCompleted.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

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
