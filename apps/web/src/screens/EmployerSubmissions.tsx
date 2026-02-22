import * as React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Search, ChevronRight, Loader2, CheckCircle2, Clock, XCircle, FileText, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SubmissionData {
    id: string;
    candidateName: string;
    challengeTitle: string;
    status: string;
    submittedAt: string;
    score: number | null;
    candidateProfileId: string;
    challengeId: string;
}

export function EmployerSubmissions() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [submissions, setSubmissions] = React.useState<SubmissionData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        if (user) loadSubmissions();
    }, [user]);

    const loadSubmissions = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Get employer profile
            const { data: profile } = await supabase
                .from('EmployerProfile')
                .select('id')
                .eq('userId', user.id)
                .single();

            if (profile?.id) {
                // 2. Get challenges owned by this employer
                const { data: challenges } = await supabase
                    .from('Challenge')
                    .select('id, title')
                    .eq('employerId', profile.id);

                if (challenges && challenges.length > 0) {
                    const challengeIds = challenges.map(c => c.id);
                    const challengeMap = new Map(challenges.map(c => [c.id, c.title]));

                    // 3. Get submissions for those challenges
                    const { data: submissionData } = await supabase
                        .from('Submission')
                        .select('*, CandidateProfile(userId)')
                        .in('challengeId', challengeIds)
                        .order('submittedAt', { ascending: false });

                    if (submissionData) {
                        // For a real app we'd join user table for candidate name, but for now we'll fetch mock names or map from CandidateProfile
                        const formatted = submissionData.map((s: any) => ({
                            id: s.id,
                            candidateName: `Candidate #${s.candidateProfileId.substring(0, 6)}`, // Fallback name
                            challengeTitle: challengeMap.get(s.challengeId) || 'Unknown Challenge',
                            status: s.status,
                            score: s.score,
                            submittedAt: s.submittedAt,
                            candidateProfileId: s.candidateProfileId,
                            challengeId: s.challengeId,
                        }));
                        setSubmissions(formatted);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to load submissions:', err);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status, score }: { status: string, score: number | null }) => {
        if (status === 'REVIEWED' || status === 'ACCEPTED' || status === 'REJECTED') {
            return (
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {status}
                    </span>
                    {score !== null && (
                        <span className="text-xs font-bold text-[#1C1C1E]/60">Score: {score}%</span>
                    )}
                </div>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 flex items-center gap-1 w-max">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                NEEDS REVIEW
            </span>
        );
    };

    const filtered = submissions.filter(s =>
        s.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Link to="/employer/challenges" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <Briefcase size={18} /> Challenges
                    </Link>
                    <Link to="/employer/submissions" className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1E]/5 text-[#1C1C1E] rounded-2xl font-bold text-sm">
                        <Users size={18} /> Submissions
                    </Link>
                    <Link to="/employer/messages" className="flex items-center gap-3 px-4 py-3 text-[#1C1C1E]/40 hover:text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-2xl font-bold text-sm transition-all">
                        <MessageSquare size={18} /> Messages
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all shadow-sm bg-white border border-red-100">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">SUBMISSIONS</h1>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest">
                            Review candidate proof of work
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/30" size={16} />
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-white border border-transparent focus:border-[#1C1C1E]/10 rounded-full py-3 pl-12 pr-6 text-sm font-bold w-64 shadow-soft transition-all focus:outline-none"
                            />
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1C1C1E]/30" />
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 shadow-soft border border-white text-center">
                        <div className="w-24 h-24 bg-[#E4E5E7]/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-[#1C1C1E]/20" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-4">NO SUBMISSIONS YET</h2>
                        <p className="text-[#1C1C1E]/40 font-bold text-sm uppercase tracking-widest mb-10">
                            When candidates complete your challenges, they'll appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        {filtered.length === 0 ? (
                            <div className="text-center py-24 text-[#1C1C1E]/40 font-bold">No submissions match your search.</div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-8 shadow-soft border border-white">
                                <div className="grid grid-cols-5 text-[10px] font-black uppercase tracking-widest text-[#1C1C1E]/30 px-6 pb-4 border-b border-[#1C1C1E]/5 mb-4">
                                    <div className="col-span-2">Candidate</div>
                                    <div>Challenge</div>
                                    <div>Status</div>
                                    <div className="text-right">Action</div>
                                </div>

                                <div className="space-y-2">
                                    {filtered.map((sub, i) => (
                                        <Link
                                            to={`/employer/review/${sub.id}`}
                                            key={sub.id}
                                            className="grid grid-cols-5 items-center p-6 bg-[#E4E5E7]/30 rounded-[2rem] hover:bg-[#1C1C1E]/5 transition-all group cursor-pointer"
                                        >
                                            <div className="col-span-2 flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black group-hover:bg-[#1C1C1E] group-hover:text-white transition-colors">
                                                    {sub.candidateName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm">{sub.candidateName}</h4>
                                                    <p className="text-[10px] font-bold text-[#1C1C1E]/40 uppercase tracking-widest mt-1">
                                                        {new Date(sub.submittedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-semibold text-sm truncate pr-4">{sub.challengeTitle}</p>
                                            </div>

                                            <div>
                                                <StatusBadge status={sub.status} score={sub.score} />
                                            </div>

                                            <div className="flex justify-end">
                                                <div className="w-10 h-10 rounded-xl bg-white text-[#1C1C1E]/40 group-hover:bg-[#1C1C1E] group-hover:text-white flex items-center justify-center shadow-sm transition-all">
                                                    <ChevronRight size={18} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
