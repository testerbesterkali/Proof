import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { TrendingUp, Eye, BarChart3, ArrowUpRight, ArrowDownRight, Activity, Users, Briefcase, Target, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProofItem {
    name: string;
    score: number;
    status: string;
    skills: string[];
}

type TimePeriod = '30d' | '60d' | '90d';

export function Analytics() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<TimePeriod>('30d');
    const [loading, setLoading] = useState(true);

    // Live metrics
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [avgScore, setAvgScore] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [companiesApplied, setCompaniesApplied] = useState(0);
    const [proofs, setProofs] = useState<ProofItem[]>([]);
    const [funnelData, setFunnelData] = useState<{ stage: string; count: number; color: string }[]>([]);

    useEffect(() => {
        if (!user) return;
        loadAnalytics();
    }, [user]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            // Get candidate profile
            const { data: profile } = await supabase
                .from('CandidateProfile')
                .select('id')
                .eq('userId', user!.id)
                .single();

            if (!profile?.id) {
                setLoading(false);
                return;
            }

            // Get all submissions
            const { data: submissions } = await supabase
                .from('Submission')
                .select('*')
                .eq('candidateId', profile.id)
                .order('createdAt', { ascending: false });

            if (!submissions) {
                setLoading(false);
                return;
            }

            setTotalSubmissions(submissions.length);

            // Calculate average AI score
            const scored = submissions.filter(s => s.score?.overall);
            const avg = scored.length > 0
                ? Math.round(scored.reduce((sum, s) => sum + s.score.overall, 0) / scored.length)
                : 0;
            setAvgScore(avg);

            // Count completed (reviewed/accepted)
            const completed = submissions.filter(s => ['REVIEWED', 'ACCEPTED'].includes(s.status)).length;
            setChallengesCompleted(completed);

            // Unique companies
            const challengeIds = [...new Set(submissions.map(s => s.challengeId))];
            const { data: challenges } = await supabase
                .from('Challenge')
                .select('id, title, employerId, requiredSkills, type, jobRole')
                .in('id', challengeIds);

            const employerIds = [...new Set(challenges?.map(c => c.employerId) || [])];
            setCompaniesApplied(employerIds.length);

            // Fetch employer names
            const { data: employers } = await supabase
                .from('EmployerProfile')
                .select('id, companyName')
                .in('id', employerIds);

            const challengeMap = new Map(challenges?.map(c => [c.id, c]) || []);
            const employerMap = new Map(employers?.map(e => [e.id, e]) || []);

            // Funnel data from status counts
            const statusCounts: Record<string, number> = {};
            submissions.forEach(s => {
                statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
            });

            setFunnelData([
                { stage: 'Submitted', count: statusCounts['SUBMITTED'] || 0, color: 'bg-blue-500' },
                { stage: 'Under Review', count: statusCounts['UNDER_REVIEW'] || 0, color: 'bg-purple-500' },
                { stage: 'Reviewed', count: statusCounts['REVIEWED'] || 0, color: 'bg-amber-500' },
                { stage: 'Accepted', count: statusCounts['ACCEPTED'] || 0, color: 'bg-green-500' },
            ]);

            // Build proof performance list
            const proofList: ProofItem[] = submissions.map(sub => {
                const ch = challengeMap.get(sub.challengeId);
                return {
                    name: ch?.title || 'Unknown Challenge',
                    score: sub.score?.overall || 0,
                    status: sub.status,
                    skills: ch?.requiredSkills || [],
                };
            });
            setProofs(proofList);

        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const profileMetrics = [
        { label: 'Total Submissions', value: totalSubmissions.toString(), change: totalSubmissions > 0 ? `+${totalSubmissions}` : '0', up: totalSubmissions > 0, icon: Activity },
        { label: 'Avg AI Score', value: avgScore > 0 ? `${avgScore}%` : '—', change: avgScore >= 80 ? 'Strong' : avgScore > 0 ? 'Growing' : '', up: avgScore >= 70, icon: Target },
        { label: 'Challenges Completed', value: challengesCompleted.toString(), change: challengesCompleted > 0 ? `${challengesCompleted} done` : '0', up: challengesCompleted > 0, icon: Eye },
        { label: 'Companies', value: companiesApplied.toString(), change: companiesApplied > 0 ? `${companiesApplied} unique` : '0', up: companiesApplied > 0, icon: Users },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                </div>
            </Layout>
        );
    }

    const maxFunnel = Math.max(...funnelData.map(f => f.count), 1);

    return (
        <Layout>
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1C1C1E]">Analytics & Insights</h1>
                        <p className="text-gray-500 mt-1">How your proofs are performing across the platform.</p>
                    </div>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {(['30d', '60d', '90d'] as TimePeriod[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-white shadow-sm text-[#1C1C1E]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {p === '30d' ? '30 Days' : p === '60d' ? '60 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {profileMetrics.map((m, i) => (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <m.icon className="w-5 h-5 text-gray-600" />
                                </div>
                                {m.change && (
                                    <span className={`text-sm font-medium flex items-center gap-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>
                                        {m.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        {m.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-[#1C1C1E]">{m.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Application Funnel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-lg text-[#1C1C1E]">Submission Funnel</h2>
                        </div>
                        {funnelData.every(f => f.count === 0) ? (
                            <p className="text-sm text-gray-400 py-8 text-center">No submissions yet. Start a challenge!</p>
                        ) : (
                            <div className="space-y-4">
                                {funnelData.map((f) => (
                                    <div key={f.stage}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-gray-700">{f.stage}</span>
                                            <span className="text-sm font-bold text-[#1C1C1E]">{f.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className={`${f.color} h-3 rounded-full transition-all duration-700`}
                                                style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Proof Performance Table */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-lg text-[#1C1C1E]">Proof Performance</h2>
                        </div>
                        {proofs.length === 0 ? (
                            <p className="text-sm text-gray-400 py-8 text-center">No proofs submitted yet.</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Challenge</th>
                                        <th className="pb-3 font-medium text-right">AI Score</th>
                                        <th className="pb-3 font-medium text-right">Status</th>
                                        <th className="pb-3 font-medium text-right">Skills</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proofs.map((p, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0">
                                            <td className="py-4 text-sm font-medium text-[#1C1C1E]">{p.name}</td>
                                            <td className="py-4 text-sm text-right">
                                                <span className={`font-bold ${p.score >= 80 ? 'text-green-600' : p.score >= 60 ? 'text-amber-500' : p.score > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {p.score > 0 ? `${p.score}/100` : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-right">
                                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                                                    {p.status.toLowerCase().replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-right text-gray-500">{p.skills.slice(0, 2).join(', ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                </div>

                {/* Benchmark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-8 text-white"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-6 h-6 text-proof-accent" />
                        <h2 className="font-bold text-lg">Your Benchmark</h2>
                    </div>
                    <p className="text-white/50 text-sm mb-6">How your proofs stack up.</p>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-3xl font-bold text-proof-accent">{avgScore > 0 ? `${avgScore}%` : '—'}</p>
                            <p className="text-sm text-white/40 mt-1">Average AI Score</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-proof-accent">{totalSubmissions}</p>
                            <p className="text-sm text-white/40 mt-1">Total Proofs Submitted</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-proof-accent">{companiesApplied}</p>
                            <p className="text-sm text-white/40 mt-1">Companies Reached</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
