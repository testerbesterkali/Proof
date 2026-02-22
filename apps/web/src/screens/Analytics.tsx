import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { TrendingUp, Eye, BarChart3, ArrowUpRight, ArrowDownRight, Activity, Users, Briefcase, Target } from 'lucide-react';

const profileMetrics = [
    { label: 'Profile Views', value: '1,247', change: '+18%', up: true, icon: Eye },
    { label: 'Proof Impressions', value: '4,892', change: '+24%', up: true, icon: Activity },
    { label: 'Employer Saves', value: '34', change: '+12%', up: true, icon: Users },
    { label: 'Match Score Avg', value: '87%', change: '-2%', up: false, icon: Target },
];

const funnelData = [
    { stage: 'Applied', count: 24, color: 'bg-blue-500' },
    { stage: 'Viewed', count: 18, color: 'bg-purple-500' },
    { stage: 'Interviewed', count: 7, color: 'bg-amber-500' },
    { stage: 'Offered', count: 3, color: 'bg-green-500' },
];

const proofPerformance = [
    { name: 'React Architecture Walkthrough', views: 482, avgWatch: '78%', saves: 12 },
    { name: 'TypeScript API Design', views: 321, avgWatch: '65%', saves: 8 },
    { name: 'System Design Interview', views: 198, avgWatch: '82%', saves: 15 },
    { name: 'CSS Animation Showcase', views: 156, avgWatch: '71%', saves: 4 },
];

type TimePeriod = '30d' | '60d' | '90d';

export function Analytics() {
    const [period, setPeriod] = useState<TimePeriod>('30d');

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto">
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
                                <span className={`text-sm font-medium flex items-center gap-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>
                                    {m.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {m.change}
                                </span>
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
                            <h2 className="font-bold text-lg text-[#1C1C1E]">Application Funnel</h2>
                        </div>
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
                                            style={{ width: `${(f.count / 24) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                                    <th className="pb-3 font-medium">Proof</th>
                                    <th className="pb-3 font-medium text-right">Views</th>
                                    <th className="pb-3 font-medium text-right">Avg. Watch</th>
                                    <th className="pb-3 font-medium text-right">Saves</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proofPerformance.map((p) => (
                                    <tr key={p.name} className="border-b border-gray-50 last:border-0">
                                        <td className="py-4 text-sm font-medium text-[#1C1C1E]">{p.name}</td>
                                        <td className="py-4 text-sm text-right text-gray-600">{p.views}</td>
                                        <td className="py-4 text-sm text-right text-gray-600">{p.avgWatch}</td>
                                        <td className="py-4 text-sm text-right text-gray-600">{p.saves}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>

                {/* Benchmark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-gradient-to-r from-[#0A192F] to-[#112240] rounded-2xl p-8 text-white"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-6 h-6 text-[#64FFDA]" />
                        <h2 className="font-bold text-lg">Your Benchmark</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">How you compare to similar candidates on the platform.</p>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-3xl font-bold text-[#64FFDA]">Top 12%</p>
                            <p className="text-sm text-gray-400 mt-1">in Frontend Engineering</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#64FFDA]">4.7x</p>
                            <p className="text-sm text-gray-400 mt-1">more saves than average</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#64FFDA]">2.1x</p>
                            <p className="text-sm text-gray-400 mt-1">faster response rate</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
